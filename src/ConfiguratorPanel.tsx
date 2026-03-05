import type { AnimationPresetId, TypographySettings } from './model'
import { presets } from './animationPresets'

type Props = {
  settings: TypographySettings
  onChange: (next: TypographySettings) => void
}

function NumberField(props: {
  label: string
  value: number
  min?: number
  max?: number
  step?: number
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-1">
      <div className="text-xs text-zinc-400">{props.label}</div>
      <input
        className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-100"
        type="number"
        value={props.value}
        min={props.min}
        max={props.max}
        step={props.step}
        onChange={(e) => props.onChange(Number(e.target.value))}
      />
    </label>
  )
}

function ColorField(props: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="grid gap-1">
      <div className="text-xs text-zinc-400">{props.label}</div>
      <div className="flex items-center gap-2">
        <input
          className="h-9 w-10 cursor-pointer rounded-md border border-zinc-800 bg-zinc-950"
          type="color"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
        <input
          className="h-9 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-xs text-zinc-100"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </label>
  )
}

export function ConfiguratorPanel({ settings, onChange }: Props) {
  return (
    <div className="space-y-5 text-sm">
      <section className="space-y-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">Text Content</div>
        <label className="grid gap-1">
          <div className="text-xs text-zinc-400">Lines (one per line)</div>
          <textarea
            className="min-h-[92px] w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-zinc-100"
            value={settings.lines.join('\n')}
            onChange={(e) =>
              onChange({
                ...settings,
                lines: e.target.value
                  .split(/\r?\n/)
                  .map((l) => l.trimEnd())
                  .filter((l) => l.length > 0),
              })
            }
          />
        </label>
      </section>

      <section className="space-y-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">Typography</div>
        <label className="grid gap-1">
          <div className="text-xs text-zinc-400">Font Family</div>
          <input
            className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-100"
            value={settings.fontFamily}
            onChange={(e) => onChange({ ...settings, fontFamily: e.target.value })}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Font Size"
            value={settings.fontSizePx}
            min={8}
            max={400}
            step={1}
            onChange={(v) => onChange({ ...settings, fontSizePx: v })}
          />
          <NumberField
            label="Font Weight"
            value={settings.fontWeight}
            min={100}
            max={900}
            step={1}
            onChange={(v) => onChange({ ...settings, fontWeight: v })}
          />
          <NumberField
            label="Letter Spacing (em)"
            value={settings.letterSpacingEm}
            min={-0.2}
            max={1}
            step={0.01}
            onChange={(v) => onChange({ ...settings, letterSpacingEm: v })}
          />
          <NumberField
            label="Line Height"
            value={settings.lineHeight}
            min={0.5}
            max={3}
            step={0.01}
            onChange={(v) => onChange({ ...settings, lineHeight: v })}
          />
          <NumberField
            label="Rotation (deg)"
            value={settings.rotationDeg}
            min={-45}
            max={45}
            step={0.1}
            onChange={(v) => onChange({ ...settings, rotationDeg: v })}
          />
        </div>
      </section>

      <section className="space-y-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">Color Parameters</div>
        <div className="grid grid-cols-1 gap-3">
          <ColorField
            label="Text Color"
            value={settings.textColor}
            onChange={(v) => onChange({ ...settings, textColor: v })}
          />
          <ColorField
            label="Background Color"
            value={settings.backgroundColor}
            onChange={(v) => onChange({ ...settings, backgroundColor: v })}
          />
        </div>
      </section>

      <section className="space-y-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">Animation Presets</div>
        <label className="grid gap-1">
          <div className="text-xs text-zinc-400">Preset</div>
          <select
            className="h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2 text-sm text-zinc-100"
            value={settings.presetId}
            onChange={(e) => onChange({ ...settings, presetId: e.target.value as AnimationPresetId })}
          >
            {Object.values(presets).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.description}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="space-y-2">
        <div className="text-xs font-medium tracking-wide text-zinc-300">Animation Parameters</div>
        <div className="grid grid-cols-2 gap-3">
          <NumberField
            label="Duration (ms)"
            value={settings.durationMs}
            min={0}
            max={10000}
            step={10}
            onChange={(v) => onChange({ ...settings, durationMs: v })}
          />
          <NumberField
            label="Stagger (ms)"
            value={settings.staggerMs}
            min={0}
            max={5000}
            step={1}
            onChange={(v) => onChange({ ...settings, staggerMs: v })}
          />
          <NumberField
            label="Initial X"
            value={settings.initialX}
            min={-2000}
            max={2000}
            step={1}
            onChange={(v) => onChange({ ...settings, initialX: v })}
          />
          <NumberField
            label="Initial Y"
            value={settings.initialY}
            min={-2000}
            max={2000}
            step={1}
            onChange={(v) => onChange({ ...settings, initialY: v })}
          />
          <NumberField
            label="End X"
            value={settings.endX}
            min={-2000}
            max={2000}
            step={1}
            onChange={(v) => onChange({ ...settings, endX: v })}
          />
          <NumberField
            label="End Y"
            value={settings.endY}
            min={-2000}
            max={2000}
            step={1}
            onChange={(v) => onChange({ ...settings, endY: v })}
          />
        </div>

        <label className="mt-2 flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.animatePerCharacter}
            onChange={(e) => onChange({ ...settings, animatePerCharacter: e.target.checked })}
          />
          <span className="text-sm text-zinc-200">Animate per Character</span>
        </label>

        {settings.animatePerCharacter ? (
          <div className="mt-2 grid grid-cols-2 gap-3">
            <NumberField
              label="Character Stagger (ms)"
              value={settings.characterStaggerMs}
              min={0}
              max={5000}
              step={1}
              onChange={(v) => onChange({ ...settings, characterStaggerMs: v })}
            />
          </div>
        ) : null}
      </section>
    </div>
  )
}
