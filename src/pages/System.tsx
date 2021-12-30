import React from 'react'
import {
  Button,
  Header,
  AddIcon,
  Text,
  ChevronEndIcon,
} from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'

import { scoped } from '../lib/basePath'
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
      <Header as="h2">Palettes</Header>
      {palettesIds.map((paletteId, _p) => (
        <PaletteListItem
          key={paletteId}
          id={paletteId}
          variant="link"
          {...palettes[paletteId]}
        />
      ))}
      <Button
        icon={<AddIcon outline />}
        content="Create a new palette"
        onClick={() => {
          const nextPalette = paletteTemplate()
          dispatch(palettesSlice.actions.create(nextPalette))
          history.push(scoped(`/palette/${nextPalette.id}`))
        }}
      />
      <Header as="h2">Themes</Header>
      {themeIds.map((themeId, _t) => {
        const theme = themes[themeId]
        return (
          <ThemeListItem
            key={themeId}
            onClick={() => history.push(scoped(`/theme/${themeId}`))}
          >
            <Text styles={{ fontStyle: !theme.name ? 'italic' : 'normal' }}>
              {theme.name ? theme.name : 'Untitled theme'}
            </Text>
            <ChevronEndIcon styles={{ margin: '0 .5em' }} outline />
          </ThemeListItem>
        )
      })}
      <Button
        icon={<AddIcon outline />}
        content="Create a new theme"
        disabled={palettesIds.length < 1}
        onClick={() => {
          const nextTheme = themeTemplate()
          dispatch(themesSlice.actions.create(nextTheme))
          history.push(scoped(`/theme/${nextTheme.id}`))
        }}
      />
      <Header as="h1" styles={{ marginTop: '2em' }}>
        Using this tool
      </Header>
      <Text as="p">
        The best way to get started creating a color system with this tool is to
        first create one or more palettes, then assemble the palettes into
        themes.
      </Text>
    </MainContent>
  )
}
