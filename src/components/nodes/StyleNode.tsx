// src/components/nodes/StyleNode.tsx
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ModuleNodeData } from '../../types';
import DynamicAttributeForm from '../DynamicAttributeForm';

interface StyleNodeProps {
  data: ModuleNodeData;
}

const StyleNode: React.FC<StyleNodeProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{data.icon}</span>
        <h3 className="text-lg font-semibold text-white">{data.title}</h3>
      </div>

      <div className="space-y-4">
        {data.attributes.dynamicAttributes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">动态属性</h4>
            <div className="space-y-2">
              {data.attributes.dynamicAttributes.map((attr, index) => (
                <DynamicAttributeForm
                  key={index}
                  attribute={attr}
                  onChange={(updatedAttr) => {
                    console.log('Attribute changed:', updatedAttr);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {Object.entries(data.attributes.parameters).length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">参数</h4>
            <div className="space-y-2">
              {Object.entries(data.attributes.parameters).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">{key}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
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

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default StyleNode;