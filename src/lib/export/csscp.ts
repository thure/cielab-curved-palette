import { RootState } from '../../state/store'
import {
  curvePathFromPalette,
  Lab_to_hex,
  paletteShadesFromCurve,
} from '../paletteShades'

export function render(state: RootState) {
  const exp = state.exportSettings
  const { palettes, themes } = state
  const paletteCurves = Object.keys(palettes).reduce((acc, paletteId) => {
    acc[paletteId] = curvePathFromPalette(palettes[paletteId])
    return acc
  }, {})
  return `${exp.selector} {\n${Object.keys(exp.include)
    .map((themeId) => {
      const theme = themes[themeId]
      return ['foregrounds', 'backgrounds']
        .map((themeKey) => {
          return Object.keys(exp.include[themeId][themeKey])
            .map((paletteId) => {
              const { nShades, shadeNames, range } = theme[themeKey][paletteId]
              const palette = palettes[paletteId]
              const shades = paletteShadesFromCurve(
                paletteCurves[paletteId],
                nShades,
                16,
                range
              )
              return exp.include[themeId][themeKey][paletteId]
                .map((shade) => {
                  return `  --${shadeNames[shade]}: ${Lab_to_hex(
                    shades[shade]
                  )};`
                })
                .join('\n')
            })
            .join('\n')
        })
        .join('\n')
    })
    .join('\n')}\n}`
}
