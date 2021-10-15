import React from 'react'
import { Button, Header, AddIcon } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'
import { MainContent, PaletteListItem } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { nanoid } from 'nanoid'
import { palettesSlice } from '../state/palettes'

export const System = () => {
  const dispatch = useAppDispatch()
  const palettes = useAppSelector((state) => state.palettes)
  const palettesIds = Object.keys(palettes)
  const history = useHistory()
  return (
    <MainContent>
      <Header as="h1">Color system</Header>
      <Header as="h2">Themes</Header>
      <Button
        icon={<AddIcon />}
        content="Create a new theme"
        disabled={palettesIds.length < 1}
      />
      <Header as="h2">Palettes</Header>
      {palettesIds.map((paletteId, _p) => (
        <PaletteListItem
          key={paletteId}
          id={paletteId}
          {...palettes[paletteId]}
        />
      ))}
      <Button
        icon={<AddIcon />}
        content="Create a new palette"
        onClick={() => {
          const id = nanoid()
          dispatch(
            palettesSlice.actions.create({
              id,
              name: '',
              keyColor: [44.51, 39.05, 288.84],
              darkCp: 2 / 3,
              lightCp: 1 / 3,
              hueTorsion: 0,
            })
          )
          history.push(`/palette/${id}`)
        }}
      />
    </MainContent>
  )
}
