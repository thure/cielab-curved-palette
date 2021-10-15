import React, { PropsWithChildren } from 'react'
import { InfoIcon, Tooltip } from '@fluentui/react-northstar'

export const Info = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Tooltip
      trigger={<InfoIcon outline styles={{ margin: '0 .5em' }} />}
      content={children}
    />
  )
}
