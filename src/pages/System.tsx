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
import { InFlowDocs } from '../components/InFlowDocs'
import { Link } from '../components/Link'

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
      <InFlowDocs>
        <Header as="h1">Using this tool</Header>
        <Text as="p">
          The best way to get started creating a color system with this tool is
          to first create one or more palettes, then assemble the palettes into
          themes. Each page in this tool has additional guidance specific to its
          function.
        </Text>
        <Header as="h2">About the data you create here</Header>
        <Text as="p">
          Your work is saved locally in your browser, not on any server, so
          anything you create here is unique to this browser on this device.
          This tool doesn’t yet support importing/exporting data or migrating
          data when upgrades are released, so bear in mind any of your work can
          get lost. We’re working on making the situation better, so keep an eye
          on{' '}
          <Link href="https://github.com/thure/cielab-curved-palette">
            the repository on Github
          </Link>
          .
        </Text>
        <Text as="p">
          If you’re experiencing bugs, first record any details you want to
          keep, then clear local storage for this app (this also clears your
          palettes and themes), then start again. If after doing so you still
          experience a bug, you’re welcome to file an issue{' '}
          <Link href="https://github.com/thure/cielab-curved-palette/issues">
            on Github
          </Link>
          .
        </Text>
      </InFlowDocs>
    </MainContent>
  )
}
