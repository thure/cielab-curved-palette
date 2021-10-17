import React, { PropsWithChildren } from 'react'
import { Box, EnterKey, SpacebarKey } from '@fluentui/react-northstar'
import { CurvePath, Vector3 } from 'three'

import { cssGradientFromCurve } from '../lib/paletteShades'

interface PalettePreviewProps {
  curve: CurvePath<Vector3>
  onClick?: () => void
}

export const PalettePreview = ({
  curve,
  onClick,
  children,
}: PropsWithChildren<PalettePreviewProps>) => {
  return (
    <Box
      styles={{
        margin: '1rem 0',
        borderRadius: children ? '.4rem' : '.2rem',
        minHeight: '3rem',
        backgroundImage: cssGradientFromCurve(curve),
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        padding: '1rem',
        ...(onClick && { cursor: 'pointer' }),
      }}
      onClick={onClick}
      onKeyDown={({ keyCode }) => {
        switch (keyCode) {
          case EnterKey:
          case SpacebarKey:
            return onClick()
          default:
            return
        }
      }}
      {...(onClick && { tabIndex: 0 })}
    >
      {children}
    </Box>
  )
}
