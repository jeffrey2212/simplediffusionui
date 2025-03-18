export interface PromptModule {
  id: string;
  title: string;
  icon: string;
  type: 'SUBJECT' | 'STYLE' | 'ENVIRONMENT';
  attributes: {
    parameters: {
      [key: string]: number;
    };
  };
}

export interface ModuleCategoryProps {
  title: string;
  type: PromptModule['type'];
  items: PromptModule[];
}
