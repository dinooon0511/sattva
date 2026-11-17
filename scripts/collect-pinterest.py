#!/usr/bin/env python3
"""Collect the publicly exposed part of a Pinterest board, without account cookies.

The reader fallback receives only a public board URL. A successful collection is
not evidence that every pin in the board was exposed. Selection is always manual.
"""
import argparse
import concurrent.futures
import html
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import urlparse


def fetch(url):
    result = subprocess.run(
        ['curl', '--fail', '--location', '--silent', '--show-error',
         '--max-time', '45', url], capture_output=True, text=True,
    )
    return result.stdout if result.returncode == 0 else ''


def collect(board, output, download=False):
    parsed = urlparse(board)
    if parsed.scheme != 'https' or parsed.hostname not in {
        'www.pinterest.com', 'pinterest.com', 'ru.pinterest.com', 'www.pinterest.ru',
    }:
        raise ValueError('Use an HTTPS public Pinterest board URL, without login data.')
    parts = [x for x in parsed.path.split('/') if x]
    if len(parts) != 2 or not all(re.fullmatch(r'[\w%-]+', x) for x in parts):
        raise ValueError('Expected /owner/board/; individual pins and login URLs are not boards.')
    canonical = 'https://www.pinterest.com/' + '/'.join(parts) + '/'
    sources = [canonical, 'https://r.jina.ai/' + canonical,
               'https://r.jina.ai/' + canonical.rstrip('/') + '.rss']
    output.mkdir(parents=True, exist_ok=True)
    images = {}
    observations = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        bodies = list(pool.map(fetch, sources))
    for number, (source, body) in enumerate(zip(sources, bodies), 1):
        (output / f'source-{number}.txt').write_text(body)
        observations.append({'url': source, 'response_received': bool(body)})
        for match in re.finditer(r'https://i\.pinimg\.com/(?:236x|474x|736x|originals)/([a-f0-9/]+\.(?:jpg|png|webp))', html.unescape(body)):
            path = match.group(1)
            entry = images.setdefault(path, {
                'board': canonical, 'image': 'https://i.pinimg.com/736x/' + path,
                'file': path.split('/')[-1], 'sources': [],
                'review': 'unreviewed', 'pin': None,
            })
            if source not in entry['sources']:
                entry['sources'].append(source)
            # RSS associates each thumbnail with its public pin permalink.
            nearby = body[match.end():match.end() + 500]
            pin = re.search(r'https://www\.pinterest\.com/pin/[^)\s"<>]+', nearby)
            if pin:
                entry['pin'] = pin.group(0)
    entries = list(images.values())
    if download:
        def save(entry):
            result = subprocess.run(
                ['curl', '--fail', '--location', '--silent', '--show-error',
                 '--max-time', '30', entry['image'], '-o', str(output / entry['file'])],
                capture_output=True,
            )
            entry['downloaded'] = result.returncode == 0
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
            list(pool.map(save, entries))
    manifest = {'board': canonical, 'scope': 'publicly exposed subset; completeness unknown',
                'count': len(entries), 'sources': observations, 'images': entries}
    (output / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f'Collected {len(entries)} unique public images. Full-board coverage is not established.')
    if not entries:
        raise SystemExit('No public images received; login/access may be required. Do not bypass login.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('board', help='Public URL such as https://www.pinterest.com/owner/board/')
    parser.add_argument('--output', type=Path, default=Path('artifacts/pinterest'))
    parser.add_argument('--download', action='store_true')
    args = parser.parse_args()
    collect(args.board, args.output, args.download)
