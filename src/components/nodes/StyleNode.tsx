// src/components/nodes/StyleNode.tsx
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { ModuleNodeData, NodeComponentProps } from '../../types/types';

interface StyleNodeData extends ModuleNodeData {
  type: 'STYLE';
  icon: string;
  title: string;
  renderContent: () => React.ReactNode;
}

const StyleNode: React.FC<NodeComponentProps<StyleNodeData>> = ({ data, id, isConnectable }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-lg shadow-lg p-4 min-w-[200px]"
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-teal-500"
      />

      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">{data.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{data.title}</h3>
      </div>

      <div className="space-y-4">
        {data.renderContent()}
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Parameters</h4>
          {Object.entries(data.attributes.parameters).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600">{key}:</span>
              <span className="text-gray-800">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-4 h-4 !bg-teal-500"
      />
    </motion.div>
  );
};

StyleNode.displayName = 'StyleNode';

export default memo(StyleNode);