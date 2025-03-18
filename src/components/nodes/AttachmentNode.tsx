import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { ModuleNodeData, NodeComponentProps } from '../../types/types';

interface AttachmentNodeData extends ModuleNodeData {
  type: 'ATTACHMENT';
  icon: string;
  title: string;
  renderContent: () => React.ReactNode;
}

const AttachmentNode: React.FC<NodeComponentProps<AttachmentNodeData>> = ({ data, id, isConnectable }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="attachment-node bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-700"
    >
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
    </motion.div>
  );
};

export default memo(AttachmentNode);
