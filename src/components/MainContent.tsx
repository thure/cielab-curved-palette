import React from 'react'
import {
  Box,
  Button,
  Flex,
  RadioGroup,
  ChevronStartIcon,
  Label,
} from '@fluentui/react-northstar'
import { PropsWithChildren } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../state/hooks'
import { toggleUi } from '../state/app'
import { scoped } from '../lib/basePath'

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
      <Flex as="nav" vAlign="center">
        {back ? (
          <Button
            icon={<ChevronStartIcon />}
            iconPosition="before"
            text
            content="Back to color system"
            onClick={() => history.push(scoped('/'))}
          />
        ) : (
          <Label styles={{ fontWeight: 200, padding: '1em' }}>
            LAB curved color system tool
          </Label>
        )}
        <Box styles={{ flexGrow: 1 }} role="none" />
        <Button
          as="a"
          href="https://github.com/thure/cielab-curved-palette/"
          icon={
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          }
          aria-label="The source code for this project on Github"
          iconOnly
          styles={{ marginInlineEnd: '.5em' }}
        />
        <Button
          as="div"
          tabIndex={-1}
          styles={{
            pointerEvents: 'none',
            paddingInlineEnd: 0,
            paddingInlineStart: '.25rem',
          }}
        >
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
            styles={{ pointerEvents: 'all' }}
          />
        </Button>
      </Flex>
      {children}
    </Box>
  )
}
