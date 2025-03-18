import { motion, AnimatePresence } from 'framer-motion';
import { PromptModule } from '../types';
import { useState } from 'react';

interface CanvasProps {
  modules: PromptModule[];
  onRemoveModule: (index: number) => void;
  onUpdateParameter: (index: number, paramName: string, value: number) => void;
}

export default function Canvas({ modules, onRemoveModule, onUpdateParameter }: CanvasProps) {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [hoveredParam, setHoveredParam] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

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

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getParamDescription = (paramName: string): string => {
    const descriptions: { [key: string]: string } = {
      detail: '细节程度 - 控制图像中的细节丰富程度',
      realism: '真实感 - 调整图像的真实感程度',
      lighting: '光照 - 调整场景的整体光照效果',
      scale: '比例 - 控制主体在画面中的大小',
      atmosphere: '氛围 - 调整整体环境氛围',
      depth: '深度 - 控制画面的空间深度感',
      action: '动作 - 调整动物的动作幅度',
      expression: '表情 - 控制动物的表情生动程度',
      intensity: '强度 - 调整风格效果的强度',
      blending: '混合 - 控制颜色的混合程度',
      texture: '纹理 - 调整画面的纹理细节',
      neon: '霓虹 - 控制赛博朋克风格的霓虹效果',
      tech: '科技感 - 调整未来科技的表现程度',
      grit: '质感 - 控制画面的粗糙质感',
      stylization: '风格化 - 调整动漫风格的程度',
      shading: '明暗 - 控制动漫风格的明暗对比',
      lineArt: '线条 - 调整线条的粗细和风格',
      density: '密度 - 控制城市建筑的密集程度',
      timeOfDay: '时间 - 调整场景的时间氛围',
      weather: '天气 - 控制天气效果的强度',
      vegetation: '植被 - 调整自然场景中的植被密度',
      terrain: '地形 - 控制地形的起伏变化',
      furnishing: '装饰 - 调整室内场景的装饰程度',
      mood: '情绪 - 控制场景的整体情绪氛围'
    };
    return descriptions[paramName] || paramName;
  };

  const generatePrompt = () => {
    return modules.map(module => {
      const params = Object.entries(module.attributes.parameters)
        .map(([key, value]) => `${key}:${value}`)
        .join(', ');
      return `${module.title} (${params})`;
    }).join(' + ');
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
            <div className="space-y-4">
              {modules.map((module, index) => (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gray-700 rounded-lg p-4 shadow-lg border border-gray-600 hover:border-purple-500/30 transition-colors"
                >
                  <div 
                    className="flex justify-between items-start cursor-pointer"
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
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {Object.keys(module.attributes.parameters).length} 参数
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveModule(index);
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
                  </div>

                  <AnimatePresence>
                    {expandedModules.includes(module.id) && module.attributes?.parameters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-4 mt-4 pt-4 border-t border-gray-600">
                          {Object.entries(module.attributes.parameters).map(([paramName, value]) => (
                            <div 
                              key={paramName} 
                              className="space-y-2"
                              onMouseEnter={() => setHoveredParam(paramName)}
                              onMouseLeave={() => setHoveredParam(null)}
                            >
                              <div className="flex justify-between items-center relative">
                                <label className="text-sm text-gray-300">{paramName}</label>
                                {hoveredParam === paramName && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    className="absolute left-0 -top-8 bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap"
                                  >
                                    {getParamDescription(paramName)}
                                  </motion.div>
                                )}
                                <div className="relative">
                                  <input
                                    type="number"
                                    value={focusedInput === `${module.id}-${paramName}` ? undefined : value}
                                    onChange={(e) =>
                                      handleInputChange(index, paramName, e.target.value, 0, 100)
                                    }
                                    onFocus={() => setFocusedInput(`${module.id}-${paramName}`)}
                                    onBlur={() => setFocusedInput(null)}
                                    className="w-16 px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded focus:border-purple-500 focus:outline-none"
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
                                    onUpdateParameter(index, paramName, parseInt(e.target.value, 10))
                                  }
                                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                />
                                <div className="absolute -right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">100</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700 mt-6"
            >
              <h3 className="text-lg font-semibold text-purple-400 mb-2">生成的 Prompt</h3>
              <div className="bg-gray-900 p-3 rounded-lg">
                <p className="text-gray-300 font-mono text-sm break-all">
                  {generatePrompt()}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
