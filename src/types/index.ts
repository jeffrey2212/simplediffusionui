export interface PromptModule {
  id: string;
  title: string;
  icon: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE' | 'ENVIRONMENT';
  attributes: ModuleAttributes;
}

export interface ModuleAttributes {
  coreAttributes?: {
    gender: string;
    ageStage: string;
  };
  dynamicAttributes?: DynamicAttribute[];
  parameters: Record<string, number>;
}

export interface DynamicAttribute {
  key: string;
  label: string;
  value: number;
}

export interface CoreAttributes {
  gender: 'male' | 'female' | 'neutral';
  ageStage: 'child' | 'youth' | 'middle' | 'elder';
}

export interface AttributeOption {
  value: string;
  preview: string;
  subParams?: {
    key: string;
    controls: ParamConfig[];
  };
}

export interface ParamRange {
  min: number;
  max: number;
  step?: number;
}

export interface ParamConfig {
  type: string;
  label: string;
  range?: ParamRange;
  options?: any[];
}

export interface ModuleCategoryProps {
  title: string;
  type: string;
  items: PromptModule[];
  disabled?: boolean;
}

export interface ModuleConnection {
  id: string;
  sourceId: string;
  targetId: string;
}
