export type Vec3 = [number, number, number]

export type Palette = {
  keyColor: Vec3
  darkCp: number
  lightCp: number
  hueTorsion: number
}

export type NamedPalette = Palette & { name: string }

export type PaletteRange = {
  range: [number, number]
}

export type Theme = {
  backgrounds: {
    [paletteId: string]: PaletteRange
  }
  foregrounds: {
    [paletteId: string]: PaletteRange
  }
}

export type NamedTheme = Theme & { name: string }
