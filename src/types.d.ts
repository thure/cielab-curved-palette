declare module '*.png' {
  const str: string
  export default str
}

export type Palette = {
  name: string
  keyColor: [number, number, number]
  darkCp: number
  lightCp: number
  hueTorsion: number
}
