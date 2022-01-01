import React from 'react'
import { Header, Text } from '@fluentui/react-northstar'
import { MainContent } from '../components'

export const Export = ({}) => {
  return (
    <MainContent back>
      <Header as="h1">Export color system</Header>
      <Text as="p">Use the following options to configure the export.</Text>
    </MainContent>
  )
}
