import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ModuleNodeData, NodeComponentProps } from '../../types/types';

const CharacterNode: React.FC<NodeComponentProps<ModuleNodeData>> = ({ data, isConnectable }) => {
  return (
    <div className="character-node bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700">
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">{data.icon}</span>
        <h3 className="text-lg font-semibold text-gray-200">{data.title}</h3>
      </div>
      {data.renderContent()}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
};

CharacterNode.displayName = 'CharacterNode';

export default memo(CharacterNode);
