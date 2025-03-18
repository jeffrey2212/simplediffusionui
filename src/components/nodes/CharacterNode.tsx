import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ModuleNodeData, DynamicAttribute } from '../../types';
import DynamicAttributeForm from '../DynamicAttributeForm';

interface CharacterNodeProps {
  data: ModuleNodeData;
}

const CharacterNode: React.FC<CharacterNodeProps> = ({ data }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{data.icon}</span>
        <h3 className="text-lg font-semibold text-white">{data.title}</h3>
      </div>

      <div className="space-y-4">
        {data.attributes.coreAttributes && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">核心属性</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">性别</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  value={data.attributes.coreAttributes.gender || ''}
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">年龄段</label>
                <select
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                  value={data.attributes.coreAttributes.ageStage || ''}
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

        {data.attributes.dynamicAttributes.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-400 mb-2">动态属性</h4>
            <div className="space-y-2">
              {data.attributes.dynamicAttributes.map((attr, index) => (
                <DynamicAttributeForm
                  key={index}
                  attribute={attr}
                  onChange={(updatedAttr: DynamicAttribute) => {
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

export default CharacterNode;
