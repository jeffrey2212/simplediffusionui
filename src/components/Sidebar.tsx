import { subjects, attachments, styles, environments } from '../data/modules';
import ModuleCategory from './ModuleCategory';

interface SidebarProps {
  hasCharacterNode: boolean;
}

export default function Sidebar({ hasCharacterNode }: SidebarProps) {
  return (
    <div className="w-80 bg-gray-800 p-6 overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-100 mb-8">提示词模块</h1>
      <div className="space-y-8">
        <ModuleCategory title="主体" type="CHARACTER" items={subjects} />
        <ModuleCategory 
          title="附加项" 
          type="ATTACHMENT" 
          items={attachments} 
          disabled={!hasCharacterNode} 
        />
        <ModuleCategory title="风格" type="STYLE" items={styles} />
        <ModuleCategory title="环境" type="ENVIRONMENT" items={environments} />
      </div>
    </div>
  );
}
