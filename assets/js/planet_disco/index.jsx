import React from 'react'
import { Router } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'
import { StoreContextProvider } from './common/store'
import PlanetView from './planet_view'
import GenresView from './genres_view'
import CitySimilarities from './city_similarities'
import Overlay from './common/overlay'
import SpotifySimpleLogin from './common/spotify_simple_login'

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#df616d',
    },
    secondary: {
      main: '#433e60',
    },
    background: {
      default: "#010219",
      paper: 'rgba(71, 80, 98, 0.8)', // 'rgba(89, 100, 117, 0.6)' //'rgba(66, 66, 66, 0.6)'
    },
  },
  typography: {
    fontSize: 15,
    fontFamily: [
      'Roboto, Helvetica Neue, sans-serif',
    ].join(','),
  },
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
