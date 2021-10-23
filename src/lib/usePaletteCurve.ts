import { useMemo } from 'react'
import { CurvePath, Vector3 } from 'three'
import values from 'lodash/values'

import { useAppSelector } from '../state/hooks'
import { curvePathFromPalette } from './paletteShades'
import { Palette } from './interfaces'

export const usePaletteCurve = (
  paletteId: string
): [CurvePath<Vector3>, Palette] => {
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
