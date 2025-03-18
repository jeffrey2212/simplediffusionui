import React, { useState } from 'react';
import { DynamicAttribute, AttributeOption } from '../types';

interface DynamicAttributeFormProps {
  attribute: DynamicAttribute;
  onChange: (updatedAttr: DynamicAttribute) => void;
}

const DynamicAttributeForm: React.FC<DynamicAttributeFormProps> = ({
  attribute,
  onChange,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(attribute.value);

  const handleChange = (value: string) => {
    setSelectedValue(value);
    onChange({
      ...attribute,
      value,
    });
  };

  const renderSubParams = (option: AttributeOption) => {
    if (!option.subParams?.length) return null;
    
    return (
      <div className="mt-2 space-y-2">
        {option.subParams.map((param) => (
          <div key={param.key} className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1">{param.label}</label>
            {param.type === 'select' && param.options ? (
              <select
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                value={param.value}
                onChange={(e) => handleChange(e.target.value)}
              >
                {param.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
                value={param.value}
                onChange={(e) => handleChange(e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">{attribute.label}</label>
      {attribute.type === 'select' && attribute.options ? (
        <div>
          <select
            className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
            value={selectedValue}
            onChange={(e) => handleChange(e.target.value)}
          >
            {attribute.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {attribute.options.map((option) => (
            option.value === selectedValue && renderSubParams(option)
          ))}
        </div>
      ) : (
        <input
          type="text"
          className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white"
          value={selectedValue}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
    </div>
  );
};

export default DynamicAttributeForm;
