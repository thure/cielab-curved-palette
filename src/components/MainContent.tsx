import React from 'react'
import {
  Box,
  Button,
  Flex,
  RadioGroup,
  ChevronStartIcon,
} from '@fluentui/react-northstar'
import { PropsWithChildren } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../state/hooks'
import { toggleUi } from '../state/app'

type MainContentProps = {
  back?: boolean
}

export const MainContent = ({
  children,
  back,
}: PropsWithChildren<MainContentProps>) => {
  const ui = useAppSelector((state) => state.app.ui)
  const dispatch = useAppDispatch()
  const history = useHistory()
  return (
    <Box
      as="main"
      styles={{
        maxWidth: '60rem',
        padding: '1rem',
        margin: '0 auto',
      }}
    >
      <Flex as="nav">
        {back && (
          <Button
            icon={<ChevronStartIcon />}
            iconPosition="before"
            text
            content="Back to color system"
            onClick={() => history.push('/')}
          />
        )}
        <Box styles={{ flexGrow: 1 }} role="none" />
        <RadioGroup
          items={[
            {
              key: 'l',
              value: 'light',
              label: '☀️',
            },
            {
              key: 'd',
              value: 'dark',
              label: '🌙',
            },
          ]}
          defaultCheckedValue={ui}
          onCheckedValueChange={(_e, p) => dispatch(toggleUi())}
        />
      </Flex>
      {children}
    </Box>
  )
}
