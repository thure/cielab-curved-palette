import React from 'react'
import { Box, Flex } from '@fluentui/react-northstar'

export const Palette = ({ paletteHexShades }) => {
  return (
    <Flex
      styles={{
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
        overflow: 'hidden',
      }}
    >
      {paletteHexShades.map((hex, i) => {
        return (
          <Box
            key={`shade_${i}`}
            styles={{
              flex: '1 0 0',
              background: hex,
            }}
          />
        )
      })}
    </Flex>
  )
}
