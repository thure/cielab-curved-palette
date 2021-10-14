import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Header, Button, TrashCanIcon } from '@fluentui/react-northstar'
import { palettesSlice } from '../state/palettes'

import { MainContent } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'

export const Palette = () => {
  const { paletteId } = useParams()
  const dispatch = useAppDispatch()
  const palettes = useAppSelector((state) => state.palettes)
  const history = useHistory()
  if (!(paletteId in palettes)) {
    history.push('/')
    return null
  }

  const palette = palettes[paletteId]

  return (
    <MainContent back>
      <Header>Palette: {palette.name}</Header>
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
