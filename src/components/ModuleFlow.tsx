import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  EdgeTypes,
  ConnectionMode,
  ReactFlowInstance,
  ReactFlowProvider,
  Panel,
  useReactFlow,
  Background,
  Controls,
  EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  IsValidConnection,
  NodeProps,
  XYPosition,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptModule } from '../types';
import { ModuleNode, ModuleNodeData, BaseNodeData, DynamicAttribute } from '../types/types';
import DynamicAttributeForm from './DynamicAttributeForm';
import CharacterNode from './nodes/CharacterNode';
import AttachmentNode from './nodes/AttachmentNode';
import StyleNode from './nodes/StyleNode';

interface ModuleFlowProps {
  modules: PromptModule[];
  onRemoveModule: (moduleId: string) => void;
  onUpdateParameter: (index: number, paramName: string, value: number) => void;
  onAttach: (sourceId: string, targetId: string) => void;
  onDetach: (connectionId: string) => void;
  onUpdateModules: (modules: PromptModule[]) => void;
}

const nodeTypes: NodeTypes = {
  CHARACTER: CharacterNode,
  ATTACHMENT: AttachmentNode,
  STYLE: StyleNode,
};

const edgeTypes: EdgeTypes = {
  attachment: (props: EdgeProps) => {
    const { id, source, target, data } = props;
    const [edgePath, labelX, labelY] = getSmoothStepPath({
      ...props,
      borderRadius: 16,
    });

    return (
      <>
        <BaseEdge path={edgePath} />
        {data && typeof data === 'object' && 'onDelete' in data && (
          <foreignObject
            width={20}
            height={20}
            x={labelX - 10}
            y={labelY - 10}
            className="edgebutton-foreignobject"
            requiredExtensions="http://www.w3.org/1999/xhtml"
          >
            <button
              className="edgebutton"
              onClick={(event) => {
                event.stopPropagation();
                (data as { onDelete: () => void }).onDelete();
              }}
            >
              ×
            </button>
          </foreignObject>
        )}
      </>
    );
  }
};

