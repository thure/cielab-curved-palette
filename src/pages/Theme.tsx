import React, { useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import {
  Header,
  Button,
  Flex,
  MenuButton,
  AddIcon,
  TrashCanIcon,
  MoreIcon,
  EditIcon,
} from '@fluentui/react-northstar'

import { scoped } from '../lib/basePath'
import { EntityName, MainContent, PaletteListItem } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { themesSlice } from '../state/themes'
import { PaletteRange } from '../components/PaletteRange'
import { PreviewMatrix } from '../components/PreviewMatrix'
import {
  curvePathFromPalette,
  paletteShadesFromCurve,
} from '../lib/paletteShades'
import { Lab_to_XYZ } from '../lib/csswg/conversions'

export const Theme = () => {
  const { themeId } = useParams()
  const history = useHistory()
  const dispatch = useAppDispatch()

  const themeName = useAppSelector((state) => state.themes[themeId].name)
  const backgrounds = useAppSelector(
    (state) => state.themes[themeId].backgrounds
  )
  const foregrounds = useAppSelector(
    (state) => state.themes[themeId].foregrounds
  )
  const palettes = useAppSelector((state) => state.palettes)

  const addBackgroundOptions = Object.keys(palettes).filter(
    (paletteId) => !(paletteId in backgrounds)
  )
  const addForegroundOptions = Object.keys(palettes).filter(
    (paletteId) => !(paletteId in foregrounds)
  )

  const BgLExtrema: [number, number] | null = useMemo(() => {
    return Object.keys(backgrounds).reduce(
      ([darkestPoint, lightestPoint], paletteId) => {
        const [darkShade, lightShade] = paletteShadesFromCurve(
          curvePathFromPalette(palettes[paletteId]),
          2,
          8,
          backgrounds[paletteId].range
        )
        return [
          Math.min(Lab_to_XYZ(darkShade)[1], darkestPoint),
          Math.max(Lab_to_XYZ(lightShade)[1], lightestPoint),
        ]
      },
      [Infinity, -Infinity]
    )
  }, [backgrounds, palettes])

  const sectionsContent = [
    {
      key: 'bg',
      title: 'Backgrounds',
      name: 'background',
      themeKey: 'backgrounds',
      actionSuffix: 'Background',
      activePalettes: backgrounds,
      options: addBackgroundOptions,
    },
    {
      key: 'fg',
      title: 'Foregrounds',
      name: 'foreground',
      themeKey: 'foregrounds',
      actionSuffix: 'Foreground',
      activePalettes: foregrounds,
      options: addForegroundOptions,
    },
  ]

  return (
    <MainContent back>
      <EntityName
        name={themeName}
        emptyNameValue={'Untitled theme'}
        onChange={(value) =>
          dispatch(
            themesSlice.actions.setName({
              id: themeId,
              name: value,
            })
          )
        }
        onDelete={() => {
          dispatch(themesSlice.actions.delete({ id: themeId }))
          history.push(scoped('/'))
        }}
      />
      {sectionsContent.map(
        ({
          key,
          title,
          name,
          themeKey,
          actionSuffix,
          activePalettes,
          options,
        }) => {
          return (
            <React.Fragment key={key}>
              <Header as="h2">{title}</Header>
              {Object.keys(activePalettes).map((paletteId) => {
                return (
                  <Flex
                    key={paletteId}
                    vAlign="center"
                    styles={{
                      marginInlineEnd: '-0.5rem',
                      marginBlockEnd: '1rem',
                    }}
                  >
                    <PaletteRange
                      {...{ paletteId, themeId, themeKey }}
                      {...(key === 'fg' && { bgLs: BgLExtrema })}
                    />
                    <MenuButton
                      trigger={
                        <Button
                          text
                          iconOnly
                          icon={<MoreIcon outline />}
                          styles={{ margin: '0 0.5rem' }}
                        />
                      }
                      menu={[
                        {
                          key: 'e',
                          content: 'Edit',
                          icon: <EditIcon outline />,
                          onClick: () =>
                            history.push(scoped(`/palette/${paletteId}`)),
                        },
                        {
                          key: 'r',
                          content: 'Remove',
                          icon: <TrashCanIcon outline />,
                          onClick: () =>
                            dispatch(
                              themesSlice.actions[`remove${actionSuffix}`]({
                                id: themeId,
                                paletteId,
                              })
                            ),
                        },
                      ]}
                    />
                  </Flex>
                )
              })}
              <MenuButton
                trigger={
                  <Button
                    disabled={options.length < 1}
                    icon={<AddIcon outline />}
                    content={`Add ${name} palette…`}
                  />
                }
                menu={options.map((paletteId) => ({
                  key: paletteId,
                  content: (
                    <PaletteListItem
                      variant="menuItem"
                      id={paletteId}
                      {...palettes[paletteId]}
                    />
                  ),
                  onClick: () =>
                    dispatch(
                      themesSlice.actions[`add${actionSuffix}`]({
                        id: themeId,
                        paletteId,
                      })
                    ),
                }))}
              />
            </React.Fragment>
          )
        }
      )}
      {!!Object.keys(foregrounds).length && !!Object.keys(backgrounds).length && (
        <>
          <Header as="h2">Preview matrix</Header>
          <PreviewMatrix themeId={themeId} />
        </>
      )}
    </MainContent>
  )
}
