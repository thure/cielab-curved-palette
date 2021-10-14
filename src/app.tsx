import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import {Provider} from "@fluentui/react-northstar";

import {Palette, System, Theme} from './pages'
import {mergeThemes, teamsDarkTheme} from "@fluentui/react-northstar";

const ugh = {
  root: ({ variables }) => ({
    color: variables.color,
    backgroundColor: variables.backgroundColor,
    borderColor: variables.borderColor,
    borderWidth: variables.borderWidth,
    boxShadow: variables.elevation,
  }),
}

const App = () => {
  return <Provider
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
    styles={{background: 'transparent'}}
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
  </Provider>
}

function mount() {
  return ReactDOM.render(
    <App/>,
    document.getElementById('root')
  );
}

mount();
