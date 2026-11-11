# Design QA · version 2

final result: passed

## Scope

User requested an extensive extension of the existing first-reference-inspired design, not a new visual direction. SATTVA now owns all personal practices, meditation, courses and teachers. YOG owns commercial event production. The research workspace now includes audit and business strategy.

Source visual truth: `/workspace/generated_images/exec-a4dcd4ba-6dce-4892-852e-f608ba7d68c5.png`, first selected reference. Source raster 852 × 1846 normalized to 390 × 844 CSS pixels. Current homepage evidence: `artifacts/v2-home.png`, 390 × 844, deviceScaleFactor 1, SATTVA homepage with fresh storage. Source and current implementation viewed together in `artifacts/v2-comparison.png`; focused control region: `artifacts/v2-comparison-focus.png`.

Current production screenshots: `artifacts/v2-desktop.png` (1440 × 1200 viewport, full page), `v2-mobile-workspace.png` (390 × 1000 viewport), `v2-courses.png`, `v2-offline-course.png`, `v2-teachers.png`, `v2-teacher.png`, `v2-yog-formats.png`, `v2-economics.png`, `v2-audit.png`, `v2-cjm.png`. Each reviewed after capture. Public audit screenshots in `public/audit` were captured before this implementation from the original local commit 9fdd687 and inspected individually.

Browser: system Chromium with Playwright; native desktop/browser control tools were unavailable. Screenshots are browser-rendered evidence. Production preview port 4174. Local browser tests and production-output browser tests completed all 22 scenarios without page errors or console errors.

## Findings, fixes and accepted changes

1. Prior P2: course and teacher actions were below long descriptions. Fixed with persistent price/action dock above navigation. Verified on offline course, teacher and class screens; scrollable body remains accessible.
2. Prior P2: catalogue too shallow for displayed categories. Now 24 materials with multiple meditations, yoga video examples, breathing, podcasts and webinars. Media filtering and empty-state recovery verified.
3. Prior P1 product ambiguity: YOG and SATTVA shared practice positioning. Navigation is now separated: five SATTVA destinations versus four event-focused YOG destinations; shared purchases remain accessible in «Моё». Switching from a product to SATTVA is intentional.
4. Input label lookup found an ambiguity with nested selects during testing. Explicit labels were attached to controls; final functional run passes all affected forms.
5. Empty matching results initially repeated «Изменить подбор». Removed duplicate action, reran the path.
6. Intermediate test interruption caused by Vite hot reload during formatting was not counted as a pass. Another test disambiguated the «Курсы» profile tab from the persistent navigation. Final results use a stable production build.
7. Intentional expansion: the homepage continues below the fold with catalogue, teachers and an offline programme. First-reference hierarchy, white surface, serif hero and contour artwork are preserved. Five bottom destinations and the additional homepage content are user-requested product changes, not accidental source drift.

## Five fidelity surfaces

- Typography: serif hero and programme titles with readable sans-serif controls; same visual family as the selected reference. Exact source font unspecified. Long course names wrap without clipping; sticky prices remain legible.
- Spacing and layout: fixed 390 × 844 application canvas, independent scroll, persistent bottom navigation; desktop sidebar and mobile horizontal project menu. No whole-page horizontal overflow at 375, 390 and 768 CSS pixels. The CJM itself intentionally scrolls horizontally.
- Color/tokens: restrained black, white and neutral light surfaces. Active state also uses labels and pressed state. No color-only meaning in purchase or cancellation states.
- Imagery: original generated contour raster reused. No invented testimonials, teacher photos, treatment outcomes or fake verification badges. Source audit screens are actual screenshots, not generated reconstructions.
- Copy: demonstration boundaries explicit at payment, media, qualification, addresses, author drafts, notifications and economics. Offline course explains dates, programme, inclusions and exclusions. YOG explains estimates and additional costs.

## Functional evidence

22 completed scenarios on the stable production build:
1. Homepage, artwork and brand navigation.
2. Multiple meditations, audio/video filters and video-player demonstration.
3. Matching empty state, recovery and favourites.
4. Teacher filtering, offline package, time and checkout.
5. Cancellation confirmation and preserved history.
6. Offline calendar filtering and booking.
7. Waitlist joining and removal.
8. Four-day Petersburg programme, exclusions and enrollment.
9. Free online sample, purchase, lessons and persistent progress.
10. Course-search empty state and reset.
11. Club boundaries, activation and cancellation without loss of courses.
12. Gift amount and explicit nonmonetary certificate.
13. Author draft, access terms and unpublished state.
14. Teacher slot creation and commission model.
15. Commercial YOG navigation, brand brief and proposal example.
16. Preferences without message sending.
17. Fifteen JTBD, filters and live scenario link.
18. Seven CJM with touchpoints and process owners.
19. Thirteen User Flow and proposal stages.
20. Audit evidence and filtering by lens.
21. Business calculator, zero-margin boundary and roadmap.
22. Mobile/tablet reflow without viewport overflow.

## Publication issue found during audit

Initial public URL returned HTTP 200 but source HTML referenced `/src/main.jsx` (404); favicon also 404. Public flows were therefore blocked. Downloaded previous Pages artifact contained correctly built HTML; the raw source being served publicly was a publication/source mismatch rather than a local build error. `scripts/verify-dist.mjs` now fails if production HTML points to source and verifies required assets. Publication must be verified with a fresh browser-rendered public page, not a build badge. Public revalidation outcome will be added after deployment.

## Limits and follow-up

No claim of full WCAG compliance; screen reader, systematic contrast measurement and real media-caption review remain separate checks. No working payment, booking, account, author verification, messaging or payout backend. All profiles, slots, prices, sample programmes and revenue assumptions are illustrative. P3: exact source-font matching, slightly stronger contour lines, and deferred loading of long research documents if production analytics show a need. Build reports a large-chunk warning (about 172 KB gzip for combined JS), not a functional failure.
