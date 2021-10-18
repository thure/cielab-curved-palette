import React, { useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import inRange from 'lodash/inRange'
import {
  Header,
  Button,
  Flex,
  MenuButton,
  Text,
  AddIcon,
  TrashCanIcon,
  MoreIcon,
  EditIcon,
} from '@fluentui/react-northstar'

import { EntityName, Info, MainContent, PaletteListItem } from '../components'
import { useAppDispatch, useAppSelector } from '../state/hooks'
import { themesSlice } from '../state/themes'
import { PaletteRange } from '../components/PaletteRange'

const contrast = (L1: number, L2: number): number => (L1 + 0.05) / (L2 + 0.05)

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

  const contrastValue: number | null = useMemo(() => {
    const bgSpan = Object.keys(backgrounds).reduce(
      ([darkestPoint, lightestPoint], paletteId) => {
        const [darkPoint, lightPoint] = backgrounds[paletteId].range
        return [
          Math.min(darkPoint, darkestPoint),
          Math.max(lightPoint, lightestPoint),
        ]
      },
      [Infinity, -Infinity]
    )

    const fgSpan = Object.keys(foregrounds).reduce(
      ([darkestPoint, lightestPoint], paletteId) => {
        const [darkPoint, lightPoint] = foregrounds[paletteId].range
        return [
          Math.min(darkPoint, darkestPoint),
          Math.max(lightPoint, lightestPoint),
        ]
      },
      [Infinity, -Infinity]
    )

    return inRange(bgSpan[0], fgSpan[0], fgSpan[1]) ||
      inRange(bgSpan[1], fgSpan[0], fgSpan[1])
      ? null // there is overlap
      : bgSpan[0] > fgSpan[1]
      ? contrast(bgSpan[0], fgSpan[1]) // dark on light (light mode theme)
      : contrast(fgSpan[0], bgSpan[1]) // light on dark (dark mode theme)
  }, [backgrounds, foregrounds])

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
          history.push('/')
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
                    <PaletteRange {...{ paletteId, themeId, themeKey }} />
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
                          onClick: () => history.push(`/palette/${paletteId}`),
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
      <Header as="h2">
        Contrast accessibility{' '}
        <Info>
          Within a given theme, this evaluates the contrast ratio between the
          middlemost point of the ranges of foreground palettes with the
          middlemost point of the ranges of background palettes. If the ranges
          overlap between backgrounds and foregrounds, you’ll see 'None',
          otherwise this will provide the contrast ratio and the best WCAG
          success criterion (1.4.x) that the ratio meets.
        </Info>
      </Header>
      <Text
        as="p"
        styles={{
          fontSize: '4rem',
          lineHeight: 1,
          fontWeight: 200,
          marginBlockStart: 0,
        }}
      >
        {contrastValue ? `1 : ${Math.floor(contrastValue * 2) / 2}` : 'None'}
        {contrastValue >= 4.5 ? (contrastValue >= 7 ? ' AAA' : ' AA') : ''}
      </Text>
    </MainContent>
  )
}
