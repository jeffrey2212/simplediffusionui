import { useState } from 'react';
import { motion } from 'framer-motion';
import { ModuleCategoryProps, PromptModule } from '../types';

interface ModuleDragData {
  type: string;
  module: PromptModule;
}

export default function ModuleCategory({ title, type, items, disabled = false }: ModuleCategoryProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, module: PromptModule) => {
    if (disabled) return;
    
    setIsDragging(true);
    const dragData: ModuleDragData = { type, module };
    e.dataTransfer.setData('application/json', JSON.stringify(dragData));
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
          >
            <motion.div
              initial={false}
              animate={{
                scale: isDragging ? 0.95 : 1,
                opacity: isDragging ? 0.75 : disabled ? 0.5 : 1,
              }}
              className={`bg-gray-700 rounded-lg p-4 ${disabled ? 'cursor-not-allowed' : 'cursor-move'} border border-gray-600 ${disabled ? '' : 'hover:border-purple-500/30'} transition-colors group`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${disabled ? '' : 'group-hover:scale-110 transition-transform'}`}>
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-medium text-gray-200">{item.title}</h3>
                  {item.type === 'ATTACHMENT' && (
                    <span className="text-xs text-purple-400">
                      {disabled 
                        ? '需要先添加人物模块' 
                        : '拖拽至人物模块连接'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
