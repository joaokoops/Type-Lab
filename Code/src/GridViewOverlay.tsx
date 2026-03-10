import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { GridItem } from './gridModel'
import type { TypographySettings } from './model'

type Active = {
  item: GridItem
  rect: DOMRect
} | null

type Props = {
  active: Active
  onClose: () => void
  appliedSettings: TypographySettings | null
}

const settings = {
  durationMs: 1000,
  staggerMs: 120,
  animatePerCharacter: true,
  characterStaggerMs: 24,
} as const

const keyframes: Keyframe[] = [
  { transform: 'translate(0px, 60px) rotate(-4deg)', opacity: 0 },
  { transform: 'translate(0px, 0px) rotate(-4deg)', opacity: 1 },
]

const options: KeyframeAnimationOptions = {
  duration: 1000,
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  fill: 'both',
}

// Function to get dynamic keyframes based on applied settings
const getKeyframes = (settings: TypographySettings | null): Keyframe[] => {
  if (settings) {
    return [
      { 
        transform: `translate(${settings.initialX}px, ${settings.initialY}px) rotate(${settings.rotationDeg}deg)`, 
        opacity: 0 
      },
      { 
        transform: `translate(${settings.endX}px, ${settings.endY}px) rotate(${settings.rotationDeg}deg)`, 
        opacity: 1 
      },
    ]
  }
  return keyframes
}

function rectToInset(rect: DOMRect) {
  const top = rect.top
  const left = rect.left
  const right = window.innerWidth - rect.right
  const bottom = window.innerHeight - rect.bottom
  return `${top}px ${right}px ${bottom}px ${left}px`
}

export function GridViewOverlay({ active, onClose, appliedSettings }: Props) {
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const charsContainerRef = useRef<HTMLDivElement | null>(null)
  const animatingRef = useRef(false)
  const [showBackButton, setShowBackButton] = useState(false)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const insetFrom = useMemo(() => {
    if (!active) return null
    return rectToInset(active.rect)
  }, [active])

  const dismiss = useCallback(async () => {
    if (animatingRef.current) return
    const overlay = overlayRef.current
    if (!overlay || !insetFrom) {
      onClose()
      return
    }

    animatingRef.current = true
    setShowBackButton(false)
    overlay.getAnimations().forEach((a) => a.cancel())

    const collapse = overlay.animate(
      [{ clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: `inset(${insetFrom})` }],
      { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' },
    )

    try {
      await collapse.finished
    } catch {
      // ignore
    } finally {
      animatingRef.current = false
      onClose()
    }
  }, [insetFrom, onClose])

  useEffect(() => {
    if (!active) return
    const overlay = overlayRef.current
    if (!overlay || !insetFrom) return

    animatingRef.current = true
    setShowBackButton(false)

    overlay.getAnimations().forEach((a) => a.cancel())
    overlay.style.clipPath = `inset(${insetFrom})`

    const bloom = overlay.animate(
      [{ clipPath: `inset(${insetFrom})` }, { clipPath: 'inset(0px 0px 0px 0px)' }],
      { duration: 380, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', fill: 'both' },
    )

    bloom.finished
      .catch(() => {})
      .finally(() => {
        animatingRef.current = false
        const container = charsContainerRef.current
        if (!container) return

        const targets = Array.from(container.querySelectorAll<HTMLElement>('[data-tl-target]'))
        targets.forEach((el) => el.getAnimations().forEach((a) => a.cancel()))
        targets.forEach((el, i) => {
          // Use appliedSettings if available, otherwise use default settings
          const animSettings = appliedSettings || settings
          const delay = i * (appliedSettings?.characterStaggerMs || settings.characterStaggerMs)
          const duration = appliedSettings?.durationMs || options.duration
          const dynamicKeyframes = getKeyframes(appliedSettings)
          
          el.animate(dynamicKeyframes, { 
            ...options, 
            duration,
            delay 
          })
        })

        // Show back button after character animations start
        const animSettings = appliedSettings || settings
        const duration = appliedSettings?.durationMs || (options.duration as number)
        const totalAnimationTime = Math.max(...targets.map((_, i) => 
          i * (appliedSettings?.characterStaggerMs || settings.characterStaggerMs) + duration
        ))
        setTimeout(() => setShowBackButton(true), totalAnimationTime - 200) // Show slightly before last character completes
      })
  }, [active, insetFrom])

  useEffect(() => {
    if (!active) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        void dismiss()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [active, dismiss])

  // Handle back button fade-in animation
  useEffect(() => {
    if (showBackButton && buttonRef.current) {
      const button = buttonRef.current
      button.style.opacity = '0'
      button.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 300,
        easing: 'ease-out',
        fill: 'both',
      })
    }
  }, [showBackButton])

  if (!active) return null

  const { item } = active
  const textChars = Array.from(item.text)

  return (
    <div className="fixed inset-0 z-50">
      {showBackButton && (
        <button
          ref={buttonRef}
          className="flex flex-row justify-center items-center p-4 gap-2.5 absolute w-40 h-12 left-5 top-5 bg-white rounded-lg z-10"
          style={{
            fontFamily: 'Helvetica Neue',
            fontWeight: 400,
            fontSize: '24px',
            lineHeight: '80%',
            color: item.bgColor,
            textTransform: 'uppercase',
          }}
          onClick={() => {
            void dismiss()
          }}
        >
          back
        </button>
      )}

      <div
        className="absolute inset-0 bg-black/20"
        onClick={() => {
          void dismiss()
        }}
      />

      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{
          background: item.bgColor,
          clipPath: insetFrom ? `inset(${insetFrom})` : 'inset(0px 0px 0px 0px)',
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={
            ({
              '--tl-bg': item.bgColor,
              '--tl-fg': item.textColor,
            } as unknown as React.CSSProperties)
          }
        >
          <div
            ref={charsContainerRef}
            className="select-none"
            style={{
              fontFamily: appliedSettings?.fontFamily || 'Helvetica Neue',
              fontSize: appliedSettings ? `${appliedSettings.fontSizePx}px` : 'clamp(80px, 15vw, 400px)',
              letterSpacing: appliedSettings ? `${appliedSettings.letterSpacingEm}em` : '-0.01em',
              lineHeight: appliedSettings?.lineHeight || 0.72,
              fontWeight: appliedSettings?.fontWeight || 450,
              color: item.textColor,
              transform: appliedSettings ? `rotate(${appliedSettings.rotationDeg}deg)` : 'none',
            }}
          >
            <div className="whitespace-pre">
              {textChars.map((ch, i) => (
                <span 
                  key={i} 
                  className="tl-char inline-block" 
                  data-tl-target
                  style={{ opacity: 0 }}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
