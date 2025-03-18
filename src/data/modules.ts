import { PromptModule } from '../types';

export const subjects: PromptModule[] = [
  {
    id: 'subject-1',
    title: '人物',
    icon: '👤',
    type: 'SUBJECT',
    attributes: {
      parameters: {
        detail: 75,
        realism: 60,
        lighting: 50
      }
    }
  },
  {
    id: 'subject-2',
    title: '风景',
    icon: '🌄',
    type: 'SUBJECT',
    attributes: {
      parameters: {
        scale: 80,
        atmosphere: 70,
        depth: 65
      }
    }
  },
  {
    id: 'subject-3',
    title: '动物',
    icon: '🦊',
    type: 'SUBJECT',
    attributes: {
      parameters: {
        detail: 70,
        action: 50,
        expression: 60
      }
    }
  }
];

export const styles: PromptModule[] = [
  {
    id: 'style-1',
    title: '水彩',
    icon: '🎨',
    type: 'STYLE',
    attributes: {
      parameters: {
        intensity: 65,
        blending: 70,
        texture: 80
      }
    }
  },
  {
    id: 'style-2',
    title: '赛博朋克',
    icon: '🌆',
    type: 'STYLE',
    attributes: {
      parameters: {
        neon: 75,
        tech: 80,
        grit: 60
      }
    }
  },
  {
    id: 'style-3',
    title: '动漫',
    icon: '✨',
    type: 'STYLE',
    attributes: {
      parameters: {
        stylization: 85,
        shading: 70,
        lineArt: 75
      }
    }
  }
];

export const environments: PromptModule[] = [
  {
    id: 'env-1',
    title: '城市',
    icon: '🌃',
    type: 'ENVIRONMENT',
    attributes: {
      parameters: {
        density: 70,
        timeOfDay: 50,
        weather: 60
      }
    }
  },
  {
    id: 'env-2',
    title: '自然',
    icon: '🌲',
    type: 'ENVIRONMENT',
    attributes: {
      parameters: {
        vegetation: 80,
        terrain: 65,
        atmosphere: 75
      }
    }
  },
  {
    id: 'env-3',
    title: '室内',
    icon: '🏠',
    type: 'ENVIRONMENT',
    attributes: {
      parameters: {
        lighting: 60,
        furnishing: 70,
        mood: 65
      }
    }
  }
];
