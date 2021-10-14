import React from 'react'
import {
  Box,
  Flex,
  RadioGroup,
  ChevronStartIcon,
} from '@fluentui/react-northstar'
import { PropsWithChildren } from 'react'
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
  return (
    <Box
      as="main"
      styles={{
        maxWidth: '60rem',
        padding: '0 1rem',
        margin: '0 auto',
      }}
    >
      <Flex as="nav">
        {back && (
          <span>
            <ChevronStartIcon />
            Back
          </span>
        )}
        <Box styles={{ flexGrow: 1 }} role="none" />
        <RadioGroup
          items={[
            {
              value: 'light',
              label: '☀️',
            },
            {
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
