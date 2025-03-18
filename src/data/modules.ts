import { PromptModule, DynamicAttribute, AttributeOption, ModuleNodeData } from '../types';

interface ExtendedDynamicAttribute extends DynamicAttribute {
  category?: string;
  controlType?: string;
}

const characterDynamicAttributes: ExtendedDynamicAttribute[] = [
  {
    category: 'APPEARANCE',
    key: 'facial_features',
    label: '面部特征',
    value: '',
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

const characterAttributes: DynamicAttribute[] = [
  {
    key: 'gender',
    label: '性别',
    type: 'select',
    value: '男',
    options: [
      { value: '男', label: '男' },
      { value: '女', label: '女' },
    ],
  },
  {
    key: 'age',
    label: '年龄段',
    type: 'select',
    value: '成年',
    options: [
      { value: '儿童', label: '儿童' },
      { value: '青少年', label: '青少年' },
      { value: '成年', label: '成年' },
      { value: '老年', label: '老年' },
    ],
  },
  {
    key: 'style',
    label: '风格',
    type: 'select',
    value: '写实',
    options: [
      {
        value: '写实',
        label: '写实',
        subParams: [
          {
            key: 'realism_level',
            label: '写实程度',
            type: 'select',
            value: '高',
            options: [
              { value: '低', label: '低' },
              { value: '中', label: '中' },
              { value: '高', label: '高' },
            ],
          },
        ],
      },
      {
        value: '动漫',
        label: '动漫',
        subParams: [
          {
            key: 'anime_style',
            label: '动漫风格',
            type: 'select',
            value: '日系',
            options: [
              { value: '日系', label: '日系' },
              { value: '美系', label: '美系' },
            ],
          },
        ],
      },
    ],
  },
];

const styleAttributes: DynamicAttribute[] = [
  {
    key: 'art_style',
    label: '艺术风格',
    type: 'select',
    value: '油画',
    options: [
      { value: '油画', label: '油画' },
      { value: '水彩', label: '水彩' },
      { value: '素描', label: '素描' },
    ],
  },
];

const attachmentAttributes: DynamicAttribute[] = [
  {
    key: 'type',
    label: '类型',
    type: 'select',
    value: '饰品',
    options: [
      { value: '饰品', label: '饰品' },
      { value: '道具', label: '道具' },
      { value: '背景', label: '背景' },
    ],
  },
];

export const defaultModules: ModuleNodeData[] = [
  {
    id: 'character-1',
    type: 'CHARACTER',
    title: '角色',
    icon: '👤',
    attributes: {
      dynamicAttributes: characterAttributes,
      parameters: {
        strength: 50,
        detail: 70,
      },
    },
  },
  {
    id: 'style-1',
    type: 'STYLE',
    title: '风格',
    icon: '🎨',
    attributes: {
      dynamicAttributes: styleAttributes,
      parameters: {
        intensity: 50,
      },
    },
  },
  {
    id: 'attachment-1',
    type: 'ATTACHMENT',
    title: '附件',
    icon: '🔧',
    attributes: {
      dynamicAttributes: attachmentAttributes,
      parameters: {
        visibility: 50,
      },
    },
  },
  {
    id: 'character-2',
    type: 'CHARACTER',
    title: '角色',
    icon: '👤',
    attributes: {
      coreAttributes: {
        gender: '男',
        ageStage: '成年',
        style: '写实',
      },
      dynamicAttributes: [
        {
          key: 'hair-style',
          label: '发型',
          type: 'select',
          value: 'short',
          options: [
            {
              value: 'short',
              label: '短发',
              preview: 'short-hair.jpg'
            },
            {
              value: 'long',
              label: '长发',
              preview: 'long-hair.jpg'
            },
            {
              value: 'curly',
              label: '卷发',
              preview: 'curly-hair.jpg'
            }
          ]
        },
        {
          key: 'hair-color',
          label: '发色',
          type: 'select',
          value: 'black',
          options: [
            {
              value: 'black',
              label: '黑色',
              preview: 'black-hair.jpg'
            },
            {
              value: 'brown',
              label: '棕色',
              preview: 'brown-hair.jpg'
            },
            {
              value: 'blonde',
              label: '金色',
              preview: 'blonde-hair.jpg'
            }
          ]
        },
        {
          key: 'eye-color',
          label: '瞳色',
          type: 'select',
          value: 'brown',
          options: [
            {
              value: 'brown',
              label: '棕色',
              preview: 'brown-eyes.jpg'
            },
            {
              value: 'blue',
              label: '蓝色',
              preview: 'blue-eyes.jpg'
            },
            {
              value: 'green',
              label: '绿色',
              preview: 'green-eyes.jpg'
            }
          ]
        },
        {
          key: 'skin-tone',
          label: '肤色',
          type: 'select',
          value: 'light',
          options: [
            {
              value: 'light',
              label: '白皙',
              preview: 'light-skin.jpg'
            },
            {
              value: 'medium',
              label: '中等',
              preview: 'medium-skin.jpg'
            },
            {
              value: 'dark',
              label: '深色',
              preview: 'dark-skin.jpg'
            }
          ]
        }
      ],
      parameters: {
        weight: 50
      }
    }
  },
  {
    id: 'style-2',
    type: 'STYLE',
    title: '风格',
    icon: '🎨',
    attributes: {
      dynamicAttributes: [
        {
          key: 'art-style',
          label: '艺术风格',
          type: 'select',
          value: 'realistic',
          options: [
            {
              value: 'realistic',
              label: '写实',
              preview: 'realistic.jpg'
            },
            {
              value: 'anime',
              label: '动漫',
              preview: 'anime.jpg'
            },
            {
              value: 'watercolor',
              label: '水彩',
              preview: 'watercolor.jpg'
            },
            {
              value: 'oil-painting',
              label: '油画',
              preview: 'oil-painting.jpg'
            }
          ]
        },
        {
          key: 'lighting',
          label: '光照',
          type: 'select',
          value: 'natural',
          options: [
            {
              value: 'natural',
              label: '自然光',
              preview: 'natural-light.jpg'
            },
            {
              value: 'studio',
              label: '摄影棚',
              preview: 'studio-light.jpg'
            },
            {
              value: 'dramatic',
              label: '戏剧性',
              preview: 'dramatic-light.jpg'
            }
          ]
        }
      ],
      parameters: {
        weight: 50
      }
    }
  },
  {
    id: 'attachment-2',
    type: 'ATTACHMENT',
    title: '附件',
    icon: '📎',
    attributes: {
      dynamicAttributes: [
        {
          key: 'clothing',
          label: '服装',
          type: 'select',
          value: 'casual',
          options: [
            {
              value: 'casual',
              label: '休闲',
              preview: 'casual.jpg'
            },
            {
              value: 'formal',
              label: '正式',
              preview: 'formal.jpg'
            },
            {
              value: 'sporty',
              label: '运动',
              preview: 'sporty.jpg'
            }
          ]
        },
        {
          key: 'accessories',
          label: '配饰',
          type: 'select',
          value: 'none',
          options: [
            {
              value: 'none',
              label: '无',
              preview: 'no-accessories.jpg'
            },
            {
              value: 'glasses',
              label: '眼镜',
              preview: 'glasses.jpg'
            },
            {
              value: 'jewelry',
              label: '首饰',
              preview: 'jewelry.jpg'
            }
          ]
        }
      ],
      parameters: {
        weight: 50
      }
    }
  }
];

export const subjects: PromptModule[] = [
  {
    id: 'subject-person',
    title: '人物',
    icon: '👤',
    type: 'CHARACTER',
    attributes: {
      coreAttributes: {
        gender: '男',
        ageStage: '中年'
      },
      dynamicAttributes: [
        {
          key: 'facial_features',
          label: '面部特征',
          value: 'eyes',
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
            },
            {
              value: 'nose',
              preview: '/assets/face/nose.png',
              label: ''
            },
            {
              value: 'mouth',
              preview: '/assets/face/mouth.png',
              label: ''
            },
            {
              value: 'ears',
              preview: '/assets/face/ears.png',
              label: ''
            }
          ]
        },
        {
          key: 'hair_style',
          label: '发型',
          value: 'short',
          options: [
            {
              value: 'short',
              preview: '/assets/hair/short.png',
              label: ''
            },
            {
              value: 'long',
              preview: '/assets/hair/long.png',
              label: ''
            },
            {
              value: 'curly',
              preview: '/assets/hair/curly.png',
              label: ''
            },
            {
              value: 'bald',
              preview: '/assets/hair/bald.png',
              label: ''
            }
          ],
          type: 'select'
        }
      ],
      parameters: {
        // Base rendering parameters
        detail_level: 75,
        realism: 60,
        lighting: 50
      }
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
      coreAttributes: {
        style: '时尚'
      },
      dynamicAttributes: [
        {
          key: 'hair_color',
          label: '发色',
          value: 'black',
          options: [
            {
              value: 'black', preview: '/assets/colors/black.png',
              label: ''
            },
            {
              value: 'brown', preview: '/assets/colors/brown.png',
              label: ''
            },
            {
              value: 'blonde', preview: '/assets/colors/blonde.png',
              label: ''
            },
            {
              value: 'red', preview: '/assets/colors/red.png',
              label: ''
            },
            {
              value: 'white', preview: '/assets/colors/white.png',
              label: ''
            },
            {
              value: 'blue', preview: '/assets/colors/blue.png',
              label: ''
            },
            {
              value: 'green', preview: '/assets/colors/green.png',
              label: ''
            },
            {
              value: 'purple', preview: '/assets/colors/purple.png',
              label: ''
            }
          ],
          type: 'select'
        }
      ],
      parameters: {
        detail_level: 70,
        realism: 65
      }
    }
  },
  {
    id: 'attachment-clothing',
    title: '服装',
    icon: '👔',
    type: 'ATTACHMENT',
    attributes: {
      coreAttributes: {
        style: '正式'
      },
      dynamicAttributes: [
        {
          key: 'clothing_type',
          label: '服装类型',
          value: 'casual',
          options: [
            {
              value: 'casual', preview: '/assets/clothing/casual.png',
              label: ''
            },
            {
              value: 'formal', preview: '/assets/clothing/formal.png',
              label: ''
            },
            {
              value: 'business', preview: '/assets/clothing/business.png',
              label: ''
            },
            {
              value: 'sportswear', preview: '/assets/clothing/sportswear.png',
              label: ''
            },
            {
              value: 'traditional', preview: '/assets/clothing/traditional.png',
              label: ''
            }
          ],
          type: 'select'
        },
        {
          key: 'clothing_color',
          label: '服装颜色',
          value: 'black',
          options: [
            {
              value: 'black', preview: '/assets/colors/black.png',
              label: ''
            },
            {
              value: 'white', preview: '/assets/colors/white.png',
              label: ''
            },
            {
              value: 'red', preview: '/assets/colors/red.png',
              label: ''
            },
            {
              value: 'blue', preview: '/assets/colors/blue.png',
              label: ''
            },
            {
              value: 'green', preview: '/assets/colors/green.png',
              label: ''
            },
            {
              value: 'yellow', preview: '/assets/colors/yellow.png',
              label: ''
            },
            {
              value: 'purple', preview: '/assets/colors/purple.png',
              label: ''
            },
            {
              value: 'pink', preview: '/assets/colors/pink.png',
              label: ''
            }
          ],
          type: 'select'
        }
      ],
      parameters: {
        detail_level: 75,
        realism: 70
      }
    }
  },
  {
    id: 'attachment-profession',
    title: '职业',
    icon: '👨‍💼',
    type: 'ATTACHMENT',
    attributes: {
      coreAttributes: {
        style: '专业'
      },
      dynamicAttributes: [
        {
          key: 'profession',
          label: '职业类型',
          value: 'office_worker',
          options: [
            {
              value: 'office_worker', preview: '/assets/profession/office.png',
              label: ''
            },
            {
              value: 'artist', preview: '/assets/profession/artist.png',
              label: ''
            },
            {
              value: 'doctor', preview: '/assets/profession/doctor.png',
              label: ''
            },
            {
              value: 'engineer', preview: '/assets/profession/engineer.png',
              label: ''
            },
            {
              value: 'teacher', preview: '/assets/profession/teacher.png',
              label: ''
            }
          ],
          type: 'select'
        }
      ],
      parameters: {
        detail_level: 75,
        realism: 70
      }
    }
  }
];

// 暂时隐藏其他模块
export const styles: PromptModule[] = [];
export const environments: PromptModule[] = [];
