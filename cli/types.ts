export type Feature = {
  name: string;
  default: boolean;
};

export type Template = {
  name: string;
  shortNames: string[];
  description: string;
  features: Record<string, Feature>;
  contentFolder?: string; // Optional, defaults to "content"
};

export type TemplateConfig = {
  path: string;
} & Template;
