import React, { useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Flex, Header, Input, Text } from '@fluentui/react-northstar'
import { HexColorPicker } from 'react-colorful'

import { palettesSlice } from '../state/palettes'
import {
  MainContent,
  Info,
  SliderInput,
  LchVis,
  EntityName,
  SwatchPreview,
} from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { hex_to_sRGB, Lab_to_hex } from '../lib/paletteShades'
import { LCH_to_Lab } from '../lib/csswg/conversions'
import { sRGB_to_LCH } from '../lib/csswg/utilities'
import { usePaletteCurve } from '../lib/usePaletteCurve'

const toDeg = (rad: number) => (rad * 180) / Math.PI
const toRad = (deg: number) => (deg * Math.PI) / 180

export const Palette = () => {
  const { paletteId } = useParams()
  const dispatch = useAppDispatch()
  const palettes = useAppSelector((state) => state.palettes)
  const history = useHistory()

  if (!(paletteId in palettes)) {
    history.push('/')
    return null
  }

  const [paletteCurve, palette] = usePaletteCurve(paletteId)
  const { keyColor, darkCp, lightCp, hueTorsion } = palette

  const keyColorAsHex = Lab_to_hex(LCH_to_Lab(keyColor))

  const setKeyColorFromHex = useCallback(
    (hex) => {
      dispatch(
        palettesSlice.actions.setKeyColor({
          id: paletteId,
          keyColor: sRGB_to_LCH(hex_to_sRGB(hex)),
        })
      )
    },
    [paletteId]
  )

  const paletteName = useAppSelector((state) => state.palettes[paletteId].name)

  return (
    <MainContent back>
      <EntityName
        name={paletteName}
        emptyNameValue={'Untitled palette'}
        onChange={(value) =>
          dispatch(
            palettesSlice.actions.setName({
              id: paletteId,
              name: value,
            })
          )
        }
        onDelete={() => {
          dispatch(palettesSlice.actions.delete({ id: paletteId }))
          history.push('/')
        }}
      />

      <LchVis {...{ paletteId, paletteCurve, palette }} />

      <Box
        styles={{
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'stretch',
          marginInlineEnd: '-2rem',
        }}
      >
        {/* Key color */}
        <Box
          as="section"
          styles={{ flex: '0 0 200px', marginInlineEnd: '2rem' }}
        >
          <Header as="h2">
            Key color
            <Info>
              The key color is the inflection point between the palette’s two
              curves: from the key color to black, and from the key color to
              white. Generally speaking, it should have the greatest
              chroma/saturation value. The palette’s path will pass through the
              key color, however the exact key color is not guaranteed to appear
              in the final palette.
            </Info>
          </Header>
          <Box styles={{ width: '200px' }}>
            <HexColorPicker
              aria-label="Key color picker"
              color={keyColorAsHex}
              onChange={setKeyColorFromHex}
            />
            <Input
              fluid
              aria-label="Key color hex value"
              value={keyColorAsHex}
              styles={{ margin: '.5rem 0' }}
              onChange={(e, { value }) => setKeyColorFromHex(value)}
            />
          </Box>
        </Box>

        {/* Curve parameters */}
        <Box
          as="section"
          styles={{ flex: '1 0 320px', marginInlineEnd: '2rem' }}
        >
          <Header as="h2">Curve parameters</Header>
          <Flex styles={{ marginInlineEnd: '-1rem' }}>
            <SliderInput
              id="darkCpLabel"
              label={
                <Text>
                  <abbr title="Chroma control point">C*CP</abbr> to black
                </Text>
              }
              value={darkCp * 100}
              onChange={(value) =>
                dispatch(
                  palettesSlice.actions.setDarkCp({
                    id: paletteId,
                    darkCp: value / 100,
                  })
                )
              }
              min={0}
              max={100}
              reverseSlider
            />
            <SliderInput
              id="lightCpLabel"
              label={
                <Text>
                  <abbr title="Chroma control point">C*CP</abbr> to white
                </Text>
              }
              value={lightCp * 100}
              onChange={(value) =>
                dispatch(
                  palettesSlice.actions.setLightCp({
                    id: paletteId,
                    lightCp: value / 100,
                  })
                )
              }
              min={0}
              max={100}
              reverseInputs
            />
          </Flex>
          <Flex styles={{ marginInlineEnd: '-1rem' }}>
            <SliderInput
              id="hueTorsionLabel"
              label="Hue torsion"
              value={toDeg(hueTorsion)}
              onChange={(value) =>
                dispatch(
                  palettesSlice.actions.setHueTorsion({
                    id: paletteId,
                    hueTorsion: toRad(value),
                  })
                )
              }
              min={-90}
              max={90}
            />
            <Box role="none" styles={{ flex: '0 0 4.84rem' }} />
          </Flex>
        </Box>

        {/* Palette preview */}
        <Box
          as="section"
          styles={{ flex: '1 0 50vh', marginInlineEnd: '2rem' }}
        >
          <Header as="h2">Swatch preview</Header>
          <SwatchPreview {...{ paletteId, paletteCurve, palette }} />
        </Box>
      </Box>
    </MainContent>
  )
}
