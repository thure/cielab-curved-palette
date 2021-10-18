import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import {
  Provider as ThemeProvider,
  mergeThemes,
  teamsDarkTheme,
  teamsTheme,
} from '@fluentui/react-northstar'
import { Provider as StoreProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { store, persistor } from './state/store'
import { Palette, System, Theme } from './pages'
import { useAppSelector } from './state/hooks'

const ugh = {
  root: ({ variables }) => ({
    color: variables.color,
    backgroundColor: variables.backgroundColor,
    borderColor: variables.borderColor,
    borderWidth: variables.borderWidth,
    boxShadow: variables.elevation,
    '--surface-color': variables.surfaceColor,
    '--foreground-color': variables.foregroundColor,
  }),
}

const appTheme = {
  componentStyles: {
    Box: ugh,
    Text: ugh,
    Slider: {
      track: () => ({
        display: 'none',
      }),
      rail: ({ variables }) => ({
        opacity: variables.railOpacity,
        backgroundColor: variables.railBackgroundColor,
      }),
      thumb: ({ variables }) => ({
        borderWidth: variables.thumbBorderWidth,
        borderStyle: variables.thumbBorderStyle,
        borderColor: variables.thumbBorderColor,
        backgroundColor: variables.thumbBackgroundColor,
      }),
    },
  },
}

const appLightTheme = mergeThemes(teamsTheme, appTheme)
const appDarkTheme = mergeThemes(teamsDarkTheme, appTheme)

const App = () => {
  const ui = useAppSelector((state) => state.app.ui)
  return (
    <ThemeProvider
      theme={ui === 'light' ? appLightTheme : appDarkTheme}
      styles={{ flexGrow: 1 }}
    >
      <Router>
        <Switch>
          <Route path="/theme/:themeId">
            <Theme />
          </Route>
          <Route path="/palette/:paletteId">
            <Palette />
          </Route>
          <Route path="/">
            <System />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  )
}

function mount() {
  return ReactDOM.render(
    <StoreProvider store={store}>
      <PersistGate persistor={persistor}>
        <App />
      </PersistGate>
    </StoreProvider>,
    document.getElementById('root')
  )
}

mount()
