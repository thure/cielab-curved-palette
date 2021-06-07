import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  Grid,
  Provider,
  teamsDarkTheme,
  mergeThemes,
} from '@fluentui/react-northstar'

import { Controls } from './controls'
import { Palette } from './palette'
import { force_into_gamut } from '../lib/lch'
import { LAB_to_sRGB } from '../lib/csswg/utilities'

let onCurveUpdate

export function curveUpdateHandler(points) {
  if (onCurveUpdate) onCurveUpdate(points)
}

function getTargetLightness(linearity, t) {
  const cbrt = 6.3 * Math.cbrt(t * 1000 - 500) + 50
  const line = t * 100
  return Math.max(0, Math.min(100, cbrt + (line - cbrt) * linearity))
}

function getPaletteShades({ curvePoints, linearity, nShades }) {
  if (curvePoints.length <= 2) return []

  const paletteShades = []

  let c = 0

  for (let i = 0; i < nShades - 1; i++) {
    const l = getTargetLightness(linearity, i / (nShades - 1))

    while (l > curvePoints[c + 1][0]) {
      c++
    }

    const [l1, a1, b1] = curvePoints[c]
    const [l2, a2, b2] = curvePoints[c + 1]

    const u = (l - l1) / (l2 - l1)

    paletteShades[i] = [
      l1 + (l2 - l1) * u,
      a1 + (a2 - a1) * u,
      b1 + (b2 - b1) * u,
    ]
  }

  paletteShades[nShades - 1] = curvePoints[curvePoints.length - 1]

  return paletteShades.map(([l, a, b]) => force_into_gamut(l, a, b))
}

function paletteShadesToHex(paletteShades) {
  return paletteShades.map((lab) => {
    return (
      '#' +
      LAB_to_sRGB(lab)
        .map((x) => {
          const channel = x < 0 ? 0 : Math.floor(x >= 1.0 ? 255 : x * 256)
          return channel.toString(16).padStart(2, '0')
        })
        .join('')
    )
  })
}

const ControlsGrid = ({ sceneControls }) => {
  // Curve points

  const [curvePoints, setCurvePoints] = useState([])
  onCurveUpdate = setCurvePoints

  const [paletteDistributionLinearity, setPaletteDistributionLinearity] =
    useState(sceneControls.initialState.paletteDistributionLinearity)
  const [paletteNShades, setPaletteNShades] = useState(
    sceneControls.initialState.paletteNShades
  )
  const [paletteJSON, setPaletteJSON] = useState('')
  const [paletteHexShades, setPaletteHexShades] = useState<string[]>([])

  useEffect(() => {
    const paletteShades = getPaletteShades({
      curvePoints,
      linearity: paletteDistributionLinearity,
      nShades: paletteNShades,
    })
    const nextPaletteHexShades = paletteShadesToHex(paletteShades)
    sceneControls.updateShades(paletteShades)
    setPaletteJSON(JSON.stringify(nextPaletteHexShades, null, 2))
    setPaletteHexShades(nextPaletteHexShades)
  }, [curvePoints, paletteDistributionLinearity, paletteNShades])

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
      <Controls
        {...{
          sceneControls,
          paletteDistributionLinearity,
          setPaletteDistributionLinearity,
          paletteNShades,
          setPaletteNShades,
          paletteJSON,
        }}
      />
      <Palette
        {...{
          paletteHexShades,
        }}
      />
    </Grid>
  )
}

const ugh = {
  root: ({ variables }) => ({
    color: variables.color,
    backgroundColor: variables.backgroundColor,
    borderColor: variables.borderColor,
    borderWidth: variables.borderWidth,
    boxShadow: variables.elevation,
  }),
}

export function mount(sceneControls) {
  ReactDOM.render(
    <Provider
      theme={mergeThemes(teamsDarkTheme, {
        componentStyles: {
          Box: ugh,
          Text: ugh,
          Slider: {
            track: () => ({
              display: 'none',
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
