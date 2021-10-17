import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, ChevronEndIcon } from '@fluentui/react-northstar'

import { Palette } from '../lib/interfaces'
import { curvePathFromPalette } from '../lib/paletteShades'
import { PalettePreview } from './PalettePreview'

export const PaletteListItem = ({
  id,
  ...palette
}: Palette & { id: string; name?: string }) => {
  const history = useHistory()
  return (
    <PalettePreview
      curve={curvePathFromPalette(palette)}
      onClick={() => history.push(`/palette/${id}`)}
    >
      <Box
        styles={{
          display: 'inline-block',
          position: 'relative',
          zIndex: 0,
          padding: '.2rem .6rem',
          '&:after': {
            content: '""',
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.8,
            borderRadius: '.2rem',
            background: 'var(--surface-color)',
          },
          ...(!palette.name && { fontStyle: 'italic' }),
        }}
        variables={({ colorScheme }) => ({
          surfaceColor: colorScheme.default.background1,
        })}
      >
        {palette.name ? palette.name : 'Untitled palette'}
        <ChevronEndIcon styles={{ margin: '0 .5em' }} outline />
      </Box>
    </PalettePreview>
  )
}
