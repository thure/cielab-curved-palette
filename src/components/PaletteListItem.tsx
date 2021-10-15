import React from 'react'
import { Box } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'
import { Palette } from '../lib/interfaces'
import {
  cssGradientFromCurve,
  curvePathFromPalette,
} from '../lib/paletteShades'

export const PaletteListItem = ({
  id,
  ...palette
}: Palette & { id: string }) => {
  const history = useHistory()
  return (
    <Box
      styles={{
        borderRadius: '.5rem',
        padding: '1rem',
        margin: '1rem 0',
        cursor: 'pointer',
        backgroundImage: cssGradientFromCurve(curvePathFromPalette(palette)),
        minHeight: '2rem',
      }}
      onClick={() => history.push(`/palette/${id}`)}
    />
  )
}
