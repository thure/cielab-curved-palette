import React, { useCallback } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  Box,
  Flex,
  Header,
  Button,
  TrashCanIcon,
  EditIcon,
  Dialog,
  Input,
  MenuButton,
  MoreIcon,
  Text,
} from '@fluentui/react-northstar'
import { HexColorPicker } from 'react-colorful'

import { palettesSlice } from '../state/palettes'
import {
  MainContent,
  Info,
  SliderInput,
  LchVis,
  EntityName,
} from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { hex_to_sRGB, Lab_to_hex } from '../lib/paletteShades'
import { LCH_to_Lab } from '../lib/csswg/conversions'
import { sRGB_to_LCH } from '../lib/csswg/utilities'

export const Palette = () => {
  const { paletteId } = useParams()
  const dispatch = useAppDispatch()
  const palettes = useAppSelector((state) => state.palettes)
  const history = useHistory()

  if (!(paletteId in palettes)) {
    history.push('/')
    return null
  }

  const keyColor = useAppSelector((state) => state.palettes[paletteId].keyColor)
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

  const darkCp = useAppSelector((state) => state.palettes[paletteId].darkCp)
  const lightCp = useAppSelector((state) => state.palettes[paletteId].lightCp)
  const hueTorsion = useAppSelector(
    (state) => state.palettes[paletteId].hueTorsion
  )

  return (
    <MainContent back>
      {/* Title and overflow menu */}
      <Flex vAlign="center" as="section">
        <EntityName
          name={paletteName}
          onChange={(value) =>
            dispatch(
              palettesSlice.actions.setName({
                id: paletteId,
                name: value,
              })
            )
          }
          emptyNameValue={'Untitled palette'}
        />
        <MenuButton
          menu={[
            {
              key: 'd',
              content: 'Delete',
              icon: <TrashCanIcon outline />,
              onClick: () => {
                dispatch(palettesSlice.actions.delete({ id: paletteId }))
                history.push('/')
              },
            },
          ]}
          trigger={
            <Button
              text
              iconOnly
              icon={<MoreIcon outline />}
              aria-label="Menu"
            />
          }
        />
      </Flex>

      <LchVis paletteId={paletteId} />

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
              value={darkCp}
              onChange={(darkCp) =>
                dispatch(
                  palettesSlice.actions.setDarkCp({ id: paletteId, darkCp })
                )
              }
              min={0}
              max={1}
              reverseSlider
            />
            <SliderInput
              id="lightCpLabel"
              label={
                <Text>
                  <abbr title="Chroma control point">C*CP</abbr> to white
                </Text>
              }
              value={lightCp}
              onChange={(lightCp) =>
                dispatch(
                  palettesSlice.actions.setLightCp({ id: paletteId, lightCp })
                )
              }
              min={0}
              max={1}
              reverseInputs
            />
          </Flex>
          <Flex styles={{ marginInlineEnd: '-1rem' }}>
            <SliderInput
              id="hueTorsionLabel"
              label="Hue torsion"
              value={hueTorsion}
              onChange={(hueTorsion) =>
                dispatch(
                  palettesSlice.actions.setHueTorsion({
                    id: paletteId,
                    hueTorsion,
                  })
                )
              }
              min={Math.PI / -2}
              max={Math.PI / 2}
            />
            <Box role="none" styles={{ flex: '0 0 3.84rem' }} />
          </Flex>
        </Box>
      </Box>
    </MainContent>
  )
}
