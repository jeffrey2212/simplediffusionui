import { PromptModule } from '../types';

export const subjects: PromptModule[] = [
  {
    id: 'subject-person',
    title: '人物',
    icon: '👤',
    type: 'SUBJECT',
    attributes: {
      parameters: {
        // 基础属性
        gender: 50, // 0: 女性, 100: 男性
        age: 25, // 年龄 (0-100)
        height: 50, // 身高比例
        build: 50, // 体型 (0: 瘦, 100: 壮)
        
        // 面部特征
        face_shape: 50, // 脸型 (0: 圆, 100: 方)
        skin_tone: 50, // 肤色
        eye_size: 50, // 眼睛大小
        eye_color: 50, // 眼睛颜色
        nose_size: 50, // 鼻子大小
        lip_size: 50, // 嘴唇大小
        
        // 发型
        hair_length: 50, // 头发长度
        hair_color: 50, // 头发颜色
        hair_style: 50, // 发型风格
        
        // 表情和姿势
        expression: 50, // 表情 (0: 严肃, 100: 开心)
        pose: 50, // 姿势 (0: 静态, 100: 动态)
        
        // 服装
        clothing_style: 50, // 服装风格
        clothing_color: 50, // 服装颜色
        
        // 渲染风格
        detail_level: 75, // 细节程度
        realism: 60, // 真实感
        lighting: 50, // 光照效果
      }
    }
  }
];

// 暂时隐藏其他模块
export const styles: PromptModule[] = [];
export const environments: PromptModule[] = [];
