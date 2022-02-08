import React, { useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Box, Flex, Header, Text } from '@fluentui/react-northstar'
import { HexColorPicker } from 'react-colorful'

import { scoped } from '../lib/basePath'
import { Input } from '../components/Input'
import { palettesSlice } from '../state/palettes'
import {
  MainContent,
  Info,
  SliderInput,
  LchVis,
  EntityName,
  SwatchPreview,
  InFlowDocs,
  Link,
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
    history.push(scoped('/'))
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
          history.push(scoped('/'))
        }}
      />

      <Box styles={{ overflowX: 'hidden' }}>
        <Box
          styles={{
            display: 'flex',
            flexFlow: 'row wrap',
            alignItems: 'stretch',
            width: 'calc(100% + 2rem)',
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
                chroma/saturation value. The palette’s path will pass through
                the key color, however the exact key color is not guaranteed to
                appear in the final palette.
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
                onChange={setKeyColorFromHex}
                key={keyColorAsHex}
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
                min={-360}
                max={360}
              />
              <Box role="none" styles={{ flex: '0 0 4.84rem' }} />
            </Flex>
          </Box>
        </Box>
      </Box>

      <Header as="h2">
        Curve in LAB space
        <Info>
          This is a 3D approximation of this palette’s curve in LAB space and a
          gradient of the curve’s colors. The sRGB gamut is shown as a 50L
          (medium gray) border around the curve. You can drag on the view to see
          the curve &amp; gamut from different angles.
        </Info>
      </Header>
      <LchVis {...{ paletteId, paletteCurve, palette }} />

      <Header as="h2">Swatch preview</Header>
      <SwatchPreview {...{ paletteId, paletteCurve, palette }} />

      <InFlowDocs>
        <Header as="h1">Creating &amp; editing palettes</Header>
        <Text as="p">
          In this tool, a palette is represented as a continuous curve through{' '}
          <Link href="https://en.wikipedia.org/wiki/CIELAB_color_space">
            LAB space
          </Link>
          . The curve is made of two quadratic{' '}
          <Link href="https://en.wikipedia.org/wiki/B%C3%A9zier_curve#Cubic_B%C3%A9zier_curves">
            bézier curves
          </Link>{' '}
          that start at 0L (black) and 100L (white) and meet at the LAB value of
          the key color you provide.
        </Text>
        <Header as="h2">Controls</Header>
        <Text as="p">
          You can configure the position of each bézier curve’s control point in
          LAB space with the C*CP sliders. Higher values move the control point
          toward the ends of the gamut causing chroma/saturation to diminish
          more slowly near the key color, and lower values move the control
          point toward the key color causing chroma/saturation to diminish more
          linearly.
        </Text>
        <Text as="p">
          The ‘hue torsion’ parameter enables the palette to move through
          different hues by rotating the curve’s points in LAB space, creating a
          helical curve.
        </Text>
        <Header as="h2">Take note</Header>
        <Text as="p">
          As the curve’s displayable shades are calculated, any points that
          would lay outside the sRGB gamut (shown as an outline around the curve
          in the 3D visualization) snap to to the most saturated point with the
          same hue and lightness that is within the sRGB gamut.
        </Text>
        <Text as="p">
          This page is oriented around adjusting the <em>entire</em> curve of
          the palette between black and white; in the Themes page you’ll choose
          how segments from a palette are used to create specific background and
          foreground shades.
        </Text>
      </InFlowDocs>
    </MainContent>
  )
}
