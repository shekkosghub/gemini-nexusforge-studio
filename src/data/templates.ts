import { TemplatePreset } from '../types/addon';

export const STARTER_TEMPLATES: TemplatePreset[] = [
  {
    id: 'blender-hardsurface-baker',
    title: 'HardSurface QuickBaker & Seams',
    platform: 'blender',
    resourceType: 'suite',
    category: '3D Modeling & UV',
    priceEstimate: '$24 USD',
    prompt: 'A Blender 4.2+ N-panel addon that calculates sharp mesh dihedral angles, marks UV seams automatically, assigns non-destructive bevel weights, and generates an inflated vertex displacement cage for high-to-low texture baking.'
  },
  {
    id: 'blender-cable-generator',
    title: 'Procedural Curve Cable & Pipe Router',
    platform: 'blender',
    resourceType: 'script',
    category: 'Procedural Sci-Fi',
    priceEstimate: '$19 USD',
    prompt: 'A Blender operator addon that takes two selected faces or vertices, draws a physics catenary curve between them with sag and tension sliders, and wraps procedural braided insulation or ribbed conduit around the curve.'
  },
  {
    id: 'zbrush-subtool-master',
    title: 'Subtool MasterPro & Decimator',
    platform: 'zbrush',
    resourceType: 'script',
    category: 'Sculpting Workflow',
    priceEstimate: '$19 USD',
    prompt: 'A ZBrush ZScript plugin that adds a shelf menu to batch-rename all subtools with prefixes, execute automated Decimation Master queues while preserving polypaint, and export high-res diffuse texture clones.'
  },
  {
    id: 'zbrush-seam-stitching',
    title: 'Leather Stitch & Zipper Curve Macro',
    platform: 'zbrush',
    resourceType: 'brush',
    category: 'Creature & Costuming',
    priceEstimate: '$15 USD',
    prompt: 'A ZBrush curve brush macro that draws double-needle saddle stitches along mesh creases with dynamic depth, thread fray jitter, and stitch spacing controls for clothing and holster production.'
  },
  {
    id: 'procreate-chiaroscuro-oils',
    title: 'Chiaroscuro Master Oil & Impasto',
    platform: 'procreate',
    resourceType: 'brush',
    category: 'Traditional Digital Media',
    priceEstimate: '$16 USD',
    prompt: 'A Procreate dual-brush kit configuration with thick impasto knife ridges, coarse Belgian linen canvas grain, wet acrylic mixing bleed, and pressure-sensitive Apple Pencil tilt response for classical portraiture.'
  },
  {
    id: 'procreate-anime-lineart',
    title: 'G-Pen & Clean Ink Studio Kit',
    platform: 'procreate',
    resourceType: 'brush',
    category: 'Illustration & Manga',
    priceEstimate: '$12 USD',
    prompt: 'A precision Japanese G-Pen inking brush preset for Procreate with zero-lag streamline stabilization, razor-sharp pressure taper, subtle sumi-e ink bleeding, and screen tone screentone halftone stamps.'
  },
  {
    id: 'photoshop-smart-slicer',
    title: 'Smart Asset Slicer & Exporter UXP',
    platform: 'photoshop',
    resourceType: 'panel',
    category: 'Game UI & 2D Pipeline',
    priceEstimate: '$22 USD',
    prompt: 'A Photoshop UXP panel for 2D game artists and UI designers that automatically isolates selected layers, trims transparent bounds via batchPlay, and exports 1x/2x/3x WebP and PNG sprites with standardized naming.'
  },
  {
    id: 'photoshop-pixel-art-grid',
    title: 'Retro Pixel Art Grid & Color Limiter',
    platform: 'photoshop',
    resourceType: 'script',
    category: 'Retro Gaming',
    priceEstimate: '$14 USD',
    prompt: 'An ExtendScript JSX tool that snaps drawing guides to 8x8 and 16x16 tile grids, quantizes active selections to 16-color retro palettes (e.g. Game Boy, PICO-8, EGA), and exports sprite sheets.'
  }
];
