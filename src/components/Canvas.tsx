import { motion, AnimatePresence } from 'framer-motion';
import { PromptModule } from '../types';
import { useState } from 'react';
import DynamicAttributeForm from './DynamicAttributeForm';

interface CanvasProps {
  modules: PromptModule[];
  onRemoveModule: (index: number) => void;
  onUpdateParameter: (index: number, paramName: string, value: number) => void;
}

interface ParameterGroup {
  title: string;
  icon: string;
  parameters: string[];
}

export default function Canvas({ modules, onRemoveModule, onUpdateParameter }: CanvasProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [hoveredParam, setHoveredParam] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [activeModules, setActiveModules] = useState<PromptModule[]>([]);

  const hasCharacterNode = activeModules.some(module => module.type === 'CHARACTER');

  const handleInputChange = (
    index: number,
    paramName: string,
    value: string,
    min: number,
    max: number
  ) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      const clampedValue = Math.min(Math.max(numValue, min), max);
      onUpdateParameter(index, paramName, clampedValue);
    }
  };

  const handleAttributeChange = (moduleIndex: number, key: string, value: any) => {
    setSelectedAttributes(prev => ({ ...prev, [key]: value }));
    // Here you would also update the module's state in the parent component
    console.log(`Module ${moduleIndex} attribute ${key} changed to:`, value);
  };

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupKey)
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  const renderCoreAttributes = (module: PromptModule, moduleIndex: number) => {
    if (!module.attributes.coreAttributes) return null;

    return (
      <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300">核心属性</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">性别</label>
            <select
              value={module.attributes.coreAttributes.gender}
              onChange={(e) => handleAttributeChange(moduleIndex, 'gender', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
              <option value="neutral">中性</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">年龄阶段</label>
            <select
              value={module.attributes.coreAttributes.ageStage}
              onChange={(e) => handleAttributeChange(moduleIndex, 'ageStage', e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
            >
              <option value="child">儿童</option>
              <option value="youth">青年</option>
              <option value="middle">中年</option>
              <option value="elder">老年</option>
            </select>
          </div>
        </div>
      </div>
    );
  };

  const renderDynamicAttributes = (module: PromptModule, moduleIndex: number) => {
    if (!module.attributes.dynamicAttributes) return null;

    return (
      <div className="space-y-4">
        {module.attributes.dynamicAttributes.map((attr) => (
          <div key={attr.key} className="border border-gray-600 rounded-lg overflow-hidden">
            <div
              className="flex items-center gap-2 p-3 bg-gray-800 cursor-pointer hover:bg-gray-750 transition-colors"
              onClick={() => toggleGroupExpansion(attr.key)}
            >
              <h4 className="text-sm font-medium text-gray-300">{attr.label}</h4>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ml-auto ${
                  expandedGroups.includes(attr.key) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <AnimatePresence>
              {expandedGroups.includes(attr.key) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 bg-gray-700">
                    <DynamicAttributeForm
                      attribute={attr}
                      onValueChange={(key, value) => handleAttributeChange(moduleIndex, key, value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    );
  };

  const renderBaseParameters = (module: PromptModule, moduleIndex: number) => {
    return (
      <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300">基础参数</h4>
        <div className="space-y-4">
          {Object.entries(module.attributes.parameters).map(([paramName, value]) => (
            <div
              key={paramName}
              className="space-y-2"
              onMouseEnter={() => setHoveredParam(paramName)}
              onMouseLeave={() => setHoveredParam(null)}
            >
              <div className="flex justify-between items-center relative">
                <label className="text-sm text-gray-300">{paramName}</label>
                <div className="relative">
                  <input
                    type="number"
                    value={
                      focusedInput === `${module.id}-${paramName}`
                        ? undefined
                        : value
                    }
                    onChange={(e) =>
                      handleInputChange(moduleIndex, paramName, e.target.value, 0, 100)
                    }
                    onFocus={() => setFocusedInput(`${module.id}-${paramName}`)}
                    onBlur={() => setFocusedInput(null)}
                    className="w-16 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="relative group">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">0</div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={value}
                  onChange={(e) =>
                    onUpdateParameter(moduleIndex, paramName, parseInt(e.target.value, 10))
                  }
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">100</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleAddModule = (module: PromptModule) => {
    if (module.type === 'CHARACTER' || hasCharacterNode) {
      setActiveModules(prev => [...prev, module]);
    }
  };

  const handleRemoveModule = (moduleId: string) => {
    setActiveModules(prev => prev.filter(m => m.id !== moduleId));
    onRemoveModule(activeModules.findIndex(m => m.id === moduleId));
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {modules.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[400px] text-gray-400"
          >
            <svg
              className="w-16 h-16 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <p className="text-lg">拖拽模块到此处开始创作</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gray-700 rounded-lg p-4 shadow-lg border border-gray-600 hover:border-purple-500/30 transition-colors"
              >
                <div 
                  className="flex justify-between items-start cursor-pointer mb-4"
                  onClick={() => toggleModuleExpansion(module.id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{module.icon}</span>
                    <h3 className="text-lg font-medium text-gray-200">{module.title}</h3>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedModules.includes(module.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveModule(module.id);
                    }}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <AnimatePresence>
                  {expandedModules.includes(module.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4">
                        {renderCoreAttributes(module, moduleIndex)}
                        {renderDynamicAttributes(module, moduleIndex)}
                        {renderBaseParameters(module, moduleIndex)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mt-6"
            >
              <h3 className="text-lg font-semibold text-purple-400 mb-2">生成的 Prompt</h3>
              <div className="bg-gray-900 p-3 rounded-lg">
                <p className="text-gray-300 font-mono text-sm break-all">
                  {activeModules.map(module => {
                    const params = [
                      // Core attributes
                      module.attributes.coreAttributes && `性别:${module.attributes.coreAttributes.gender}, 年龄:${module.attributes.coreAttributes.ageStage}`,
                      // Dynamic attributes
                      ...Object.entries(selectedAttributes).map(([key, value]) => `${key}:${value}`),
                      // Base parameters
                      ...Object.entries(module.attributes.parameters).map(([key, value]) => `${key}:${value}`)
                    ].filter(Boolean).join(', ');
                    
                    return `${module.title} (${params})`;
                  }).join(' + ')}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
