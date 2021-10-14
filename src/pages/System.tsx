import React from 'react'
import { Button, Header, AddIcon } from '@fluentui/react-northstar'
import { MainContent } from '../components'

export const System = () => {
  return (
    <MainContent>
      <Header as="h1">Color system</Header>
      <Header as="h2">Themes</Header>
      <Button icon={<AddIcon />} content="Create a new theme" />
      <Header as="h2">Palettes</Header>
      <Button icon={<AddIcon />} content="Create a new palette" />
    </MainContent>
  )
}
