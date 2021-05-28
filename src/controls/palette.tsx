import React, { useEffect } from 'react'
import { Box, Flex } from '@fluentui/react-northstar'
import { LAB_to_sRGB } from '../lib/csswg/utilities'

export enum shadeDistributions {
  cubeRoot = 'cubeRoot',
  linear = 'linear',
}

export const defaultShadeDistribution = shadeDistributions.cubeRoot

const nShades = 10

export const Palette = ({
  sceneControls: { updateShades },
  curvePoints,
  shadeDistribution,
}) => {
  const paletteShades =
    curvePoints.length > 0
      ? [
          curvePoints[0],
          curvePoints[16],
          curvePoints[32],
          curvePoints[48],
          curvePoints[64],
        ]
      : []

  useEffect(() => {
    paletteShades.length > 0 && updateShades(paletteShades)
  }, [curvePoints])

  return (
    <Flex
      styles={{
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
      }}
    >
      {paletteShades.map((lab) => {
        const [r, g, b] = LAB_to_sRGB(lab)
        return (
          <Box
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
