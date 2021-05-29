import React, { useEffect } from 'react'
import { Box, Flex } from '@fluentui/react-northstar'
import { LAB_to_sRGB } from '../lib/csswg/utilities'
import { force_into_gamut } from '../lib/lch'

function getTargetLightness(linearity, t) {
  const cbrt = 6.3 * Math.cbrt(t * 1000 - 500) + 50
  const line = t * 100
  return Math.max(0, Math.min(100, cbrt + (line - cbrt) * linearity))
}

function getPaletteShades({ curvePoints, linearity, nShades }) {
  if (curvePoints.length <= 2) return []

  const paletteShades = []

  let c = 0

  for (let i = 0; i < nShades - 1; i++) {
    const l = getTargetLightness(linearity, i / (nShades - 1))

    while (l > curvePoints[c + 1][0]) {
      c++
    }

    const [l1, a1, b1] = curvePoints[c]
    const [l2, a2, b2] = curvePoints[c + 1]

    const u = (l - l1) / (l2 - l1)

    paletteShades[i] = [
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ]
  }

  paletteShades[nShades] = curvePoints[curvePoints.length - 1]

  return paletteShades.map(([l, a, b]) => force_into_gamut(l, a, b))
}

export const Palette = ({
  sceneControls: { updateShades },
  curvePoints,
  paletteDistributionLinearity,
  paletteNShades,
}) => {
  const paletteShades = getPaletteShades({
    curvePoints,
    nShades: paletteNShades,
    linearity: paletteDistributionLinearity,
  })

  useEffect(() => {
    paletteShades.length > 0 && updateShades(paletteShades)
  }, [curvePoints, paletteDistributionLinearity, paletteNShades])

  return (
    <Flex
      styles={{
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
      }}
    >
      {paletteShades.map((lab, l) => {
        const [r, g, b] = LAB_to_sRGB(lab)
        return (
          <Box
            key={`shade_${l}`}
            styles={{
              flex: '1 0 0',
              background: `rgb(${r * 100}% ${g * 100}% ${b * 100}%)`,
            }}
          />
        )
      })}
    </Flex>
  )
}
