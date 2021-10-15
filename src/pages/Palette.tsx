import React, { useCallback, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  Box,
  Header,
  Button,
  TrashCanIcon,
  EditIcon,
  Tooltip,
  InfoIcon,
  Input,
} from '@fluentui/react-northstar'
import { HexColorPicker } from 'react-colorful'

import { palettesSlice } from '../state/palettes'
import { MainContent } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import {
  cssGradientFromPalette,
  hex_to_sRGB,
  Lab_to_hex,
} from '../lib/paletteShades'
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
      <Header as="h1" styles={!paletteName && { fontStyle: 'italic' }}>
        {paletteName || 'Untitled palette'}
        <Button
          text
          content="Edit name"
          icon={<EditIcon outline />}
          styles={{ margin: '0 .5em' }}
        />
      </Header>
      <Box
        styles={{
          backgroundImage: cssGradientFromPalette({
            keyColor,
            darkCp,
            lightCp,
            hueTorsion,
          }),
          height: '2rem',
          borderRadius: '.5rem',
        }}
      />
      <Header as="h2">
        Key color
        <Tooltip
          trigger={<InfoIcon outline styles={{ margin: '0 .5em' }} />}
          content="The key color is the inflection point between the palette’s two
          curves: from the key color to black, and from the key color to white.
          Generally speaking, it should have the greatest chroma/saturation value.
          The palette’s path will pass through the key color, however the exact
          key color is not guaranteed to appear in the final palette."
        />
      </Header>
      <Box as="section" styles={{ width: '200px' }}>
        <HexColorPicker color={keyColorAsHex} onChange={setKeyColorFromHex} />
        <Input
          fluid
          value={keyColorAsHex}
          styles={{ margin: '.5rem 0' }}
          onChange={(e, { value }) => setKeyColorFromHex(value)}
        />
      </Box>
      <Button
        content="Delete"
        icon={<TrashCanIcon outline />}
        onClick={() => {
          dispatch(palettesSlice.actions.delete({ id: paletteId }))
          history.push('/')
        }}
      />
    </MainContent>
  )
}
