import { useMemo } from 'react'
import values from 'lodash/values'

import { useAppSelector } from '../state/hooks'
import { curvePathFromPalette, CurvedHelixPath } from './paletteShades'
import { Palette } from './interfaces'

export const usePaletteCurve = (
  paletteId: string
): [CurvedHelixPath, Palette] => {
  const darkCp = useAppSelector((state) => state.palettes[paletteId].darkCp)
  const lightCp = useAppSelector((state) => state.palettes[paletteId].lightCp)
  const keyColor = useAppSelector((state) => state.palettes[paletteId].keyColor)
  const hueTorsion = useAppSelector(
    (state) => state.palettes[paletteId].hueTorsion
  )

  const palette = {
    darkCp,
    lightCp,
    hueTorsion,
    keyColor,
  }

  return [
    useMemo(() => {
      return curvePathFromPalette(palette)
    }, values(palette)),
    palette,
  ]
}
