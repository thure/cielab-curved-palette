export type Vec3 = [number, number, number]

export type Palette = {
  keyColor: Vec3
  darkCp: number
  lightCp: number
  hueTorsion: number
}

export type NamedPalette = Palette & { name: string }
