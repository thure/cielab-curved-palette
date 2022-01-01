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
          <Label
            styles={{
              fontWeight: 900,
              padding: '.3rem .6rem',
              height: 'auto',
              marginInlineEnd: '.5em',
            }}
          >
            🌈 <abbr title="LAB curved color system tool">LCCST</abbr>
          </Label>
        )}
        <Box styles={{ flexGrow: 1 }} role="none" />
        <Button
          flat
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
          title="The source code for this project on Github"
          iconOnly
          styles={{ marginInlineEnd: '.5em' }}
        />
        <Button
          flat
          as="div"
          tabIndex={-1}
          styles={{
            pointerEvents: 'none',
            paddingInlineEnd: 0,
            paddingInlineStart: '.25rem',
            flex: '0 0 auto',
          }}
        >
          <RadioGroup
            items={[
              {
                key: 'l',
                value: 'light',
                label: (
                  <svg
                    style={{ position: 'relative', top: '2px', left: '-3px' }}
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ),
              },
              {
                key: 'd',
                value: 'dark',
                label: (
                  <svg
                    style={{ position: 'relative', top: '2px', left: '-3px' }}
                    viewBox="0 0 24 24"
                    width="17"
                    height="17"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ),
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
