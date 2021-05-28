import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  Checkbox,
  Form,
  FormSlider,
  Provider,
  Header,
  teamsDarkTheme,
} from '@fluentui/react-northstar'

let onCurveUpdate

export function curveUpdateHandler(points) {
  if (onCurveUpdate) onCurveUpdate(points)
}

const Controls = ({
  sceneControls: { initialState, updateCurve, updateGamut, updateGamutOutline },
}) => {
  // Color controls

  const [keyColorL, setKeyColorL] = useState(initialState.keyColorLCH[0])
  const [keyColorC, setKeyColorC] = useState(initialState.keyColorLCH[1])
  const [keyColorH, setKeyColorH] = useState(initialState.keyColorLCH[2])

  const [darkControl, setDarkControl] = useState(initialState.darkControl)
  const [lightControl, setLightControl] = useState(initialState.lightControl)
  const [hueTorsion, setHueTorsion] = useState(initialState.hueTorsion)

  // Other controls

  const [gamutOpacity, setGamutOpacity] = useState(initialState.gamutOpacity)
  const [gamutOutlineEnabled, setGamutOutlineEnabled] = useState(
    initialState.gamutOutlineEnabled
  )

  onCurveUpdate = (points) => console.log('on curve update', points)

  useEffect(
    () =>
      updateCurve({
        l: keyColorL,
        c: keyColorC,
        h: keyColorH,
        darkControl,
        lightControl,
        hueTorsion,
      }),
    [keyColorL, keyColorC, keyColorH, darkControl, lightControl, hueTorsion]
  )

  return (
    <>
      <Form styles={{ display: 'block', padding: '1rem', margin: 0 }}>
        <Header as="h1" styles={{ fontWeight: 200, marginTop: 0 }}>
          LCH curved palette
        </Header>
        <Header as="h2" styles={{ fontWeight: 300 }}>
          Midpoint key color
        </Header>
        <FormSlider
          fluid
          label="Hue"
          min={0}
          max={360}
          step={0.01}
          value={keyColorH}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setKeyColorH(numericValue)
            }
          }}
        />
        <FormSlider
          fluid
          label="Chroma"
          min={0}
          max={132}
          step={0.01}
          value={keyColorC}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setKeyColorC(numericValue)
            }
          }}
        />
        <FormSlider
          fluid
          label="Lightness"
          min={0}
          max={100}
          step={0.01}
          value={keyColorL}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setKeyColorL(numericValue)
            }
          }}
        />
        <Header as="h2" styles={{ fontWeight: 300 }}>
          Curve parameters
        </Header>
        <FormSlider
          fluid
          label="Hue torsion"
          min={Math.PI / -4}
          max={Math.PI / 4}
          step={0.001}
          value={hueTorsion}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setHueTorsion(numericValue)
            }
          }}
        />
        <FormSlider
          fluid
          label="Chroma curvature towards black"
          min={0}
          max={1}
          step={0.01}
          value={darkControl}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setDarkControl(numericValue)
            }
          }}
        />
        <FormSlider
          fluid
          label="Chroma curvature towards white"
          min={0}
          max={1}
          step={0.01}
          value={lightControl}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setLightControl(numericValue)
            }
          }}
        />
        <Header as="h2" styles={{ fontWeight: 300 }}>
          Display
        </Header>
        <FormSlider
          fluid
          label="sRGB gamut opacity"
          min={0}
          max={1}
          step={0.01}
          value={gamutOpacity}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setGamutOpacity(numericValue)
              updateGamut({ opacity: numericValue })
            }
          }}
        />
        <Checkbox
          toggle
          label="sRGB gamut outline"
          labelPosition="start"
          checked={gamutOutlineEnabled}
          onChange={(_e, { checked }) => {
            setGamutOutlineEnabled(checked)
            updateGamutOutline({ enabled: checked })
          }}
          styles={{ display: 'block' }}
        />
      </Form>
    </>
  )
}

export function mount(sceneControls) {
  ReactDOM.render(
    <Provider
      theme={teamsDarkTheme}
      styles={{
        width: '100%',
        height: '100%',
        borderRadius: '.5rem',
        boxShadow: '0 .1rem .3rem 0 rgba(0, 0, 0, 0.4)',
        overflow: 'auto',
      }}
    >
      <Controls {...{ sceneControls }} />
    </Provider>,
    document.getElementById('controls')
  )
}
