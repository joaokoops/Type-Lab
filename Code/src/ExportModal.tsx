import type { TypographySettings } from './model'
import { presets } from './animationPresets'

type Props = {
  open: boolean
  onClose: () => void
  settings: TypographySettings
}

function buildSnippet(settings: TypographySettings) {
  const preset = presets[settings.presetId]

  const maskFixPadEm = settings.presetId === 'effect-4' ? Math.max(0, (1 - settings.lineHeight) / 2) : 0
  const maskFixPadXEm = settings.presetId === 'effect-4' ? 0.2 : 0
  const maskFixStyleWithX =
    maskFixPadEm > 0 || maskFixPadXEm > 0
      ? ` style="${
          maskFixPadEm > 0
            ? `padding-top:${maskFixPadEm}em;padding-bottom:${maskFixPadEm}em;margin-top:-${maskFixPadEm}em;margin-bottom:-${maskFixPadEm}em;`
            : ''
        }${maskFixPadXEm > 0 ? `padding-left:${maskFixPadXEm}em;padding-right:${maskFixPadXEm}em;margin-left:-${maskFixPadXEm}em;margin-right:-${maskFixPadXEm}em;` : ''}display:inline-block"`
      : ''

  const htmlLines = settings.lines
    .map((l) => l.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'))
    .map((l) => `<div class="tl-line" data-tl-target${maskFixStyleWithX}>${l}</div>`)
    .join('\n')

  const css = `.tl-container {
  font-family: 'Helvetica Neue';
  font-size: ${settings.fontSizePx}px;
  letter-spacing: ${settings.letterSpacingEm}em;
  line-height: ${settings.lineHeight};
  font-weight: ${settings.fontWeight};
  color: ${settings.textColor};
}

.tl-stage {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 40px;
}

.tl-type {
  font-family: ${JSON.stringify(settings.fontFamily)};
  font-size: ${settings.fontSizePx}px;
  letter-spacing: ${settings.letterSpacingEm}em;
  line-height: ${settings.lineHeight};
  font-weight: ${settings.fontWeight};
}

.tl-line { white-space: pre; }
.tl-char { display: inline-block; }`

  const jsKeyframes = JSON.stringify(preset.getKeyframes(settings), null, 2)

  const js = `const settings = ${JSON.stringify(
    {
      durationMs: settings.durationMs,
      staggerMs: settings.staggerMs,
      animatePerCharacter: settings.animatePerCharacter,
      characterStaggerMs: settings.characterStaggerMs,
    },
    null,
    2,
  )};

const keyframes = ${jsKeyframes};

const options = {
  duration: ${settings.durationMs},
  easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
  fill: 'both',
};

const container = document.querySelector('[data-tl-container]');
const targets = Array.from(container.querySelectorAll('[data-tl-target]'));

function play() {
  targets.forEach((el) => el.getAnimations().forEach((a) => a.cancel()));

  targets.forEach((el, i) => {
    const delay = settings.animatePerCharacter ? i * settings.characterStaggerMs : i * settings.staggerMs;
    el.animate(keyframes, { ...options, delay });
  });
}

play();`

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
${css}
    </style>
  </head>
  <body>
    <div class="tl-stage">
      <div class="tl-type" data-tl-container>
${settings.animatePerCharacter ? '' : htmlLines}
      </div>
    </div>

    <script>
${settings.animatePerCharacter ? '' : js}
    </script>
  </body>
</html>`

  if (!settings.animatePerCharacter) {
    return html
  }

  const htmlChars = settings.lines
    .map((line) => {
      const chars = Array.from(line)
        .map((ch) => (ch === ' ' ? '&nbsp;' : ch.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')))
        .map((ch) => `<span class="tl-char" data-tl-target${maskFixStyleWithX}>${ch}</span>`)
        .join('')
      return `<div class="tl-line">${chars}</div>`
    })
    .join('\n')

  const html2 = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
${css}
    </style>
  </head>
  <body>
    <div class="tl-stage">
      <div class="tl-type" data-tl-container>
${htmlChars}
      </div>
    </div>

    <script>
${js}
    </script>
  </body>
</html>`

  return html2
}

export function ExportModal({ open, onClose, settings }: Props) {
  if (!open) return null

  const snippet = buildSnippet(settings)

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-0 p-4 sm:p-8">
        <div className="mx-auto flex h-full max-w-4xl flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 p-4">
            <div>
              <div className="text-sm font-medium text-zinc-100">Export Code Snippet</div>
              <div className="text-xs text-zinc-400">Includes CSS + JS (Web Animations API)</div>
            </div>
            <button
              className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              onClick={onClose}
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <pre className="whitespace-pre-wrap break-words rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-100">
              {snippet}
            </pre>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-zinc-800 p-4">
            <button
              className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
              onClick={async () => {
                await navigator.clipboard.writeText(snippet)
              }}
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
