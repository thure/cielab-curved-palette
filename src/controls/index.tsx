import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Box,
  Form,
  FormSlider,
  Provider,
  Header,
  teamsDarkTheme,
} from '@fluentui/react-northstar'

const Controls = ({ sceneControls: { initialState, updateCurve } }) => {
  const [keyColorL, setKeyColorL] = useState(initialState.keyColorLCH[0])
  const [keyColorC, setKeyColorC] = useState(initialState.keyColorLCH[1])
  const [keyColorH, setKeyColorH] = useState(initialState.keyColorLCH[2])

  const [darkControl, setDarkControl] = useState(initialState.darkControl)
  const [lightControl, setLightControl] = useState(initialState.lightControl)

  return (
    <>
      <Form styles={{ display: 'block', padding: '1rem', margin: 0 }}>
        <Header as="h1" styles={{ fontWeight: 300, marginTop: 0 }}>
          LCH curved palette
        </Header>
        <Header as="h2">Key color</Header>
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
              updateCurve(
                keyColorL,
                keyColorC,
                numericValue,
                darkControl,
                lightControl
              )
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
              updateCurve(
                keyColorL,
                numericValue,
                keyColorH,
                darkControl,
                lightControl
              )
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
              updateCurve(
                numericValue,
                keyColorC,
                keyColorH,
                darkControl,
                lightControl
              )
            }
          }}
        />
        <Header as="h2">Curve parameters</Header>
        <FormSlider
          fluid
          label="Chroma retention towards black"
          min={0}
          max={1}
          step={0.01}
          value={darkControl}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setDarkControl(numericValue)
              updateCurve(
                keyColorL,
                keyColorC,
                keyColorH,
                numericValue,
                lightControl
              )
            }
          }}
        />
        <FormSlider
          fluid
          label="Chroma retention towards white"
          min={0}
          max={1}
          step={0.01}
          value={lightControl}
          onChange={(_e, { value }) => {
            const numericValue = parseFloat(value)
            if (Number.isFinite(numericValue)) {
              setLightControl(numericValue)
              updateCurve(
                keyColorL,
                keyColorC,
                keyColorH,
                darkControl,
                numericValue
              )
            }
          }}
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
