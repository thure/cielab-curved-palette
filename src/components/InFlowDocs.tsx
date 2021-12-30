import React, { PropsWithChildren } from 'react'
import { Box } from '@fluentui/react-northstar'

export const InFlowDocs = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box
      styles={{
        maxWidth: '30rem',
        padding: '.5rem 2rem',
        marginBlockStart: '2rem',
        marginBlockEnd: '2rem',
        borderRadius: '.5rem',
      }}
      variables={({ colorScheme }) => ({
        backgroundColor: colorScheme.default.background1,
      })}
    >
      {children}
    </Box>
  )
}
