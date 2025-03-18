'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ModuleFlow from '../components/ModuleFlow';
import { PromptModule } from '../types';

export default function Home() {
  const [modules, setModules] = useState<PromptModule[]>([]);

  // Check if there is at least one CHARACTER node
  const hasCharacterNode = modules.some(module => module.type === 'CHARACTER');

  const handleDrop = (event: React.DragEvent, moduleType: string) => {
    event.preventDefault();
    console.log('Drop event detected in page.tsx');
    
    try {
      const moduleDataStr = event.dataTransfer.getData('application/json');
      console.log('Module data string:', moduleDataStr);
      
      if (!moduleDataStr) {
        console.error('Empty module data string');
        return;
      }
      
      const moduleData = JSON.parse(moduleDataStr) as PromptModule;
      console.log('Parsed module data:', moduleData);

      // Generate a unique ID for the new module
      const newId = `${moduleData.id}-${Date.now()}`;
      
      // Get drop coordinates relative to the canvas
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      // Create a new module with the unique ID and position
      const newModule: PromptModule = {
        ...moduleData,
        id: newId,
        position
      };
      
      // Initialize dynamic attributes with empty values if they don't have values
      if (newModule.attributes && newModule.attributes.dynamicAttributes) {
        newModule.attributes.dynamicAttributes = newModule.attributes.dynamicAttributes.map((attr: any) => {
          // If the attribute has options but no value, set the first option as the default value
          if ((attr.value === undefined || attr.value === null) && attr.options && attr.options.length > 0) {
            console.log(`Setting default value for ${attr.key} to ${attr.options[0].value}`);
            return {
              ...attr,
              value: attr.options[0].value
            };
          }
          return {
            ...attr,
            value: attr.value || ''
          };
        });
      }
      
      console.log('Adding new module:', newModule);
      setModules([...modules, newModule]);
    } catch (error) {
      console.error('Error processing drop event:', error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Drag over event detected');
    e.dataTransfer.dropEffect = 'move';
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

  const handleUpdateModules = (updatedModules: PromptModule[]) => {
    setModules(updatedModules);
  };

  return (
    <main className="flex min-h-screen bg-gray-900 text-gray-100">
      <Sidebar hasCharacterNode={hasCharacterNode} />
      <div
        className="flex-1 p-8"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, 'module')}
      >
        {modules.length > 0 ? (
          <ModuleFlow
            modules={modules}
            onRemoveModule={handleRemoveModule}
            onUpdateParameter={handleUpdateParameter}
            onAttach={handleAttach}
            onDetach={handleDetach}
            onUpdateModules={handleUpdateModules}
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
