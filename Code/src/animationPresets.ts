import type { AnimationPresetId, TypographySettings } from './model'

export type ResolvedPreset = {
  id: AnimationPresetId
  name: string
  description: string
  getKeyframes: (s: TypographySettings) => Keyframe[]
  getOptions: (s: TypographySettings) => KeyframeAnimationOptions
}

const baseOptions = (s: TypographySettings): KeyframeAnimationOptions => ({
  duration: s.durationMs,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  fill: 'both',
})

export const presets: Record<AnimationPresetId, ResolvedPreset> = {
  'effect-1': {
    id: 'effect-1',
    name: 'Effect 1',
    description: 'Slide up + fade',
    getKeyframes: (s) => [
      {
        transform: `translate(${s.initialX}px, ${s.initialY}px) rotate(${s.rotationDeg}deg)`,
        opacity: 0,
      },
      {
        transform: `translate(${s.endX}px, ${s.endY}px) rotate(${s.rotationDeg}deg)`,
        opacity: 1,
      },
    ],
    getOptions: baseOptions,
  },
  'effect-2': {
    id: 'effect-2',
    name: 'Effect 2',
    description: 'Pop in (scale) + fade',
    getKeyframes: (s) => [
      {
        transform: `translate(${s.initialX}px, ${s.initialY}px) rotate(${s.rotationDeg}deg) scale(0.92)`,
        opacity: 0,
        filter: 'blur(6px)',
      },
      {
        transform: `translate(${s.endX}px, ${s.endY}px) rotate(${s.rotationDeg}deg) scale(1)`,
        opacity: 1,
        filter: 'blur(0px)',
      },
    ],
    getOptions: (s) => ({
      ...baseOptions(s),
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }),
  },
  'effect-3': {
    id: 'effect-3',
    name: 'Effect 3',
    description: 'Skewed rise',
    getKeyframes: (s) => [
      {
        transform: `translate(${s.initialX}px, ${s.initialY}px) rotate(${s.rotationDeg}deg) skewY(6deg)`,
        opacity: 0,
      },
      {
        transform: `translate(${s.endX}px, ${s.endY}px) rotate(${s.rotationDeg}deg) skewY(0deg)`,
        opacity: 1,
      },
    ],
    getOptions: baseOptions,
  },
  'effect-4': {
    id: 'effect-4',
    name: 'Effect 4',
    description: 'Left to right reveal',
    getKeyframes: (s) => {
      const padXEm = 0.2
      const padX = `-${padXEm}em`
      return [
        {
          transform: `translate(${s.initialX - 12}px, ${s.initialY}px) rotate(${s.rotationDeg}deg)`,
          opacity: 0,
          clipPath: `inset(0 100% 0 ${padX})`,
        },
        {
          transform: `translate(${s.endX}px, ${s.endY}px) rotate(${s.rotationDeg}deg)`,
          opacity: 1,
          clipPath: `inset(0 ${padX} 0 ${padX})`,
        },
      ]
    },
    getOptions: baseOptions,
  },
}
