import { Draggable } from 'react-beautiful-dnd';
import { useState } from 'react';
import { ModuleCategoryProps } from '../types';

export default function ModuleCategory({ title, type, items }: ModuleCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center w-full text-left mb-3 group hover:text-purple-400 transition-colors"
      >
        <svg
          className={`w-5 h-5 mr-2 transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
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
        <h3 className="text-lg font-semibold text-gray-300 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
      </button>

      {isExpanded && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Draggable key={item.id} draggableId={item.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`p-3 bg-gray-700 rounded-lg shadow-md border-2 transform transition-all duration-200 ${
                    snapshot.isDragging
                      ? 'border-purple-500 scale-105 rotate-1 shadow-xl'
                      : 'border-transparent hover:border-purple-400/50'
                  } cursor-grab active:cursor-grabbing hover:bg-gray-600`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-gray-200">{item.title}</span>
                  </div>
                  {item.attributes?.parameters && (
                    <div className="mt-2 text-sm text-gray-400">
                      {Object.keys(item.attributes.parameters).length} parameters
                    </div>
                  )}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </div>
  );
}
