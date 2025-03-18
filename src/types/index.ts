import { ModuleNodeData as ModuleData } from './types';
export * from './types';

export interface PromptModule {
  id: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE' | 'ENVIRONMENT';
  title: string;
  icon: string;
  position?: { x: number; y: number };
  attributes: {
    coreAttributes?: {
      gender?: string;
      ageStage?: string;
      style?: string;
    };
    dynamicAttributes: Array<{
      key: string;
      label: string;
      type: 'text' | 'select';
      value: string;
      options?: Array<{
        value: string;
        label: string;
        preview?: string;
        subParams?: Array<{
          key: string;
          label: string;
          type: 'text' | 'select';
          options?: Array<{
            value: string;
            label: string;
            preview?: string;
          }>;
        }>;
      }>;
    }>;
    parameters: Record<string, number>;
  };
}

export interface ModuleAttributes {
  coreAttributes?: {
    gender?: string;
    ageStage?: string;
    style?: string;
  } | Partial<{
    gender: string;
    ageStage: string;
    style: string;
  }>;
  dynamicAttributes?: ModuleData['attributes']['dynamicAttributes'];
  parameters: Record<string, number>;
}

export interface CoreAttributes {
  gender: 'male' | 'female'  ;
  ageStage: 'child' | 'youth' | 'middle' | 'elder';
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
