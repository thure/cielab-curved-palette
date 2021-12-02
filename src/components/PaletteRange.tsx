import React, { useCallback } from 'react'
import { batch } from 'react-redux'
import isNumber from 'lodash/isNumber'
import { Box, Flex, Text, Slider } from '@fluentui/react-northstar'

import { Input } from './Input'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { themesSlice } from '../state/themes'
import { PalettePreview } from './PalettePreview'
import { curvePathFromPalette } from '../lib/paletteShades'
import { SwatchPreview } from './SwatchPreview'

const numericProps = { min: 0, max: 100, step: 0.01 }

const sliderVariables = ({ colorScheme }) => ({
  railOpacity: 0,
  thumbBackgroundColor: colorScheme.default.foreground,
  thumbBorderColor: colorScheme.default.background,
  thumbBorderWidth: '2px',
  thumbBorderStyle: 'solid',
})

export const PaletteRange = ({ themeId, themeKey, paletteId, bgLs }) => {
  const dispatch = useAppDispatch()

  const darkPoint = useAppSelector(
    (state) => state.themes[themeId][themeKey][paletteId].range[0]
  )
  const lightPoint = useAppSelector(
    (state) => state.themes[themeId][themeKey][paletteId].range[1]
  )
  const palette = useAppSelector((state) => state.palettes[paletteId])

  const deps = [themeId, themeKey, paletteId, darkPoint, lightPoint]

  const getter = (value) => value.toFixed(2)
  const setter = (valueStr) => Math.min(100, Math.max(0, parseFloat(valueStr)))

  const onDarkChange = useCallback((numericValue) => {
    if (numericValue > lightPoint) {
      batch(() => {
        dispatch(
          themesSlice.actions.setLightPoint({
            themeId,
            themeKey,
            paletteId,
            value: numericValue,
          })
        )
        dispatch(
          themesSlice.actions.setDarkPoint({
            themeId,
            themeKey,
            paletteId,
            value: numericValue,
          })
        )
      })
    } else {
      dispatch(
        themesSlice.actions.setDarkPoint({
          themeId,
          themeKey,
          paletteId,
          value: numericValue,
        })
      )
    }
  }, deps)

  const onLightChange = useCallback((value) => {
    const numericValue = Math.min(100, Math.max(0, parseFloat(value)))
    if (numericValue < darkPoint) {
      batch(() => {
        dispatch(
          themesSlice.actions.setLightPoint({
            themeId,
            themeKey,
            paletteId,
            value: numericValue,
          })
        )
        dispatch(
          themesSlice.actions.setDarkPoint({
            themeId,
            themeKey,
            paletteId,
            value: numericValue,
          })
        )
      })
    } else {
      dispatch(
        themesSlice.actions.setLightPoint({
          themeId,
          themeKey,
          paletteId,
          value: numericValue,
        })
      )
    }
  }, deps)

  const htmlId = `${themeId}__${themeKey}__${paletteId}`

  const curve = curvePathFromPalette(palette)

  return (
    <Box styles={{ flex: '1 0 0' }}>
      <SwatchPreview
        paletteId={paletteId}
        paletteCurve={curve}
        range={[darkPoint, lightPoint]}
        bgLs={bgLs}
        themeKey={themeKey}
        themeId={themeId}
      />
      <Box styles={{ position: 'relative', marginBlockEnd: '.5rem' }}>
        <PalettePreview curve={curve} variant="narrow" />
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
            onChange={(_e, { value }) => onDarkChange(setter(value))}
          />
          <Slider
            fluid
            {...numericProps}
            value={lightPoint}
            variables={sliderVariables}
            onChange={(_e, { value }) => onLightChange(setter(value))}
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
          value={darkPoint}
          getter={getter}
          setter={setter}
          onChange={onDarkChange}
          styles={{ marginInlineEnd: '1rem' }}
          key={`${paletteId}__range--dark__${darkPoint}`}
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
          value={lightPoint}
          getter={getter}
          setter={setter}
          onChange={onLightChange}
          styles={{ marginInlineEnd: '1rem' }}
          key={`${paletteId}__range--light__${lightPoint}`}
        />
      </Flex>
    </Box>
  )
}
