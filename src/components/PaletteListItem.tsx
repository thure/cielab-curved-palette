import React from 'react'
import { useHistory } from 'react-router-dom'
import { Box, ChevronEndIcon } from '@fluentui/react-northstar'

import { scoped } from '../lib/basePath'
import { Palette } from '../lib/interfaces'
import { curvePathFromPalette } from '../lib/paletteShades'
import { PalettePreview } from './PalettePreview'

export const PaletteListItem = ({
  id,
  variant,
  ...palette
}: Palette & { id: string; variant?: 'link' | 'menuItem'; name?: string }) => {
  const history = useHistory()
  return (
    <PalettePreview
      curve={curvePathFromPalette(palette)}
      {...(variant === 'link' && {
        onClick: () => history.push(scoped(`/palette/${id}`)),
      })}
      {...(variant === 'menuItem' && { variant: 'narrow' })}
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
        {variant === 'link' && (
          <ChevronEndIcon styles={{ margin: '0 .5em' }} outline />
        )}
      </Box>
    </PalettePreview>
  )
}
