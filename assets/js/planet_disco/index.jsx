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


class DebugRouter extends Router {
  constructor(props){
    super(props);
    console.log('initial history is: ', JSON.stringify(this.history, null,2))
    this.props.history.listen((location, action)=>{
      console.log(
        `The current URL is ${location.pathname}${location.search}${location.hash}`
      )
      console.log(`The last navigation action was ${action}`, JSON.stringify(this.history, null,2));
    });
  }
}

export default ({ match, history }) => {
  return <StoreContextProvider>
    <ThemeProvider theme={theme}>
      <Overlay />
        <DebugRouter history={history}>
          <Switch>
            <Route path="/login*" component={SpotifySimpleLogin} />
            <Route path="/cities" component={CitySimilarities} />
            <Route path="/genres" component={GenresView} />
            <Route path="/" component={PlanetView} />
          </Switch>
        </DebugRouter>
    </ThemeProvider>
  </StoreContextProvider>
}
