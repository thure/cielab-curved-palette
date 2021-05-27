import React from 'react'
import ReactDOM from 'react-dom'
import { Box, Provider, teamsDarkTheme } from '@fluentui/react-northstar'

export function mount(sceneControls) {
  ReactDOM.render(
    <Provider
      theme={teamsDarkTheme}
      styles={{
        width: '100%',
        height: '100%',
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
      }}
    >
      <Box
        styles={{
          background: 'white',
          borderRadius: '.5rem',
        }}
      />
    </Provider>,
    document.getElementById('controls')
  )
}
