import React from 'react'
import { Grid, Hidden } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { WormholeBase } from './wormhole'
import Panel from './panel'

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    pointerEvents: "none",
    zIndex: 1000,
    height: "100%",
    width: "100%",
    margin: 0,
    display: "flex",
    justifyContent: "space-between",
  },
  children: {
    maxHeight: "100%",
    height: "100%",
  },
  sidebar: {
    height: "100%",
    maxHeight: "100%"
  }
}))

export default () => {  
  const classes = useStyles()

  return <Grid container className={classes.root} spacing={3}>
    <Grid className={classes.children} item xs={3}>
      <Panel />      
    </Grid>
    <Grid item className={classes.children} xs={3}>
      <WormholeBase name='sidebar' className={classes.sidebar} />
    </Grid>
  </Grid>
}