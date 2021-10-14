import React from 'react'
import { Box } from '@fluentui/react-northstar'
import { useHistory } from 'react-router-dom'
import { Palette } from '../types'

export const PaletteListItem = ({
  id,
  ...palette
}: Palette & { id: string }) => {
  const history = useHistory()
  return (
    <Box
      styles={{
        borderRadius: '.5rem',
        borderWidth: '1px',
        borderStyle: 'solid',
        padding: '1rem',
        margin: '1rem 0',
        cursor: 'pointer',
      }}
      variables={({ colorScheme }) => ({
        borderColor: colorScheme.default.foreground2,
        elevation: '0px 0.2rem 0.4rem -0.075rem rgba(0, 0, 0, 0.25)',
      })}
      onClick={() => history.push(`/palette/${id}`)}
    >
      …
    </Box>
  )
}
