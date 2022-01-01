import React, { useState } from 'react'
import {
  Header,
  Text,
  Dropdown,
  Flex,
  Checkbox,
  Box,
} from '@fluentui/react-northstar'
import { MainContent, Input } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { exportSettingsSlice } from '../state/exportSettings'
import { Lab_to_hex, paletteShadesFromCurve } from '../lib/paletteShades'
import { usePaletteCurve } from '../lib/usePaletteCurve'
import { themesSlice } from '../state/themes'

function defaultShadeNameValue({}) {
  return 'doop'
}

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

  const themes = useAppSelector((state) => state.themes)
  const [exportThemes, setExportThemes] = useState<Set<string>>(
    new Set(Object.keys(themes))
  )

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
          <Box key={`h3--${themeId}`}>
            <Checkbox
              checked={exportThemes.has(themeId)}
              onChange={(e, { checked }) => {
                exportThemes[checked ? 'add' : 'delete'](themeId)
                setExportThemes(new Set(Array.from(exportThemes)))
              }}
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
            {exportThemes.has(themeId) && (
              <>
                <Header as="h4">Shade names</Header>
                <Header as="h5">Backgrounds</Header>
                {Object.keys(theme.backgrounds).map((paletteId) => {
                  const { nShades, shadeNames, range } =
                    theme.backgrounds[paletteId]
                  const [paletteCurve, _palette] = usePaletteCurve(paletteId)
                  const shades = paletteShadesFromCurve(
                    paletteCurve,
                    nShades,
                    16,
                    range
                  )
                  return (
                    <>
                      {shades.map((lab, s) => {
                        return (
                          <Flex>
                            <Box
                              styles={{
                                width: '2rem',
                                height: '2rem',
                                borderRadius: '.5rem',
                                backgroundColor: Lab_to_hex(lab),
                              }}
                            />
                            <Input
                              value={shadeNames[s] || defaultShadeNameValue({})}
                              onChange={(value) =>
                                dispatch(
                                  themesSlice.actions.setShadeName({
                                    themeId,
                                    themeKey: 'backgrounds',
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
                    </>
                  )
                })}
                <Header as="h5">Foregrounds</Header>
              </>
            )}
          </Box>
        )
      })}
    </MainContent>
  )
}
