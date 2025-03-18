import { motion, AnimatePresence } from 'framer-motion';
import { PromptModule } from '../types';
import { useState } from 'react';

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

  const parameterGroups: ParameterGroup[] = [
    {
      title: '基础属性',
      icon: '👤',
      parameters: ['gender', 'age', 'height', 'build']
    },
    {
      title: '面部特征',
      icon: '👀',
      parameters: ['face_shape', 'skin_tone', 'eye_size', 'eye_color', 'nose_size', 'lip_size']
    },
    {
      title: '发型',
      icon: '💇‍♂️',
      parameters: ['hair_length', 'hair_color', 'hair_style']
    },
    {
      title: '表情和姿势',
      icon: '🎭',
      parameters: ['expression', 'pose']
    },
    {
      title: '服装',
      icon: '👔',
      parameters: ['clothing_style', 'clothing_color']
    },
    {
      title: '渲染风格',
      icon: '🎨',
      parameters: ['detail_level', 'realism', 'lighting']
    }
  ];

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

  const toggleGroupExpansion = (groupTitle: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupTitle)
        ? prev.filter(title => title !== groupTitle)
        : [...prev, groupTitle]
    );
  };

  const getParamDescription = (paramName: string): string => {
    const descriptions: { [key: string]: string } = {
      gender: '性别 - 调整人物的性别特征',
      age: '年龄 - 调整人物的年龄',
      height: '身高 - 调整人物的身高比例',
      build: '体型 - 调整人物的体型特征',
      face_shape: '脸型 - 调整面部轮廓',
      skin_tone: '肤色 - 调整皮肤的色调',
      eye_size: '眼睛大小 - 调整眼睛的大小',
      eye_color: '眼睛颜色 - 调整眼睛的颜色',
      nose_size: '鼻子大小 - 调整鼻子的大小',
      lip_size: '嘴唇大小 - 调整嘴唇的大小',
      hair_length: '发长 - 调整头发的长度',
      hair_color: '发色 - 调整头发的颜色',
      hair_style: '发型 - 调整头发的造型',
      expression: '表情 - 调整面部表情',
      pose: '姿势 - 调整人物的姿态',
      clothing_style: '服装风格 - 调整服装的风格',
      clothing_color: '服装颜色 - 调整服装的颜色',
      detail_level: '细节程度 - 控制图像中的细节丰富程度',
      realism: '真实感 - 调整图像的真实感程度',
      lighting: '光照 - 调整场景的整体光照效果'
    };
    return descriptions[paramName] || paramName;
  };

  const getParamValue = (value: number, paramName: string): string => {
    if (paramName === 'gender') {
      return value <= 30 ? '女性' : value >= 70 ? '男性' : '中性';
    }
    if (paramName === 'age') {
      return `${Math.round(value)}岁`;
    }
    return `${value}`;
  };

  const generatePrompt = () => {
    return modules.map(module => {
      const params = Object.entries(module.attributes.parameters)
        .map(([key, value]) => `${key}:${getParamValue(value, key)}`)
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
            {modules.map((module, moduleIndex) => (
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
                        onRemoveModule(moduleIndex);
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
                      <div className="space-y-4 mt-4">
                        {parameterGroups.map((group) => (
                          <div key={group.title} className="border border-gray-600 rounded-lg overflow-hidden">
                            <div
                              className="flex items-center gap-2 p-3 bg-gray-800 cursor-pointer hover:bg-gray-750 transition-colors"
                              onClick={() => toggleGroupExpansion(group.title)}
                            >
                              <span className="text-xl">{group.icon}</span>
                              <h4 className="text-sm font-medium text-gray-300">{group.title}</h4>
                              <svg
                                className={`w-4 h-4 text-gray-400 transition-transform ml-auto ${
                                  expandedGroups.includes(group.title) ? 'rotate-180' : ''
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
                              {expandedGroups.includes(group.title) && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="p-3 space-y-4 bg-gray-700">
                                    {group.parameters.map((paramName) => (
                                      <div
                                        key={paramName}
                                        className="space-y-2"
                                        onMouseEnter={() => setHoveredParam(paramName)}
                                        onMouseLeave={() => setHoveredParam(null)}
                                      >
                                        <div className="flex justify-between items-center relative">
                                          <label className="text-sm text-gray-300">
                                            {paramName}
                                            <span className="ml-2 text-gray-400">
                                              {getParamValue(module.attributes.parameters[paramName], paramName)}
                                            </span>
                                          </label>
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
                                              value={
                                                focusedInput === `${module.id}-${paramName}`
                                                  ? undefined
                                                  : module.attributes.parameters[paramName]
                                              }
                                              onChange={(e) =>
                                                handleInputChange(moduleIndex, paramName, e.target.value, 0, 100)
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
                                            value={module.attributes.parameters[paramName]}
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
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
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
