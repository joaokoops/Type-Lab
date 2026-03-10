export type AnimationPresetId = 'effect-1' | 'effect-2' | 'effect-3' | 'effect-4'

export type TypographySettings = {
  lines: string[]

  fontFamily: string
  fontSizePx: number
  letterSpacingEm: number
  lineHeight: number
  fontWeight: number
  rotationDeg: number

  textColor: string
  backgroundColor: string

  presetId: AnimationPresetId

  durationMs: number
  staggerMs: number
  initialX: number
  initialY: number
  endX: number
  endY: number
  animatePerCharacter: boolean
  characterStaggerMs: number
}

export const defaultSettings: TypographySettings = {
  lines: ['TYPELAB', 'HELLO MONDAY'],

  fontFamily: 'Monigue DEMO',
  fontSizePx: 96,
  letterSpacingEm: 0,
  lineHeight: 1,
  fontWeight: 400,
  rotationDeg: 0,

  textColor: '#ffffff',
  backgroundColor: '#0a0a0a',

  presetId: 'effect-1',

  durationMs: 800,
  staggerMs: 120,
  initialX: 0,
  initialY: 24,
  endX: 0,
  endY: 0,
  animatePerCharacter: false,
  characterStaggerMs: 16,
}
