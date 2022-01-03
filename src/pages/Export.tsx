import React, { Fragment, useMemo, useState } from 'react'
import {
  Header,
  Text,
  Dropdown,
  Flex,
  Checkbox,
  Box,
  Button,
  DownloadIcon,
} from '@fluentui/react-northstar'

import { MainContent, Input } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { exportSettingsSlice } from '../state/exportSettings'
import {
  curvePathFromPalette,
  Lab_to_hex,
  paletteShadesFromCurve,
} from '../lib/paletteShades'
import { themesSlice } from '../state/themes'
import { defaultShadeName } from '../lib/shadeName'
import { download } from '../lib/download'
import { renderExport } from '../lib/export/render'
import { store } from '../state/store'

const sectionsContent = [
  {
    key: 'bg',
    title: 'Backgrounds',
    themeKey: 'backgrounds' as 'backgrounds',
  },
  {
    key: 'fg',
    title: 'Foregrounds',
    themeKey: 'foregrounds' as 'foregrounds',
  },
]

export const Export = ({}) => {
  const dispatch = useAppDispatch()

  const exportType = useAppSelector((state) => state.exportSettings.type)
  const exportTypes = [
    { header: 'CSS custom properties', 'data-value': 'csscp' },
    // {header: 'JSON document', 'data-value': 'json'},
  ]
  const activeExportType = exportTypes.find(
    ({ 'data-value': value }) => value === exportType
  )

  const selector = useAppSelector((state) => state.exportSettings.selector)

  const exportInclude = useAppSelector((state) => state.exportSettings.include)

  const systemName = useAppSelector((state) => state.system.name)
  const themes = useAppSelector((state) => state.themes)
  const palettes = useAppSelector((state) => state.palettes)

  const paletteCurves = useMemo(() => {
    return Object.keys(palettes).reduce((acc, paletteId) => {
      acc[paletteId] = curvePathFromPalette(palettes[paletteId])
      return acc
    }, {})
  }, [palettes])

  return (
    <MainContent back>
      <Header as="h1">Export color system</Header>
      <Text as="p">
        On this page you can export the color system as a collection of named
        tokens. Use the following options to configure the export.
      </Text>

      <Text
        as="p"
        id="type__label"
        styles={{ marginBlockStart: '.5rem', marginBlockEnd: '.5em' }}
      >
        Export type
      </Text>
      <Dropdown
        aria-labelledby="type__label"
        items={exportTypes}
        defaultValue={activeExportType}
        onChange={(e, { value }) =>
          dispatch(exportSettingsSlice.actions.setType(value['data-value']))
        }
        styles={{ marginBlockEnd: '.5rem' }}
      />

      {exportType === 'csscp' && (
        <Input
          label="Selector"
          value={selector}
          onChange={(value) =>
            dispatch(exportSettingsSlice.actions.setSelector(value))
          }
          styles={{ marginBlockStart: '.5rem', marginBlockEnd: '.5rem' }}
        />
      )}

      <Header as="h2">Themes to export</Header>
      {Object.keys(themes).map((themeId) => {
        const theme = themes[themeId]
        return (
          <Box key={themeId}>
            <Checkbox
              checked={exportInclude.hasOwnProperty(themeId)}
              onChange={(e, { checked }) =>
                dispatch(
                  exportSettingsSlice.actions[
                    checked ? 'includeTheme' : 'excludeTheme'
                  ]({ themeId, theme })
                )
              }
              label={
                <Header
                  as="h3"
                  styles={{
                    fontStyle: theme.name ? 'normal' : 'italic',
                    margin: 0,
                  }}
                >
                  {theme.name || 'Untitled theme'}
                </Header>
              }
            />
            {exportInclude.hasOwnProperty(themeId) && (
              <>
                <Header as="h4">Shade names</Header>
                {sectionsContent.map(({ title, themeKey, key }) => {
                  return (
                    <Fragment key={themeKey}>
                      <Header as="h5">{title}</Header>
                      {Object.keys(theme[themeKey]).map((paletteId) => {
                        const { nShades, shadeNames, range } =
                          theme[themeKey][paletteId]
                        const palette = palettes[paletteId]
                        const shades = paletteShadesFromCurve(
                          paletteCurves[paletteId],
                          nShades,
                          16,
                          range
                        )
                        return (
                          <Fragment key={paletteId}>
                            <Header as="h6">{palette.name}</Header>
                            {shades.map((lab, s) => {
                              const shadeIncluded =
                                exportInclude[themeId][themeKey][
                                  paletteId
                                ].includes(s)
                              return (
                                <Flex
                                  key={lab.join('.')}
                                  styles={{
                                    alignItems: 'center',
                                    marginBlockEnd: '.5rem',
                                  }}
                                >
                                  <Checkbox
                                    checked={shadeIncluded}
                                    onChange={(e, { checked }) => {
                                      dispatch(
                                        exportSettingsSlice.actions[
                                          checked
                                            ? 'includeShade'
                                            : 'excludeShade'
                                        ]({
                                          themeId,
                                          themeKey,
                                          paletteId,
                                          shade: s,
                                        })
                                      )
                                    }}
                                  />
                                  <Box
                                    styles={{
                                      width: '2rem',
                                      height: '2rem',
                                      borderRadius: '.2rem',
                                      backgroundColor: Lab_to_hex(lab),
                                      marginInlineEnd: '.5rem',
                                    }}
                                  />
                                  {exportType === 'csscp' && (
                                    <Text
                                      styles={{
                                        flex: '0 0 auto',
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      --
                                    </Text>
                                  )}
                                  <Input
                                    fluid
                                    disabled={!shadeIncluded}
                                    value={
                                      shadeNames[s] ||
                                      defaultShadeName({
                                        themeName: theme.name,
                                        themeKey: key,
                                        paletteName: palette.name,
                                        systemName,
                                        shade: s,
                                      })
                                    }
                                    onChange={(value) =>
                                      dispatch(
                                        themesSlice.actions.setShadeName({
                                          themeId,
                                          themeKey,
                                          paletteId,
                                          shade: s,
                                          value,
                                        })
                                      )
                                    }
                                  />
                                </Flex>
                              )
                            })}
                          </Fragment>
                        )
                      })}
                    </Fragment>
                  )
                })}
              </>
            )}
          </Box>
        )
      })}
      <Button
        icon={<DownloadIcon outline />}
        content="Download exported color system"
        onClick={() =>
          download(
            `${systemName}.${
              exportType === 'csscp'
                ? 'css'
                : exportType === 'json'
                ? 'json'
                : 'txt'
            }`,
            renderExport(store.getState())
          )
        }
        styles={{ margin: '2rem 0' }}
      />
    </MainContent>
  )
}