const ModuleFlow: React.FC<ModuleFlowProps> = ({
  modules,
  onRemoveModule,
  onUpdateParameter,
  onAttach,
  onDetach,
  onUpdateModules,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ModuleNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<ModuleNodeData> | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onInit = useCallback((instance: ReactFlowInstance<ModuleNodeData>) => {
    setReactFlowInstance(instance);
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const moduleType = event.dataTransfer.getData('application/reactflow');

      if (typeof moduleType === 'string' && reactFlowBounds && reactFlowInstance) {
        const position = reactFlowInstance.screenToFlowPosition({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

        const baseData: BaseNodeData = {
          id: `${moduleType}-${Date.now()}`,
          title: `New ${moduleType}`,
          icon: '🎭',
          type: moduleType as 'CHARACTER' | 'ATTACHMENT' | 'STYLE',
          position,
          onRemove: onRemoveModule,
          onDetachEdge: onDetach,
          attributes: {
            dynamicAttributes: [],
            parameters: {},
          },
          renderContent: () => (
            <div className="space-y-4">
              <div>Module: {`New ${moduleType}`}</div>
            </div>
          ),
        };

        const nodeData: ModuleNodeData = {
          ...baseData,
          data: baseData,
        };

        const newNode: ModuleNode = {
          id: nodeData.id,
          type: moduleType as 'CHARACTER' | 'ATTACHMENT' | 'STYLE',
          position,
          data: nodeData,
          draggable: true,
          connectable: true,
          selectable: true,
        };

        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    console.log('ModuleFlow useEffect - modules changed:', modules);
    
    // Ensure all dynamic attributes have values
    const updatedModules = modules.map(module => {
      if (module.attributes && module.attributes.dynamicAttributes) {
        const updatedDynamicAttributes = module.attributes.dynamicAttributes.map((attr: DynamicAttribute) => {
          if ((attr.value === undefined || attr.value === null) && attr.options && attr.options.length > 0) {
            return { ...attr, value: attr.options[0].value };
          }
          return attr;
        });
        
        return {
          ...module,
          attributes: {
            ...module.attributes,
            dynamicAttributes: updatedDynamicAttributes
          }
        };
      }
      return module;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedModules) !== JSON.stringify(modules)) {
      console.log('Updating modules with default values:', updatedModules);
      onUpdateModules(updatedModules);
      return; // Skip the rest of this effect
    }
    
    console.log('Creating nodes from modules:', modules);
    const updatedNodes = modules.map(module => {
      const position = module.position || { x: 0, y: 0 };
      
      console.log(`Creating node for module ${module.id} at position:`, position);
      
      const baseData: BaseNodeData = {
        id: module.id,
        title: module.title,
        icon: module.icon,
        type: module.type,
        position,
        onRemove: onRemoveModule,
        onDetachEdge: onDetach,
        attributes: module.attributes,
        renderContent: () => (
          <div className="space-y-4">
            {module.attributes && module.attributes.coreAttributes && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">核心属性</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">性别</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                      value={module.attributes.coreAttributes.gender || ''}
                      onChange={(e) => {
                        const moduleIndex = modules.findIndex(m => m.id === module.id);
                        if (moduleIndex !== -1) {
                          const updatedModules = [...modules];
                          updatedModules[moduleIndex] = {
                            ...updatedModules[moduleIndex],
                            attributes: {
                              ...updatedModules[moduleIndex].attributes,
                              coreAttributes: {
                                ...updatedModules[moduleIndex].attributes.coreAttributes,
                                gender: e.target.value
                              }
                            }
                          };
                          onUpdateModules(updatedModules);
                        }
                      }}
                    >
                      <option value="男">男</option>
                      <option value="女">女</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">年龄段</label>
                    <select
                      className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm"
                      value={module.attributes.coreAttributes.ageStage || ''}
                      onChange={(e) => {
                        const moduleIndex = modules.findIndex(m => m.id === module.id);
                        if (moduleIndex !== -1) {
                          const updatedModules = [...modules];
                          updatedModules[moduleIndex] = {
                            ...updatedModules[moduleIndex],
                            attributes: {
                              ...updatedModules[moduleIndex].attributes,
                              coreAttributes: {
                                ...updatedModules[moduleIndex].attributes.coreAttributes,
                                ageStage: e.target.value
                              }
                            }
                          };
                          onUpdateModules(updatedModules);
                        }
                      }}
                    >
                      <option value="儿童">儿童</option>
                      <option value="青少年">青少年</option>
                      <option value="成年">成年</option>
                      <option value="老年">老年</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            
            {module.attributes && module.attributes.dynamicAttributes && Array.isArray(module.attributes.dynamicAttributes) && module.attributes.dynamicAttributes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">动态属性</h4>
                <div className="space-y-2">
                  {module.attributes.dynamicAttributes.map((attr, attrIndex) => (
                    <DynamicAttributeForm
                      key={attrIndex}
                      attribute={attr}
                      onChange={(updatedAttr: DynamicAttribute) => {
                        console.log('DynamicAttributeForm onChange called with:', updatedAttr);
                        const moduleIndex = modules.findIndex(m => m.id === module.id);
                        if (moduleIndex !== -1) {
                          const updatedModules = [...modules];
                          const updatedAttributes = [...updatedModules[moduleIndex].attributes.dynamicAttributes!];
                          updatedAttributes[attrIndex] = updatedAttr;
                          updatedModules[moduleIndex] = {
                            ...updatedModules[moduleIndex],
                            attributes: {
                              ...updatedModules[moduleIndex].attributes,
                              dynamicAttributes: updatedAttributes
                            }
                          };
                          console.log('Updating modules with:', updatedModules[moduleIndex]);
                          onUpdateModules(updatedModules);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {module.attributes && Object.keys(module.attributes.parameters || {}).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-2">参数</h4>
                <div className="space-y-2">
                  {Object.entries(module.attributes.parameters || {}).map(([key, value], paramIndex) => (
                    <div key={key} className="flex flex-col">
                      <label className="text-xs text-gray-500 mb-1">{key}</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value as number}
                        onChange={(e) => {
                          const moduleIndex = modules.findIndex(m => m.id === module.id);
                          if (moduleIndex !== -1) {
                            onUpdateParameter(moduleIndex, key, parseInt(e.target.value));
                          }
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0</span>
                        <span>{value}</span>
                        <span>100</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ),
      };

      const nodeData: ModuleNodeData = {
        ...baseData,
        data: baseData,
      };

      const newNode: ModuleNode = {
        id: nodeData.id,
        type: module.type as 'CHARACTER' | 'ATTACHMENT' | 'STYLE',
        position,
        data: nodeData,
        draggable: true,
        connectable: true,
        selectable: true,
      };

      return newNode;
    });

    setNodes(updatedNodes);
  }, [modules, onRemoveModule, onUpdateParameter, onDetach, onUpdateModules]);

  // Generate prompt
  const generatePrompt = () => {
    console.log('generatePrompt called with modules:', modules);
    return modules.map(module => {
      const params = [];
      
      // Core attributes
      if (module.attributes && module.attributes.coreAttributes) {
        params.push(`性别:${module.attributes.coreAttributes.gender || ''}, 年龄:${module.attributes.coreAttributes.ageStage || ''}`);
      }
      
      // Dynamic attributes
      if (module.attributes && module.attributes.dynamicAttributes) {
        console.log('Processing dynamic attributes for prompt:', module.attributes.dynamicAttributes);
        module.attributes.dynamicAttributes.forEach((attr: DynamicAttribute) => {
          if (attr.value !== undefined && attr.value !== null && attr.value.toString().trim() !== '') {
            params.push(`${attr.label}:${attr.value}`);
          }
        });
      }
      
      // Base parameters
      if (module.attributes && module.attributes.parameters) {
        Object.entries(module.attributes.parameters).forEach(([key, value]) => {
          params.push(`${key}:${value}`);
        });
      }
      
      return `${module.title}: ${params.filter(Boolean).join(', ')}`;
    }).join('\n');
  };

  const handleRemoveModule = useCallback((id: string) => {
    onRemoveModule(id);
  }, [onRemoveModule]);

  const handleDetachEdge = useCallback((edgeId: string) => {
    onDetach(edgeId);
  }, [onDetach]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div 
          ref={reactFlowWrapper}
          style={{ width: '100%', height: '100%' }}
          onDrop={onDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <ReactFlow<ModuleNodeData>
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={onInit}
            fitView
          >
            <Background color="#4a5568" gap={24} />
            <Controls 
              position="bottom-left"
              className="[&_.react-flow__controls-button]:!bg-gray-700 [&_.react-flow__controls-button]:!border-gray-600 
                         [&_.react-flow__controls-button]:!text-gray-200 [&_.react-flow__controls-button:hover]:!bg-gray-600 
                         [&_.react-flow__controls-button>svg]:!fill-current [&_.react-flow__controls-button>svg]:!stroke-current
                         !bg-gray-800 !border-gray-600 !rounded-lg !shadow-lg !p-1"
              style={{
                gap: '4px'
              }}
            />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default ModuleFlow;
