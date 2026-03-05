import { useMemo, useState } from 'react'
import { ConfiguratorPanel } from './ConfiguratorPanel'
import { ExportModal } from './ExportModal'
import { PreviewStage } from './PreviewStage'
import { defaultSettings, type TypographySettings } from './model'

function App() {
  const [settings, setSettings] = useState<TypographySettings>(defaultSettings)
  const [playSignal, setPlaySignal] = useState(0)
  const [exportOpen, setExportOpen] = useState(false)

  const fontWarning = useMemo(() => {
    if (settings.fontFamily !== 'Monigue DEMO') return null
    return "Make sure you've added /public/fonts/Monigue-DEMO.woff2"
  }, [settings.fontFamily])

  return (
    <div className="h-full w-full bg-zinc-950 text-zinc-100">
      <div className="flex h-full w-full">
        <aside className="h-full w-[420px] shrink-0 border-r border-zinc-800 bg-zinc-950/60 p-4">
          <div className="flex h-full flex-col gap-4">
            <header className="space-y-1">
              <div className="text-sm font-medium tracking-wide text-zinc-300">Type Lab</div>
              <h1 className="text-xl font-semibold tracking-tight">Typography Configurator</h1>
              {fontWarning ? <div className="text-xs text-zinc-500">{fontWarning}</div> : null}
            </header>

            <div className="flex-1 overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <ConfiguratorPanel settings={settings} onChange={setSettings} />
            </div>

            <footer className="flex items-center justify-between gap-2">
              <button
                className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                onClick={() => {
                  setSettings(defaultSettings)
                  setPlaySignal((n) => n + 1)
                }}
              >
                Reset
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-white"
                  onClick={() => setPlaySignal((n) => n + 1)}
                >
                  Play
                </button>
                <button
                  className="rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                  onClick={() => setExportOpen(true)}
                >
                  Export Code Snippet
                </button>
              </div>
            </footer>
          </div>
        </aside>

        <main className="h-full flex-1 bg-zinc-950 p-6">
          <div className="flex h-full flex-col gap-4">
            <div className="text-sm text-zinc-400">Preview</div>
            <div className="relative flex-1 overflow-visible rounded-xl border border-zinc-800 bg-zinc-900">
              <PreviewStage settings={settings} playSignal={playSignal} />
            </div>
          </div>
        </main>
      </div>

      <ExportModal open={exportOpen} onClose={() => setExportOpen(false)} settings={settings} />
    </div>
  )
}

export default App
