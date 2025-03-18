import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleCategoryProps, PromptModule } from '../types';

interface ModuleDragData {
  type: string;
  module: PromptModule;
}

export default function ModuleCategory({ title, type, items, disabled = false }: ModuleCategoryProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, module: PromptModule) => {
    if (disabled) return;
    
    console.log('Drag start event detected for module:', module.id);
    setIsDragging(true);
    e.dataTransfer.setData('application/json', JSON.stringify(module));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div 
            key={item.id}
            draggable={!disabled}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isDragging ? 0.95 : 1,
                opacity: isDragging ? 0.75 : disabled ? 0.5 : 1,
              }}
              className={`bg-gray-700 rounded-lg p-4 ${disabled ? 'cursor-not-allowed' : 'cursor-move'} border ${disabled ? 'border-gray-600' : item.type === 'ATTACHMENT' ? 'border-purple-500/40' : 'border-gray-600 hover:border-purple-500/30'} transition-colors group relative`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${disabled ? '' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-200">{item.title}</h3>
                </div>
              </div>
              
              {/* Tooltip for attachment nodes */}
              {item.type === 'ATTACHMENT' && hoveredItem === item.id && (
                <div className="absolute -bottom-10 left-0 right-0 mx-auto w-max bg-gray-800 text-xs text-purple-300 px-3 py-1.5 rounded-md shadow-lg z-10">
                  {disabled 
                    ? '需要先添加人物模块' 
                    : '拖拽至人物模块连接'}
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
