import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Node as FlowNode,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  Handle,
  Position,
  NodeProps,
  BaseEdge,
  EdgeProps,
  getSmoothStepPath,
  NodeTypes,
  EdgeTypes,
  IsValidConnection,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PromptModule, ModuleConnection, DynamicAttribute, ModuleAttributes } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import DynamicAttributeForm from './DynamicAttributeForm';

interface ModuleFlowProps {
  modules: PromptModule[];
  onRemoveModule: (moduleId: string) => void;
  onUpdateParameter: (index: number, paramName: string, value: number) => void;
  onAttach: (sourceId: string, targetId: string) => void;
  onDetach: (connectionId: string) => void;
}

type ModuleNodeData = Record<string, unknown> & {
  id: string;
  title: string;
  icon: string;
  type: 'CHARACTER' | 'ATTACHMENT' | 'STYLE' | 'ENVIRONMENT';
  onRemove: (id: string) => void;
  onDetachEdge: (edgeId: string) => void;
  attributes: ModuleAttributes;
  renderContent: () => React.ReactNode;
};

const ModuleNode = React.memo(({ data }: NodeProps<ModuleNodeData>) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSummaryText = () => {
    const parts = [];
    if (data.attributes.coreAttributes) {
      parts.push(`${data.attributes.coreAttributes.gender}, ${data.attributes.coreAttributes.ageStage}`);
    }
    if (data.attributes.dynamicAttributes) {
      parts.push(
        ...data.attributes.dynamicAttributes.map(
          (attr: DynamicAttribute) => `${attr.label}: ${attr.value}`
        )
      );
    }
    return parts.join(' | ');
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-gray-700 rounded-lg shadow-lg border border-gray-600 hover:border-purple-500/30 transition-colors min-w-[300px]"
    >
      {data.type === 'CHARACTER' && (
        <>
          <Handle
            type="target"
            position={Position.Top}
            className="w-3 h-3 bg-purple-500"
          />
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 bg-purple-500"
          />
          <Handle
            type="target"
            position={Position.Right}
            className="w-3 h-3 bg-purple-500"
          />
        </>
      )}
      {data.type === 'ATTACHMENT' && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-purple-500"
        />
      )}
      <div className="p-4 flex items-center justify-between border-b border-gray-600">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{data.icon}</span>
          <div>
            <h3 className="text-lg font-medium text-gray-200">{data.title}</h3>
            {!isExpanded && (
              <p className="text-sm text-gray-400 mt-1">
                {getSummaryText()}
              </p>
            )}
          </div>
          {data.type === 'ATTACHMENT' && (
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              附加项
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-600 rounded"
          >
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => data.onRemove(data.id)}
            className="p-1 hover:bg-red-500/20 text-red-400 rounded"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {data.renderContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

const nodeTypes: NodeTypes = {
  moduleNode: ModuleNode as React.ComponentType<NodeProps<ModuleNodeData>>,
};

const edgeTypes: EdgeTypes = {
  attachment: (props: EdgeProps) => {
    const { sourceX, sourceY, targetX, targetY } = props;
    const [path] = getSmoothStepPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
      borderRadius: 16,
    });

    return (
      <BaseEdge
        path={path}
        markerEnd={props.markerEnd}
        style={{
          strokeWidth: 2,
          stroke: '#9333ea',
          strokeDasharray: '5,5',
        }}
      />
    );
  },
};

export default function ModuleFlow({
  modules,
  onRemoveModule,
  onUpdateParameter,
  onAttach,
  onDetach,
}: ModuleFlowProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ModuleNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const hasCharacterNode = nodes.some(node => node.data.type === 'CHARACTER');

  const generateUniqueEdgeId = useCallback((sourceId: string, targetId: string) => {
    const timestamp = Date.now();
    return `e-${sourceId}-${targetId}-${timestamp}`;
  }, []);

  const isValidConnection = useCallback<IsValidConnection>(
    (connection: Connection | Edge) => {
      const sourceModule = modules.find(m => m.id === connection.source);
      const targetModule = modules.find(m => m.id === connection.target);

      // Only allow connections from attachment nodes to character nodes
      return !!(
        sourceModule?.type === 'ATTACHMENT' &&
        targetModule?.type === 'CHARACTER' &&
        hasCharacterNode
      );
    },
    [modules, hasCharacterNode]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!isValidConnection(params)) return;

      const sourceModule = modules.find(m => m.id === params.source);
      const targetModule = modules.find(m => m.id === params.target);

      if (
        sourceModule?.type === 'ATTACHMENT' &&
        targetModule?.type === 'CHARACTER' &&
        params.source &&
        params.target
      ) {
        const edgeId = generateUniqueEdgeId(params.source, params.target);
        const edge: Edge = {
          id: edgeId,
          source: params.source,
          target: params.target,
          type: 'attachment',
          animated: true,
          data: {
            onDelete: () => {
              setEdges(eds => eds.filter(e => e.id !== edgeId));
              onDetach(edgeId);
            }
          }
        };
        setEdges(eds => [...eds, edge]);
        onAttach(params.source, params.target);
      }
    },
    [modules, onAttach, onDetach, generateUniqueEdgeId, isValidConnection]
  );

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (edge.data?.onDelete) {
      edge.data.onDelete();
    }
  }, []);

  // Update nodes when modules change
  useEffect(() => {
    const newNodes = modules.map((module, index) => ({
      id: module.id,
      type: 'moduleNode',
      position: { x: index * 350, y: module.type === 'ATTACHMENT' ? 200 : 0 },
      draggable: true,
      data: {
        id: module.id,
        title: module.title,
        icon: module.icon,
        type: module.type,
        onRemove: onRemoveModule,
        onDetachEdge: onDetach,
        attributes: module.attributes,
        renderContent: () => (
          <div className="space-y-4">
            {module.attributes.coreAttributes && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">核心属性</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-800 rounded">
                    <div className="text-xs text-gray-400">性别</div>
                    <div className="text-sm text-gray-200">
                      {module.attributes.coreAttributes.gender}
                    </div>
                  </div>
                  <div className="p-2 bg-gray-800 rounded">
                    <div className="text-xs text-gray-400">年龄段</div>
                    <div className="text-sm text-gray-200">
                      {module.attributes.coreAttributes.ageStage}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {module.attributes.dynamicAttributes?.map((attr: DynamicAttribute) => (
              <div key={attr.key}>
                <DynamicAttributeForm
                  attribute={attr}
                  onValueChange={(key: string, value: number) => {
                    const moduleIndex = modules.findIndex(m => m.id === module.id);
                    if (moduleIndex !== -1) {
                      onUpdateParameter(moduleIndex, key, value);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        ),
      },
    })) as Node<ModuleNodeData>[];

    setNodes(newNodes);
  }, [modules, onRemoveModule, onUpdateParameter, onDetach]);

  // Generate prompt
  const generatePrompt = () => {
    return modules.map(module => {
      const params = [
        // Core attributes
        module.attributes.coreAttributes && 
          `性别:${module.attributes.coreAttributes.gender}, 年龄:${module.attributes.coreAttributes.ageStage}`,
        // Dynamic attributes
        ...(module.attributes.dynamicAttributes?.map(attr => 
          `${attr.label}:${attr.key}`
        ) || []),
        // Base parameters
        ...Object.entries(module.attributes.parameters).map(([key, value]) => 
          `${key}:${value}`
        )
      ].filter(Boolean);
      
      return `${module.title} (${params.join(', ')})`;
    }).join(' + ');
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="w-full h-[600px] relative bg-gray-800 rounded-lg border border-gray-700">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeClick={onEdgeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={true}
          nodesConnectable={hasCharacterNode}
          connectOnClick={false}
          isValidConnection={isValidConnection}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-purple-400 mb-4">生成的 Prompt</h3>
        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-300 font-mono text-sm break-all">
            {generatePrompt()}
          </p>
        </div>
      </div>
    </div>
  );
}
