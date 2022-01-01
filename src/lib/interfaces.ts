import { nanoid } from 'nanoid'

export type Vec3 = [number, number, number]

export type Palette = {
  keyColor: Vec3
  darkCp: number
  lightCp: number
  hueTorsion: number
}

export type NamedPalette = Palette & { name: string }

export const paletteTemplate = (): NamedPalette & { id: string } => ({
  id: nanoid(),
  name: '',
  keyColor: [44.51, 39.05, 288.84],
  darkCp: 2 / 3,
  lightCp: 1 / 3,
  hueTorsion: 0,
})

export type PaletteConfig = {
  range: [number, number]
  nShades: number
  shadeNames: string[]
}

export type Theme = {
  backgrounds: {
    [paletteId: string]: PaletteConfig
  }
  foregrounds: {
    [paletteId: string]: PaletteConfig
  }
}

export type NamedTheme = Theme & { name: string }

export const themeTemplate = (): NamedTheme & { id: string } => ({
  id: nanoid(),
  name: '',
  backgrounds: {},
  foregrounds: {},
})
