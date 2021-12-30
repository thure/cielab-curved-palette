import React, { useMemo, useState } from 'react'
import { Box, Dropdown, Text } from '@fluentui/react-northstar'
import { useAppSelector } from '../state/hooks'
import {
  curvePathFromPalette,
  Lab_to_hex,
  paletteShadesFromCurve,
} from '../lib/paletteShades'

export const PreviewMatrix = ({ themeId }: { themeId: string }) => {
  const backgrounds = useAppSelector(
    (state) => state.themes[themeId].backgrounds
  )
  const foregrounds = useAppSelector(
    (state) => state.themes[themeId].foregrounds
  )
  const palettes = useAppSelector((state) => state.palettes)

  const [bgPaletteId, setBgPaletteId] = useState<string | null>(
    Object.keys(backgrounds || {})[0] ?? null
  )
  const [fgPaletteId, setFgPaletteId] = useState<string | null>(
    Object.keys(foregrounds || {})[0] ?? null
  )

  if (!(bgPaletteId && fgPaletteId))
    return (
      <Text>Add a foreground and background to the theme to get started.</Text>
    )

  const bgItems = Object.keys(backgrounds || {}).map((bgId) => ({
    header: palettes[bgId].name || `Untitled palette (${bgId})`,
    'data-value': bgId,
    active: bgId === bgPaletteId,
  }))

  const fgItems = Object.keys(foregrounds || {}).map((fgId) => ({
    header: palettes[fgId].name || `Untitled palette (${fgId})`,
    'data-value': fgId,
    active: fgId === fgPaletteId,
  }))

  const rects = useMemo(
    () =>
      bgPaletteId &&
      fgPaletteId &&
      (() => {
        const fgPaletteCurve = fgPaletteId
          ? curvePathFromPalette(palettes[fgPaletteId])
          : null
        const bgPaletteCurve = bgPaletteId
          ? curvePathFromPalette(palettes[bgPaletteId])
          : null
        const fgShades = paletteShadesFromCurve(
          fgPaletteCurve,
          foregrounds[fgPaletteId].nShades,
          16,
          foregrounds[fgPaletteId].range
        )
        const bgShades = paletteShadesFromCurve(
          bgPaletteCurve,
          backgrounds[bgPaletteId].nShades,
          16,
          backgrounds[bgPaletteId].range
        )
        const result = []
        for (let i = 0; i < backgrounds[bgPaletteId].nShades; i++) {
          for (let j = 0; j < foregrounds[fgPaletteId].nShades; j++) {
            const bgShade = Lab_to_hex(bgShades[i])
            const fgShade = Lab_to_hex(fgShades[j])
            result.push(
              <rect
                key={`bg${i}${j}`}
                fill={bgShade}
                height="10"
                width="10"
                x={10 * j}
                y={10 * i}
              />
            )
            result.push(
              <text
                key={`fg${i}${j}`}
                className="text"
                x={10 * j + 0.4}
                y={10 * i + 9.4}
                fill={fgShade}
              >
                Text
              </text>
            )
          }
        }
        return result
      })(),
    [bgPaletteId, fgPaletteId, backgrounds, foregrounds]
  )

  return (
    <Box>
      <Box
        styles={{
          display: 'grid',
          gap: '1rem',
          gridTemplateColumns: '1fr 1fr',
          margin: '1rem 0',
        }}
      >
        <Box>
          <Text as="label">Background palette</Text>
          <Dropdown
            fluid
            placeholder="Please select a background palette"
            defaultValue={bgItems[0]}
            onChange={(_e, { value }) =>
              setBgPaletteId(value['data-value'] || null)
            }
            items={bgItems}
          />
        </Box>
        <Box>
          <Text as="label">Foreground palette</Text>
          <Dropdown
            fluid
            placeholder="Please select a foreground palette"
            defaultValue={fgItems[0]}
            onChange={(_e, { value }) =>
              setFgPaletteId(value['data-value'] || null)
            }
            items={fgItems}
          />
        </Box>
      </Box>

      <svg
        viewBox={`0 0 ${foregrounds[fgPaletteId].nShades * 10} ${
          backgrounds[bgPaletteId].nShades * 10
        }`}
        style={{ width: '100%', height: 'auto' }}
      >
        <style>{`.text { font: normal 4px sans-serif; }`}</style>
        {rects}
      </svg>
    </Box>
  )
}
