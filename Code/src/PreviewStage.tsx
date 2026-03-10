import { useEffect, useMemo, useRef } from 'react'
import type { TypographySettings } from './model'
import { presets } from './animationPresets'

type Props = {
  settings: TypographySettings
  playSignal: number
}

export function PreviewStage({ settings, playSignal }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const lines = useMemo(() => settings.lines, [settings.lines])

  const maskFix = useMemo(() => {
    if (settings.presetId !== 'effect-4') return null
    const padEm = Math.max(0, (1 - settings.lineHeight) / 2)
    const padXEm = 0.2
    if (padEm <= 0 && padXEm <= 0) return null
    return {
      paddingTop: `${padEm}em`,
      paddingBottom: `${padEm}em`,
      marginTop: `-${padEm}em`,
      marginBottom: `-${padEm}em`,
      paddingLeft: `${padXEm}em`,
      paddingRight: `${padXEm}em`,
      marginLeft: `-${padXEm}em`,
      marginRight: `-${padXEm}em`,
    } as const
  }, [settings.lineHeight, settings.presetId])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-anim-target="true"]'))

    for (const el of targets) {
      el.getAnimations().forEach((a) => a.cancel())
      el.style.opacity = ''
      el.style.transform = ''
      el.style.removeProperty('clip-path')
      el.style.removeProperty('filter')
    }

    const preset = presets[settings.presetId]

    targets.forEach((el, index) => {
      const delay = settings.animatePerCharacter
        ? index * settings.characterStaggerMs
        : index * settings.staggerMs

      el.animate(preset.getKeyframes(settings), {
        ...preset.getOptions(settings),
        delay,
      })
    })
  }, [playSignal, settings])

  const baseTextStyle: React.CSSProperties = {
    fontFamily: settings.fontFamily,
    fontSize: `${settings.fontSizePx}px`,
    letterSpacing: `${settings.letterSpacingEm}em`,
    lineHeight: settings.lineHeight,
    fontWeight: settings.fontWeight,
    color: settings.textColor,
  }

  return (
    <div className="h-full w-full" style={{ background: settings.backgroundColor }}>
      <div className="flex h-full w-full items-center justify-center overflow-visible p-10">
        <div ref={containerRef} style={baseTextStyle}>
          {lines.map((line, lineIndex) => {
            if (!settings.animatePerCharacter) {
              return (
                <div key={lineIndex} className="whitespace-pre">
                  <span
                    data-anim-target="true"
                    className="inline-block"
                    style={maskFix ?? undefined}
                  >
                    {line}
                  </span>
                </div>
              )
            }

            return (
              <div key={lineIndex} className="whitespace-pre">
                {Array.from(line).map((ch, chIndex) => (
                  <span
                    key={`${lineIndex}-${chIndex}`}
                    data-anim-target="true"
                    className="inline-block"
                    style={maskFix ?? undefined}
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
