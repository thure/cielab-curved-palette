import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {Provider as ThemeProvider, mergeThemes, teamsDarkTheme, teamsTheme} from "@fluentui/react-northstar";
import {Provider as StoreProvider} from 'react-redux'

import { store } from './state/store'
import {Palette, System, Theme} from './pages'
import {useAppSelector} from "./state/hooks";

const ugh = {
  root: ({ variables }) => ({
    color: variables.color,
    backgroundColor: variables.backgroundColor,
    borderColor: variables.borderColor,
    borderWidth: variables.borderWidth,
    boxShadow: variables.elevation,
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
    },
  },
}

const appLightTheme = mergeThemes(teamsTheme, appTheme)
const appDarkTheme = mergeThemes(teamsDarkTheme, appTheme)

const App = () => {
  const ui = useAppSelector(state => state.system.ui)
  return <ThemeProvider
    theme={ui === 'light' ? appLightTheme : appDarkTheme}
    styles={{flexGrow: 1}}
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
}

function mount() {
  return ReactDOM.render(
    <StoreProvider store={store}>
      <App/>
    </StoreProvider>,
    document.getElementById('root')
  );
}

mount();
