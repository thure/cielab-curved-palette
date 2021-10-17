import React, { PropsWithChildren } from 'react'
import { EnterKey, SpacebarKey, Box } from '@fluentui/react-northstar'

export const ThemeListItem = ({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) => {
  return (
    <Box
      styles={{
        margin: '1rem 0',
        borderRadius: children ? '.4rem' : '.2rem',
        display: 'flex',
        flexFlow: 'row wrap',
        alignItems: 'center',
        padding: '1rem',
        borderWidth: '1px',
        borderStyle: 'solid',
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
      variables={({ colorScheme }) => ({
        borderColor: colorScheme.default.border1,
      })}
    >
      {children}
    </Box>
  )
}
