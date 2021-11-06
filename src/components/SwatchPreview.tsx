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
}

export const SwatchPreview = (props: {
  paletteId: string
  paletteCurve?: CurvePath<Vector3>
  palette?: Palette
}) => {
  const [nShades, setNShades] = useState(8)

  const { paletteId } = props
  const [paletteCurve, _palette] =
    [props.paletteCurve, props.palette] ?? usePaletteCurve(paletteId)

  const shades = paletteShadesFromCurve(paletteCurve, nShades + 2)

  const id = `${paletteId}__swatch-preview`
  const nShadesId = `${id}__n-shades`

  const shadeStyles = {
    height: '3rem',
    flex: '1 1 3rem',
    borderRadius: '.25rem',
    marginInlineStart: `${10 / shades.length}%`,
  }

  const bwStyles = {
    flexBasis: '1rem',
    maxWidth: '1rem',
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
          <ShadeInspection lab={lab}>
            <Box
              tabIndex={0}
              styles={{
                ...shadeStyles,
                ...((lab[0] === 0 || lab[0] === 100) && bwStyles),
                backgroundColor: Lab_to_hex(lab),
              }}
            />
          </ShadeInspection>
        ))}
      </Flex>
    </Box>
  )
}
