import React, { PropsWithChildren } from 'react'
import { Text } from '@fluentui/react-northstar'

export const Link = ({
  href,
  children,
}: PropsWithChildren<{ href: string }>) => {
  return (
    <Text
      as="a"
      href={href}
      variables={({ colorScheme }) => ({
        color: colorScheme.brand.foreground,
      })}
    >
      {children}
    </Text>
  )
}
