import { PromptModule, DynamicAttribute } from '../types';

const characterDynamicAttributes: DynamicAttribute[] = [
  {
    category: 'APPEARANCE',
    key: 'facial_features',
    label: '面部特征',
    controlType: 'SELECT',
    options: [
      {
        value: 'eyes',
        preview: '/assets/face/eyes.png',
        subParams: {
          key: 'eye_details',
          controls: [
            {
              type: 'COLOR_PICKER',
              label: '瞳色',
              options: ['#634E34', '#3B6C24', '#2B4C7E', '#461B1B']
            },
            {
              type: 'SLIDER',
              label: '大小',
              range: { min: 0, max: 100, step: 1 }
            }
          ]
        }
      }
    ]
  }
];

export const subjects: PromptModule[] = [
  {
    id: 'subject-person',
    title: '人物',
    icon: '👤',
    type: 'CHARACTER',
    attributes: {
      parameters: {
        // Base rendering parameters
        detail_level: 75,
        realism: 60,
        lighting: 50
      },
      coreAttributes: {
        gender: 'neutral',
        ageStage: 'youth'
      },
      dynamicAttributes: characterDynamicAttributes
    }
  }
];

export const attachments: PromptModule[] = [
  {
    id: 'attachment-hairstyle',
    title: '发型',
    icon: '💇‍♂️',
    type: 'ATTACHMENT',
    attributes: {
      parameters: {},
      dynamicAttributes: [
        {
          category: 'APPEARANCE',
          key: 'hairstyle',
          label: '发型',
          controlType: 'SELECT',
          options: [
            {
              value: 'short',
              preview: '/assets/hair/short.png',
              subParams: {
                key: 'hair_details',
                controls: [
                  {
                    type: 'COLOR_PICKER',
                    label: '发色',
                    options: ['#000000', '#704214', '#B87A24', '#F4C28F']
                  },
                  {
                    type: 'SLIDER',
                    label: '长度',
                    range: { min: 0, max: 100, step: 1 }
                  },
                  {
                    type: 'SLIDER',
                    label: '光泽度',
                    range: { min: 0, max: 100, step: 1 }
                  }
                ]
              }
            },
            {
              value: 'long',
              preview: '/assets/hair/long.png',
              subParams: {
                key: 'hair_details',
                controls: [
                  {
                    type: 'COLOR_PICKER',
                    label: '发色',
                    options: ['#000000', '#704214', '#B87A24', '#F4C28F']
                  },
                  {
                    type: 'SLIDER',
                    label: '长度',
                    range: { min: 0, max: 100, step: 1 }
                  },
                  {
                    type: 'SLIDER',
                    label: '卷曲度',
                    range: { min: 0, max: 100, step: 1 }
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'attachment-clothing',
    title: '服装',
    icon: '👔',
    type: 'ATTACHMENT',
    attributes: {
      parameters: {},
      dynamicAttributes: [
        {
          category: 'APPEARANCE',
          key: 'clothing',
          label: '服装',
          controlType: 'SELECT',
          options: [
            {
              value: 'casual',
              preview: '/assets/clothing/casual.png',
              subParams: {
                key: 'clothing_details',
                controls: [
                  {
                    type: 'COLOR_PICKER',
                    label: '主色调',
                    options: ['#FFFFFF', '#000000', '#2B4C7E', '#567B46']
                  },
                  {
                    type: 'SLIDER',
                    label: '破损度',
                    range: { min: 0, max: 100, step: 1 }
                  }
                ]
              }
            },
            {
              value: 'formal',
              preview: '/assets/clothing/formal.png',
              subParams: {
                key: 'clothing_details',
                controls: [
                  {
                    type: 'COLOR_PICKER',
                    label: '主色调',
                    options: ['#000000', '#1B365C', '#461B1B', '#461B46']
                  },
                  {
                    type: 'SLIDER',
                    label: '光泽度',
                    range: { min: 0, max: 100, step: 1 }
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  },
  {
    id: 'attachment-profession',
    title: '职业',
    icon: '💼',
    type: 'ATTACHMENT',
    attributes: {
      parameters: {},
      dynamicAttributes: [
        {
          category: 'SOCIAL',
          key: 'profession',
          label: '职业',
          controlType: 'SELECT',
          options: [
            {
              value: 'office_worker',
              preview: '/assets/profession/office.png',
              subParams: {
                key: 'profession_details',
                controls: [
                  {
                    type: 'SELECT',
                    label: '工具',
                    options: ['laptop', 'briefcase', 'phone']
                  }
                ]
              }
            },
            {
              value: 'artist',
              preview: '/assets/profession/artist.png',
              subParams: {
                key: 'profession_details',
                controls: [
                  {
                    type: 'SELECT',
                    label: '工具',
                    options: ['brush', 'pencil', 'tablet']
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  }
];

// 暂时隐藏其他模块
export const styles: PromptModule[] = [];
export const environments: PromptModule[] = [];
