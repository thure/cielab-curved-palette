import React from 'react'
import { Box, Flex, Input, Text, Slider } from '@fluentui/react-northstar'

import { useAppSelector } from '../state/hooks'
import { PalettePreview } from './PalettePreview'
import { curvePathFromPalette } from '../lib/paletteShades'

const numericProps = { min: 0, max: 100, step: 0.01 }

export const PaletteRange = ({ themeId, themeKey, paletteId }) => {
  const darkPoint = useAppSelector(
    (state) => state.themes[themeId][themeKey][paletteId].range[0]
  )
  const lightPoint = useAppSelector(
    (state) => state.themes[themeId][themeKey][paletteId].range[1]
  )
  const palette = useAppSelector((state) => state.palettes[paletteId])

  const sliderVariables = ({ colorScheme }) => ({
    railOpacity: 0,
    thumbBackgroundColor: colorScheme.default.foreground,
    thumbBorderColor: colorScheme.default.background,
    thumbBorderWidth: '2px',
    thumbBorderStyle: 'solid',
  })

  const htmlId = `${themeId}__${themeKey}__${paletteId}`

  return (
    <Box styles={{ flex: '1 0 0' }}>
      <Box styles={{ position: 'relative', marginBlockEnd: '.5rem' }}>
        <PalettePreview
          curve={curvePathFromPalette(palette)}
          variant="narrow"
        />
        <Box
          styles={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        >
          <Slider
            fluid
            {...numericProps}
            value={darkPoint}
            variables={sliderVariables}
          />
          <Slider
            fluid
            {...numericProps}
            value={lightPoint}
            variables={sliderVariables}
          />
        </Box>
      </Box>
      <Flex vAlign="center">
        <Text
          as="label"
          htmlFor={`${htmlId}--dark`}
          styles={{ marginInlineEnd: '.5rem' }}
        >
          Darkest point
        </Text>
        <Input
          id={`${htmlId}--dark`}
          type="number"
          {...numericProps}
          value={`${darkPoint}`}
          styles={{ marginInlineEnd: '1rem' }}
        />
        <Text
          as="label"
          htmlFor={`${htmlId}--light`}
          styles={{ marginInlineEnd: '.5rem' }}
        >
          Lightest point
        </Text>
        <Input
          id={`${htmlId}--light`}
          type="number"
          {...numericProps}
          value={`${lightPoint}`}
          styles={{ marginInlineEnd: '1rem' }}
        />
      </Flex>
    </Box>
  )
}
