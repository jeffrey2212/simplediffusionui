'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ModuleFlow from '../components/ModuleFlow';
import { PromptModule } from '../types';

export default function Home() {
  const [modules, setModules] = useState<PromptModule[]>([]);

  // Check if there is at least one CHARACTER node
  const hasCharacterNode = modules.some(module => module.type === 'CHARACTER');

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData('application/json'));
    
    if (data.type === 'CHARACTER' || data.type === 'ATTACHMENT') {
      setModules(prev => [...prev, { ...data.module, attachTo: undefined }] as PromptModule[]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId));
  };

  const handleUpdateParameter = (index: number, paramName: string, value: number) => {
    setModules(prev =>
      prev.map((module, i) =>
        i === index
          ? {
              ...module,
              attributes: {
                ...module.attributes,
                parameters: {
                  ...module.attributes.parameters,
                  [paramName]: value,
                },
              },
            }
          : module
      )
    );
  };

  const handleAttach = (sourceId: string, targetId: string) => {
    setModules(prev =>
      prev.map(module =>
        module.id === sourceId
          ? { ...module, attachTo: targetId }
          : module
      )
    );
  };

  const handleDetach = (connectionId: string) => {
    const [sourceId] = connectionId.slice(1).split('-');
    setModules(prev =>
      prev.map(module =>
        module.id === sourceId
          ? { ...module, attachTo: undefined }
          : module
      )
    );
  };

  return (
    <main className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar hasCharacterNode={hasCharacterNode} />
      <div
        className="flex-1 p-8"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {modules.length > 0 ? (
          <ModuleFlow
            modules={modules}
            onRemoveModule={handleRemoveModule}
            onUpdateParameter={handleUpdateParameter}
            onAttach={handleAttach}
            onDetach={handleDetach}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
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
          </div>
        )}
      </div>
    </main>
  );
}
