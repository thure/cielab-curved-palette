import React, { PropsWithChildren } from 'react'
import { Box, EnterKey, SpacebarKey } from '@fluentui/react-northstar'
import { CurvePath, Vector3 } from 'three'

import { cssGradientFromCurve } from '../lib/paletteShades'

interface PalettePreviewProps {
  curve: CurvePath<Vector3>
  onClick?: () => void
  variant?: 'broad' | 'narrow'
}

export const PalettePreview = ({
  curve,
  onClick,
  children,
  variant,
}: PropsWithChildren<PalettePreviewProps>) => {
  return (
    <Box
      styles={{
        margin: variant === 'narrow' ? '0' : '1rem 0',
        borderRadius: children ? '.4rem' : '.2rem',
        minHeight: (() => {
          switch (variant) {
            case 'narrow':
              return '1.2rem'
            case 'broad':
            default:
              return '3rem'
          }
        })(),
        flex: '1 0 auto',
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
