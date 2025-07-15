export type Dependency = 
  | string
  | {
      name: string;
      version?: string;
    };

export type Feature = {
  name: string;
  default: boolean;
  dependencies?: Dependency[];
  scripts?: Record<string, string>;
};

export type Template = {
  name: string;
  shortNames: string[];
  description: string;
  dependencies?: Dependency[];
  scripts?: Record<string, string>;
  features: Record<string, Feature>;
  contentFolder?: string; // Optional, defaults to "content"
};

export type TemplateConfig = {
  path: string;
} & Template;
