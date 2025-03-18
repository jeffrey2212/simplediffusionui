import { Node, NodeProps as ReactFlowNodeProps, XYPosition, Position } from '@xyflow/react';
import { ReactNode } from 'react';

// Option interface for dynamic attributes
export interface AttributeOption {
  value: string;
  label: string;
  preview?: string;
  subParams?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: AttributeOption[];
  }>;
}

// Dynamic attribute interface
export interface DynamicAttribute {
  key: string;
  value: string;
  label: string;
  type: 'text' | 'select';
  options?: AttributeOption[];
  subParams?: Array<{
    key: string;
    label: string;
    type: 'text' | 'select';
    options?: AttributeOption[];
  }>;
}

// Base node data interface
export interface BaseNodeData extends Record<string, unknown> {
  id: string;
  title: string;
  icon: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE' | 'ENVIRONMENT';
  position: XYPosition;
  attributes: {
    dynamicAttributes: DynamicAttribute[];
    parameters: Record<string, unknown>;
  };
  onRemove: (id: string) => void;
  onDetachEdge: (edgeId: string) => void;
  renderContent: () => ReactNode;
  getSummaryText?: () => string;
}

// Module data interface for node data
export interface ModuleNodeData extends BaseNodeData {
  data: BaseNodeData;
}

// Node type for React Flow
export interface ModuleNode extends Node<ModuleNodeData> {
  id: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE';
  position: XYPosition;
  data: ModuleNodeData;
  width?: number;
  height?: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  draggable?: boolean;
  selectable?: boolean;
  connectable?: boolean;
}

// Props type for node components
export interface NodeComponentProps<T extends ModuleNodeData = ModuleNodeData> {
  data: T;
  id: string;
  selected?: boolean;
  isConnectable?: boolean;
  dragHandle?: string;
  dragging?: boolean;
  width?: number;
  height?: number;
  sourcePosition?: Position;
  targetPosition?: Position;
  parentId?: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE';
}