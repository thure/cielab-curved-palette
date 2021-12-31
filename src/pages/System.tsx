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
import {
  EntityName,
  MainContent,
  PaletteListItem,
  ThemeListItem,
  InFlowDocs,
  Link,
} from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { palettesSlice } from '../state/palettes'
import { themesSlice } from '../state/themes'
import { systemSlice } from '../state/system'
import { paletteTemplate, themeTemplate } from '../lib/interfaces'
import { batch } from 'react-redux'

export const System = () => {
  const dispatch = useAppDispatch()
  const history = useHistory()

  const systemName = useAppSelector((state) => state.system.name)

  const palettes = useAppSelector((state) => state.palettes)
  const palettesIds = Object.keys(palettes)

  const themes = useAppSelector((state) => state.themes)
  const themeIds = Object.keys(themes)

  return (
    <MainContent>
      <EntityName
        name={systemName}
        emptyNameValue={'Untitled color system'}
        onChange={(value) =>
          dispatch(
            systemSlice.actions.setName({
              name: value,
            })
          )
        }
        onDelete={() => {
          batch(() => {
            dispatch(themesSlice.actions.reset())
            dispatch(palettesSlice.actions.reset())
            dispatch(systemSlice.actions.reset())
          })
        }}
        deleteLabel="Clear all data"
      />
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
          <Link href="https://github.com/thure/cielab-curved-palette#readme">
            the repository on Github
          </Link>
          .
        </Text>
        <Text as="p">
          If you’re experiencing bugs, first record any details you want to
          keep, then click ‘Clear all data’ from the ‘…’ menu on this page, then
          start again. If after doing so you still experience a bug, we’d love
          it if you filed an{' '}
          <Link href="https://github.com/thure/cielab-curved-palette/issues">
            issue on Github
          </Link>
          .
        </Text>
      </InFlowDocs>
    </MainContent>
  )
}
