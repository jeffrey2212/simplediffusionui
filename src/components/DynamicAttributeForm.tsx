import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicAttribute, AttributeOption, ParamConfig } from '../types';

export interface DynamicAttributeFormProps {
  attribute: DynamicAttribute;
  onChange: (updatedAttr: DynamicAttribute) => void;
}

export default function DynamicAttributeForm({ attribute, onChange }: DynamicAttributeFormProps) {
  // Debug logs
  console.log('DynamicAttributeForm rendered with:', { attribute });
  
  // Initialize state with current value or null
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    if (attribute.value !== undefined && attribute.value !== null) {
      return attribute.value.toString();
    }
    return null;
  });
  const [subValues, setSubValues] = useState<Record<string, any>>(attribute.subParams || {});

  // Debug logs
  console.log('Selected option state:', selectedOption);

  // Use effect to set the first option if no value is selected
  useEffect(() => {
    console.log('useEffect triggered, selectedOption:', selectedOption);
    if (!selectedOption && attribute.options && attribute.options.length > 0) {
      console.log('Setting first option:', attribute.options[0].value);
      const firstOption = attribute.options[0];
      setSelectedOption(firstOption.value);
      onChange({ ...attribute, value: firstOption.value });
    }
  }, [attribute, onChange, selectedOption]);

  const handleOptionSelect = (option: AttributeOption) => {
    console.log('handleOptionSelect called with option:', option);
    setSelectedOption(option.value);
    const updatedAttr = { ...attribute, value: option.value };
    console.log('Calling onChange with:', updatedAttr);
    onChange(updatedAttr);
  };

  const handleSubParamChange = (paramKey: string, value: any) => {
    const newSubValues = { ...subValues, [paramKey]: value };
    setSubValues(newSubValues);
    const updatedAttr = { 
      ...attribute, 
      subParams: { ...(attribute.subParams || {}), [paramKey]: value } 
    };
    onChange(updatedAttr);
  };

  const renderControl = (control: ParamConfig) => {
    switch (control.type) {
      case 'COLOR_PICKER':
        return (
          <div className="flex flex-wrap gap-2">
            {control.options?.map((color: string) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 ${
                  subValues[control.label] === color
                    ? 'border-purple-500'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => handleSubParamChange(control.label, color)}
              />
            ))}
          </div>
        );

      case 'SLIDER':
        return (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>{control.range?.min}</span>
              <span>{subValues[control.label] || control.range?.min}</span>
              <span>{control.range?.max}</span>
            </div>
            <input
              type="range"
              min={control.range?.min}
              max={control.range?.max}
              step={control.range?.step}
              value={subValues[control.label] || control.range?.min}
              onChange={(e) =>
                handleSubParamChange(control.label, parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        );

      case 'SELECT':
        return (
          <select
            value={subValues[control.label] || ''}
            onChange={(e) => handleSubParamChange(control.label, e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="">选择{control.label}</option>
            {control.options?.map((opt: string) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {attribute.label}
          {selectedOption && (
            <span className="ml-2 text-xs text-purple-400">
              ({selectedOption})
            </span>
          )}
        </label>
        {attribute.options ? (
          <div className="grid grid-cols-2 gap-2">
            {attribute.options.map((option, index) => (
              <button
                key={index}
                className={`p-3 rounded-lg border ${selectedOption === option.value ? 'bg-purple-600 border-purple-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600'}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="text-sm font-medium text-center">{option.value}</div>
                {option.preview && (
                  <div className="mt-2 text-xs text-center text-gray-400">{option.preview}</div>
                )}
                {selectedOption === option.value && (
                  <div className="mt-2 text-xs text-center text-purple-300">✓ Selected</div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400">No options available</div>
        )}
      </div>

      <AnimatePresence>
        {selectedOption && attribute.options?.find(opt => opt.value === selectedOption)?.subParams && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-gray-700 rounded-lg">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Additional Settings</h4>
              <div className="space-y-4">
                {attribute.options
                  .find(opt => opt.value === selectedOption)
                  ?.subParams?.controls.map((control: ParamConfig, index: number) => (
                    <div key={index} className="space-y-1">
                      <label className="block text-sm font-medium text-gray-400">{control.label}</label>
                      {renderControl(control)}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
