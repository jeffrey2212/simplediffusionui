import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DynamicAttribute, AttributeOption, ParamConfig } from '../types';

interface DynamicAttributeFormProps {
  attribute: DynamicAttribute;
  onValueChange: (key: string, value: any) => void;
}

export default function DynamicAttributeForm({ attribute, onValueChange }: DynamicAttributeFormProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [subValues, setSubValues] = useState<Record<string, any>>({});

  const handleOptionSelect = (option: AttributeOption) => {
    setSelectedOption(option.value);
    onValueChange(attribute.key, option.value);
  };

  const handleSubParamChange = (paramKey: string, value: any) => {
    const newSubValues = { ...subValues, [paramKey]: value };
    setSubValues(newSubValues);
    onValueChange(`${attribute.key}_${paramKey}`, value);
  };

  const renderControl = (control: ParamConfig) => {
    switch (control.type) {
      case 'COLOR_PICKER':
        return (
          <div className="flex flex-wrap gap-2">
            {control.options?.map((color) => (
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
            {control.options?.map((opt) => (
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
      <div className="grid grid-cols-2 gap-4">
        {Array.isArray(attribute.options) &&
          attribute.options.map((option: AttributeOption) => (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option)}
              className={`p-4 border rounded-lg transition-all ${
                selectedOption === option.value
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-600 hover:border-gray-500'
              }`}
            >
              <div className="aspect-square bg-gray-700 rounded-lg mb-2">
                {/* 预览图片占位符 */}
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  预览图片
                </div>
              </div>
              <div className="text-sm font-medium text-gray-300">{option.value}</div>
            </button>
          ))}
      </div>

      <AnimatePresence>
        {selectedOption && Array.isArray(attribute.options) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-600 mt-4 space-y-4">
              {attribute.options
                .find((opt) => opt.value === selectedOption)
                ?.subParams?.controls.map((control, index) => (
                  <div key={index} className="space-y-2">
                    <label className="text-sm text-gray-300">{control.label}</label>
                    {renderControl(control)}
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
