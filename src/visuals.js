import ritual from './assets/incense-hands.webp';
import water from './assets/water-hands.webp';
import bowl from './assets/golden-bowl.webp';
import yoga from './assets/yoga-pose.webp';
import flow from './assets/sun-movement.webp';
import fabric from './assets/sheer-fabric.webp';
import movement from './assets/body-detail.webp';
import spa from './assets/spa-ritual.webp';
import tea from './assets/tea-pouring.webp';

// Original photographs supplied by the owner in Архив.zip.
// Editorial covers do not identify demo teachers or document real YOG cases.
export const visuals = {
  ritual: { src: ritual, alt: 'Руки с чашей и тонким дымом' },
  water: { src: water, alt: 'Капли воды между ладонями' },
  bowl: { src: bowl, alt: 'Руки над керамической чашей в тёплом свете' },
  yoga: { src: yoga, alt: 'Мягкое вытяжение в позе йоги' },
  flow: { src: flow, alt: 'Движение в тёплом солнечном свете' },
  fabric: { src: fabric, alt: 'Мягкие складки полупрозрачной ткани' },
  movement: { src: movement, alt: 'Деталь движения тела' },
  spa: { src: spa, alt: 'Спокойный ритуал с водой при свечах' },
  tea: { src: tea, alt: 'Чайный ритуал в солнечном свете' },
};
export const practiceVisual = (p) =>
  p.type === 'Йога' ? 'yoga' : p.type === 'Дыхание' ? 'water' :
  p.type === 'Подкасты' ? 'tea' : p.media === 'Видео' ? 'movement' : 'ritual';
export const courseVisual = (c) =>
  c.tag === 'Йога' ? 'yoga' : c.tag === 'Медитации' ? 'ritual' :
  c.tag === 'Дыхание' ? 'water' : c.format === 'Офлайн' ? 'spa' : 'flow';
