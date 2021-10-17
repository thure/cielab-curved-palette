import React from 'react'
import { Button, Header, AddIcon, Text } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'

import { MainContent, PaletteListItem, ThemeListItem } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { palettesSlice } from '../state/palettes'
import { themesSlice } from '../state/themes'
import { paletteTemplate, themeTemplate } from '../lib/interfaces'

export const System = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const palettes = useAppSelector((state) => state.palettes)
  const palettesIds = Object.keys(palettes)

  const themes = useAppSelector((state) => state.themes)
  const themeIds = Object.keys(themes)

  return (
    <MainContent>
      <Header as="h1">Color system</Header>
      <Header as="h2">Themes</Header>
      {themeIds.map((themeId, _t) => {
        const theme = themes[themeId]
        return (
          <ThemeListItem
            key={themeId}
            onClick={() => history.push(`/theme/${themeId}`)}
          >
            <Text styles={!theme.name && { fontStyle: 'italic' }}>
              {theme.name ? theme.name : 'Untitled theme'}
            </Text>
          </ThemeListItem>
        )
      })}
      <Button
        icon={<AddIcon />}
        content="Create a new theme"
        disabled={palettesIds.length < 1}
        onClick={() => {
          const nextTheme = themeTemplate()
          dispatch(themesSlice.actions.create(nextTheme))
          history.push(`/theme/${nextTheme.id}`)
        }}
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
          const nextPalette = paletteTemplate()
          dispatch(palettesSlice.actions.create(nextPalette))
          history.push(`/palette/${nextPalette.id}`)
        }}
      />
    </MainContent>
  )
}
