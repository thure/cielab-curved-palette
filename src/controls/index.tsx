import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Grid,
  Provider,
  teamsDarkTheme,
  mergeThemes,
} from '@fluentui/react-northstar'

import { Controls } from './controls'
import { Palette } from './palette'

let onCurveUpdate

export function curveUpdateHandler(points) {
  if (onCurveUpdate) onCurveUpdate(points)
}

const ControlsGrid = ({ sceneControls }) => {
  // Curve points

  const [curvePoints, setCurvePoints] = useState([])
  onCurveUpdate = setCurvePoints

  return (
    <Grid
      columns="320px 1fr"
      rows="80px 1fr"
      styles={{
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        columnGap: '1rem',
        rowGap: '1rem',
      }}
    >
      <Controls {...{ sceneControls }} />
      <Palette {...{ curvePoints }} />
    </Grid>
  )
}

export function mount(sceneControls) {
  ReactDOM.render(
    <Provider
      theme={mergeThemes(teamsDarkTheme, {
        componentStyles: {
          Box: {
            root: ({ variables }) => ({
              color: variables.color,
              backgroundColor: variables.backgroundColor,
              borderColor: variables.borderColor,
              borderWidth: variables.borderWidth,
              boxShadow: variables.elevation,
            }),
          },
        },
      })}
      styles={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        pointerEvents: 'none',
        background: 'transparent',
        padding: '1rem',
      }}
    >
      <ControlsGrid {...{ sceneControls }} />
    </Provider>,
    document.getElementById('controls')
  )
}
