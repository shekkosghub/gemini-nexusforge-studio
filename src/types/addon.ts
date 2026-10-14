export type PlatformType = 'blender' | 'zbrush' | 'procreate' | 'photoshop';

export type ResourceType = 'script' | 'panel' | 'shader' | 'brush' | 'suite';

export interface AddonFile {
  filename: string;
  language: string;
  description: string;
  code: string;
}

export interface SimulatedControl {
  id: string;
  label: string;
  type: string;
  icon?: string;
  description: string;
}

export interface MarketplaceInfo {
  title: string;
  suggestedPriceUSD: number;
  taglines: string[];
  features: string[];
  targetAudience: string;
  installationGuide: string;
  tags: string[];
}

export interface AddonProject {
  name: string;
  identifier: string;
  version: string;
  summary: string;
  platform: PlatformType;
  resourceType: ResourceType;
  files: AddonFile[];
  simulatedControls: SimulatedControl[];
  marketplaceInfo: MarketplaceInfo;
}

export interface TemplatePreset {
  id: string;
  title: string;
  platform: PlatformType;
  resourceType: ResourceType;
  category: string;
  priceEstimate: string;
  prompt: string;
}
