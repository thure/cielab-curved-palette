import {
  Button,
  Dialog,
  EditIcon,
  Header,
  Input,
} from '@fluentui/react-northstar'
import React from 'react'

export const EntityName = ({ name, emptyNameValue, onChange }) => {
  return (
    <Header
      as="h1"
      styles={{ flexGrow: 1, ...(!name && { fontStyle: 'italic' }) }}
    >
      {name || emptyNameValue}
      <Dialog
        header="Palette name"
        content={
          <>
            <Input
              fluid
              placeholder="Enter a name here"
              value={name}
              onChange={(_e, { value }) => onChange(value)}
            />
          </>
        }
        confirmButton="Okay"
        trigger={
          <Button
            text
            content="Edit name"
            icon={<EditIcon outline />}
            styles={{ margin: '0 .5em' }}
          />
        }
      />
    </Header>
  )
}
