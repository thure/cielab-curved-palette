import React, { useState } from 'react'
import { Box, Flex, Input, Checkbox, Text } from '@fluentui/react-northstar'
import range from 'lodash/range'

import { usePaletteCurve } from '../lib/usePaletteCurve'
import { CurvePath, Vector3 } from 'three'
import { Palette } from '../lib/interfaces'
import { Lab_to_hex, paletteShadesFromCurve } from '../lib/paletteShades'

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
  const [includeWhite, setIncludeWhite] = useState(false)
  const [includeBlack, setIncludeBlack] = useState(false)

  const { paletteId } = props
  const [paletteCurve, palette] =
    [props.paletteCurve, props.palette] ?? usePaletteCurve(paletteId)

  const divisions = nShades * 2 + 1
  const allShades = paletteShadesFromCurve(
    paletteCurve,
    divisions + (!(includeWhite && includeBlack) ? 1 : 0)
  )
  const shades = (() => {
    const result = []
    if (includeBlack) result.push(allShades[0])
    for (
      var i = includeBlack ? 1 : 2;
      i < allShades.length - (includeWhite ? 2 : 1);
      i += 2
    ) {
      result.push(allShades[i])
    }
    if (includeWhite) result.push(allShades[allShades.length - 1])
    return result
  })()

  const id = `${paletteId}__swatch-preview`
  const nShadesId = `${id}__n-shades`
  const includeWhiteId = `${id}__include-white`
  const includeBlackId = `${id}__include-black`

  const shadeStyles = {
    height: '3rem',
    flex: '1 1 3rem',
    borderRadius: '.25rem',
    marginInlineStart: `${10 / shades.length}%`,
  }

  return (
    <Box>
      <Flex styles={{ marginInlineEnd: '-1rem' }}>
        <Box styles={styles.controlSet}>
          <Text as="label" id={nShadesId} styles={styles.label}>
            Number of shades
          </Text>
          <Input
            fluid
            type="number"
            min={0}
            max={360}
            aria-labelledby={nShadesId}
            value={`${nShades}`}
            onChange={(_e, { value }) => setNShades(parseInt(value))}
          />
        </Box>
        <Box styles={styles.controlSet}>
          <Text as="label" id={includeBlackId} styles={styles.label}>
            Include black
          </Text>
          <Checkbox
            aria-labelledby={id}
            toggle
            checked={includeBlack}
            onChange={() => setIncludeBlack(!includeBlack)}
          />
        </Box>
        <Box styles={styles.controlSet}>
          <Text as="label" id={includeWhiteId} styles={styles.label}>
            Include white
          </Text>
          <Checkbox
            aria-labelledby={id}
            toggle
            checked={includeWhite}
            onChange={() => setIncludeWhite(!includeWhite)}
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
          <Box styles={{ ...shadeStyles, backgroundColor: Lab_to_hex(lab) }} />
        ))}
      </Flex>
    </Box>
  )
}
