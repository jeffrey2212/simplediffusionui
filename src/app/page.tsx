'use client';

import { DragDropContext, Droppable, DroppableProps, DropResult } from 'react-beautiful-dnd';
import { useState } from 'react';
import ModuleCategory from '../components/ModuleCategory';
import Canvas from '../components/Canvas';
import { subjects, styles, environments } from '../data/modules';
import { PromptModule } from '../types';

const moduleDroppableProps: Partial<DroppableProps> = {
  isDropDisabled: true as const,
  isCombineEnabled: false as const,
  ignoreContainerClipping: false as const,
};

const canvasDroppableProps: Partial<DroppableProps> = {
  isDropDisabled: false as const,
  isCombineEnabled: false as const,
  ignoreContainerClipping: false as const,
};

export default function Home() {
  const [activeModules, setActiveModules] = useState<PromptModule[]>([]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // If dropping from modules to canvas
    if (destination.droppableId === 'canvas') {
      let newModule: PromptModule | undefined;
      const sourceId = source.droppableId;

      // Find the module from the correct category based on the source droppable ID
      switch (sourceId) {
        case 'subjects':
          newModule = subjects[source.index];
          break;
        case 'styles':
          newModule = styles[source.index];
          break;
        case 'environments':
          newModule = environments[source.index];
          break;
      }

      if (newModule) {
        setActiveModules([...activeModules, { ...newModule }]);
      }
    }
  };

  const handleRemoveModule = (index: number) => {
    setActiveModules(modules => modules.filter((_, i) => i !== index));
  };

  const handleUpdateParameter = (index: number, paramName: string, value: number) => {
    setActiveModules(modules => 
      modules.map((module, i) => 
        i === index 
          ? {
              ...module,
              attributes: {
                ...module.attributes,
                parameters: {
                  ...module.attributes.parameters,
                  [paramName]: value
                }
              }
            }
          : module
      )
    );
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">积木式 Prompt 生成系统</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Module Library Sidebar */}
            <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-6 text-purple-400">模块库</h2>
              <div className="space-y-6">
                <Droppable 
                  droppableId="subjects"
                  {...moduleDroppableProps}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <ModuleCategory title="主体模块" type="SUBJECT" items={subjects} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable 
                  droppableId="styles"
                  {...moduleDroppableProps}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <ModuleCategory title="风格模块" type="STYLE" items={styles} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <Droppable 
                  droppableId="environments"
                  {...moduleDroppableProps}
                >
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <ModuleCategory title="环境模块" type="ENVIRONMENT" items={environments} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>

            {/* Canvas Area */}
            <div className="lg:col-span-3">
              <Droppable 
                droppableId="canvas"
                {...canvasDroppableProps}
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg min-h-[600px] border border-gray-700"
                  >
                    <h2 className="text-xl font-bold mb-6 text-purple-400">创作画布</h2>
                    <Canvas 
                      modules={activeModules}
                      onRemoveModule={handleRemoveModule}
                      onUpdateParameter={handleUpdateParameter}
                    />
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}
