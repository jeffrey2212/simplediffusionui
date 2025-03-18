import { Node, Edge, XYPosition } from 'reactflow';

// Option interface for dynamic attributes
export type ModuleType = 'CHARACTER' | 'STYLE' | 'ATTACHMENT' | 'ENVIRONMENT';

export interface AttributeOption {
  value: string;
  label: string;
  preview?: string;
  subParams?: DynamicAttribute[];
}

// Dynamic attribute interface
export interface DynamicAttribute {
  key: string;
  label: string;
  type: 'text' | 'select';
  value: string;
  options?: AttributeOption[];
}

// Module attributes interface
export interface ModuleAttributes {
  dynamicAttributes: DynamicAttribute[];
  parameters?: Record<string, number>;
}

// Module data interface for node data
export interface ModuleNodeData {
  id: string;
  type: ModuleType;
  title: string;
  icon: string;
  position?: XYPosition;
  attributes: ModuleAttributes;
}

// Custom node type for React Flow
export interface CustomNode extends Node<ModuleNodeData> {
  id: string;
  type: ModuleType;
  position: XYPosition;
  data: ModuleNodeData;
}

// Custom edge type for React Flow
export interface CustomEdge extends Edge {
  source: string;
  target: string;
}

// Prompt module type
export type PromptModule = ModuleNodeData;

// Custom elements type
export type CustomElements = (CustomNode | CustomEdge)[];