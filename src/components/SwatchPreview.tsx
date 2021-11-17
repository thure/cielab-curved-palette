import React, { useState } from 'react'
import { Box, Flex, Input, Text } from '@fluentui/react-northstar'

import { usePaletteCurve } from '../lib/usePaletteCurve'
import { CurvePath, Vector3 } from 'three'
import { Palette } from '../lib/interfaces'
import { Lab_to_hex, paletteShadesFromCurve } from '../lib/paletteShades'
import { ShadeInspection } from './ShadeInspection'

const styles = {
  controlSet: { flex: '0 0 auto', marginInlineEnd: '1rem' },
  label: { display: 'block', marginBlockEnd: '.5rem' },
  bw: {
    flexBasis: '1rem',
    maxWidth: '1rem',
  },
  shadePreview: {
    height: '3rem',
    borderRadius: '.25rem',
  },
}

const getContrast = (L1: number, L2: number): number =>
  (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)

const contrastText = (L1: number, L2: number): string => {
  const contrast = getContrast(L1, L2)
  switch (true) {
    case contrast >= 7:
      return '7'
    case contrast >= 4.5:
      return '4.5'
    case contrast >= 3:
      return '3'
    default:
      return '∅'
  }
}

const WCAGRatio = ({ bgL, fgL }: { bgL: number; fgL: number }) => {
  return <Text size="small">{contrastText(bgL, fgL)}</Text>
}

export const SwatchPreview = (props: {
  paletteId: string
  paletteCurve?: CurvePath<Vector3>
  palette?: Palette
  range?: number[]
  bgL?: number
}) => {
  const [nShades, setNShades] = useState(8)

  const { paletteId, range = [0, 100], bgL } = props
  const [paletteCurve, _palette] =
    [props.paletteCurve, props.palette] ?? usePaletteCurve(paletteId)

  const shades = paletteShadesFromCurve(paletteCurve, nShades, 16, range)

  const id = `${paletteId}__swatch-preview`
  const nShadesId = `${id}__n-shades`

  const shadeStyles = {
    flex: '1 1 3rem',
    textAlign: 'center',
    marginInlineStart: `${10 / shades.length}%`,
  }

  return (
    <Box styles={{ marginBlockEnd: '2rem' }}>
      <Flex styles={{ marginInlineEnd: '-1rem' }}>
        <Box styles={styles.controlSet}>
          <Text as="label" id={nShadesId} styles={styles.label}>
            Number of shades
          </Text>
          <Input
            fluid
            type="number"
            min={1}
            max={360}
            aria-labelledby={nShadesId}
            value={`${nShades}`}
            onChange={(_e, { value }) => setNShades(parseInt(value))}
          />
        </Box>
      </Flex>
      <Flex
        styles={{
          marginBlockStart: '1rem',
          marginInlineStart: `${-10 / shades.length}%`,
        }}
      >
        {shades.map((lab) => (
          <ShadeInspection lab={lab} key={JSON.stringify(lab)}>
            <Box
              tabIndex={0}
              styles={{
                ...shadeStyles,
                ...((lab[0] === 0 || lab[0] === 100) && styles.bw),
              }}
            >
              <Box
                styles={{
                  ...styles.shadePreview,
                  backgroundColor: Lab_to_hex(lab),
                }}
              />
              {bgL && <WCAGRatio bgL={bgL} fgL={lab[0]} />}
            </Box>
          </ShadeInspection>
        ))}
      </Flex>
    </Box>
  )
}
