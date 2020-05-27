import React from 'react'
import { Router } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { indigo } from '@material-ui/core/colors'
import { StoreContextProvider } from './common/store'
import PlanetView from './planet_view'
import GenresView from './genres_view'
import CitySimilarities from './city_similarities'
import Overlay from './common/overlay'
import SpotifySimpleLogin from './common/spotify_simple_login'

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
            <Route path="/login*" component={SpotifySimpleLogin} />
            <Route path="/cities" component={CitySimilarities} />
            <Route path="/genres" component={GenresView} />
            <Route path="/" component={PlanetView} />
          </Switch>
        </Router>
    </ThemeProvider>
  </StoreContextProvider>
}
