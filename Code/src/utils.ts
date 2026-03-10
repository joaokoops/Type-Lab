export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const splitLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
