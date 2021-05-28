import React from 'react'
import { Box } from '@fluentui/react-northstar'

export const Palette = ({ curvePoints }) => {
  return (
    <Box
      variables={({ colorScheme }) => ({
        backgroundColor: colorScheme.default.background,
      })}
      styles={{
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
        overflow: 'auto',
        pointerEvents: 'initial',
      }}
    >
      (Palette)
    </Box>
  )
}
