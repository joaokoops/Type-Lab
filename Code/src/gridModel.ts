export type GridItem = {
  id: string
  rawName: string
  text: string
  textColor: string
  bgColor: string
}

// Figma JSON types
interface FigmaColor {
  r: number
  g: number
  b: number
}

interface FigmaFill {
  type: string
  visible: boolean
  opacity: number
  blendMode: string
  color: FigmaColor
  boundVariables?: any
}

interface FigmaText {
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  fills: FigmaFill[]
  characters: string
  fontSize: number
  fontName: {
    family: string
    style: string
  }
  textAlignHorizontal: string
  textAlignVertical: string
  lineHeight: {
    unit: string
    value: number
  }
}

interface FigmaFrame {
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  fills: FigmaFill[]
  cornerRadius: number
  children: FigmaText[]
  layoutMode: string
  primaryAxisSizingMode: string
  counterAxisSizingMode: string
  primaryAxisAlignItems: string
  counterAxisAlignItems: string
  itemSpacing: number
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `${toHex(r)}${toHex(g)}${toHex(b)}`
}

export function parseFigmaJson(jsonString: string): GridItem[] {
  try {
    const frames: FigmaFrame[] = JSON.parse(jsonString)
    const items: GridItem[] = []

    for (const frame of frames) {
      if (frame.type !== 'FRAME' || !frame.children || frame.children.length === 0) {
        continue
      }

      const textChild = frame.children.find(child => child.type === 'TEXT')
      if (!textChild || !textChild.characters) {
        continue
      }

      // Get background color from frame
      const bgFill = frame.fills.find(fill => fill.type === 'SOLID' && fill.visible)
      if (!bgFill || !bgFill.color) {
        continue
      }

      // Get text color from text element
      const textFill = textChild.fills.find(fill => fill.type === 'SOLID' && fill.visible)
      if (!textFill || !textFill.color) {
        continue
      }

      const bgColor = rgbToHex(bgFill.color.r, bgFill.color.g, bgFill.color.b)
      const textColor = rgbToHex(textFill.color.r, textFill.color.g, textFill.color.b)
      const text = textChild.characters.trim()

      if (text) {
        items.push({
          id: frame.name,
          rawName: frame.name,
          text,
          textColor: `#${textColor}`,
          bgColor: `#${bgColor}`,
        })
      }
    }

    return items
  } catch (error) {
    console.error('Error parsing Figma JSON:', error)
    return []
  }
}

export function parseGridLayerName(layerName: string): GridItem | null {
  const trimmed = layerName.trim()
  if (!trimmed) return null

  const parts = trimmed.split('-')
  if (parts.length < 3) return null

  const bg = parts[parts.length - 1]
  const fg = parts[parts.length - 2]
  const textPart = parts.slice(0, -2).join('-')

  const isHex = (s: string) => /^[0-9a-fA-F]{6}$/.test(s)
  if (!isHex(fg) || !isHex(bg)) return null

  const text = textPart.replace(/_/g, ' ')

  return {
    id: `${textPart}-${fg}-${bg}`,
    rawName: trimmed,
    text,
    textColor: `#${fg}`,
    bgColor: `#${bg}`,
  }
}

export function parseGridLayerList(input: string): GridItem[] {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  const items: GridItem[] = []
  for (const line of lines) {
    const parsed = parseGridLayerName(line)
    if (parsed) items.push(parsed)
  }
  return items
}
