import React, { useCallback, useRef, useState, useEffect } from 'react';
import ReactFlow, { 
  Background,
  Controls,
  NodeTypes,
  EdgeTypes,
  Node,
  Edge,
  Connection,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  ReactFlowInstance,
  useReactFlow,
  BaseEdge,
  getSmoothStepPath,
  IsValidConnection,
  XYPosition,
  Position
} from '@xyflow/react';
import { ModuleNodeData, CustomNode, PromptModule } from '../types';
import CharacterNode from './nodes/CharacterNode';
import StyleNode from './nodes/StyleNode';
import AttachmentNode from './nodes/AttachmentNode';
import { defaultModules } from '../data/modules';

interface ModuleFlowProps {
  modules?: PromptModule[];
  onNodesChange?: OnNodesChange;
  onEdgesChange?: OnEdgesChange;
  onConnect?: OnConnect;
  onRemoveModule?: (moduleId: string) => void;
  onUpdateParameter?: (index: number, paramName: string, value: number) => void;
  onAttach?: (sourceId: string, targetId: string) => void;
  onDetach?: (connectionId: string) => void;
  onUpdateModules?: (updatedModules: PromptModule[]) => void;
}

const nodeTypes: NodeTypes = {
  CHARACTER: CharacterNode,
  STYLE: StyleNode,
  ATTACHMENT: AttachmentNode,
};

const ModuleFlow: React.FC<ModuleFlowProps> = ({
  modules,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onRemoveModule,
  onUpdateParameter,
  onAttach,
  onDetach,
  onUpdateModules,
}) => {
  const [nodes, setNodes] = useNodesState<CustomNode>([]);
  const [edges, setEdges] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const moduleData = JSON.parse(event.dataTransfer.getData('application/json')) as ModuleNodeData;

      const position: XYPosition = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: CustomNode = {
        id: `${moduleData.type.toLowerCase()}-${Date.now()}`,
        type: moduleData.type,
        position,
        data: { ...moduleData, [moduleData.id]: moduleData.id },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const updatedNode = { ...node };
      setNodes((nds) =>
        nds.map((n) => (n.id === updatedNode.id ? updatedNode as CustomNode : n))
      );
    },
    []
  );

  useEffect(() => {
    const initialNodes: CustomNode[] = defaultModules.map((module) => ({
      id: module.id,
      type: module.type,
      position: { x: 0, y: 0 },
      data: { ...module, [module.id]: module.id },
    }));
    setNodes(initialNodes);
  }, []);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <button onClick={() => console.log(nodes)}>Log Nodes</button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ModuleFlow;
