import React from 'react'
import { Router } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { Canvas } from 'react-three-fiber'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { indigo } from '@material-ui/core/colors'
import { StoreContextProvider } from './common/store'
import { ContextForward } from './common/wormhole'
import PlanetView from './planet_view'
import GenresView from './genres_view'
import CitySimilarities from './city_similarities'
import Overlay from './common/overlay'

const theme = createMuiTheme({
  palette: {
    primary: indigo,
    type: 'dark',
    background: {
      paper: 'rgba(66, 66, 66, 0.9)'
    }
  }
})

export default ({ match, history }) => {
  return <StoreContextProvider>
    <ThemeProvider theme={theme}>
      <Overlay />
        <Router history={history}>
          <Switch>
            <Route path={match.url + "cities"} component={CitySimilarities} />
            <Route path={match.url + "genres"} component={GenresView} />
            <Route path={match.url} component={PlanetView} />
          </Switch>
        </Router>
    </ThemeProvider>
  </StoreContextProvider>
}
