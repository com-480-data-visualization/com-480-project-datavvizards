import React, { Fragment } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Paper, Box } from '@material-ui/core'
import CityLink from './city_link'

const useStyles = makeStyles((theme) => ({
    descriptionCard: {
        height: "50%",
        marginBottom: 20,
        overflow: "hidden",
    },
    descriptionContentContainer: {
        overflowY: "auto",
        top: -20,
        height: "100%",
        padding: 15,
        marginBottom: -10,
    },
    descriptionContent: {
        overflowY: "auto",
        height: "100%",
    }
}))

export default () => {
    const classes = useStyles();

    return (
        <Paper className={classes.descriptionCard}>
            <Box className={classes.descriptionContentContainer}>
                <div className={classes.descriptionContent}>
                    <Typography variant='body1'>
                        In this visualization, we attempt to quantify cultural ties between 1000 of the most populous cities of the world. Cities are situated closer together if people in those cities listen to similar music.
                    </Typography>

                    <Typography variant='body1'>
                        <br />
                        Some observations that may help you better understand the map:
                    </Typography>
                    <ul>
                        <li><Typography variant='body1'>Cities from former French colonies (e.g., <CityLink cityId={2323}>Casablanca</CityLink>) are located closer to the French cluster.</Typography></li>
                        <li><Typography variant='body1'><CityLink cityId={2897}>Tel Aviv</CityLink> is much closer than <CityLink cityId={1498}>Jerusalem</CityLink> to the cluster with European capitals suggesting that it is more cosmopolitan.</Typography></li>
                        <li><Typography variant='body1'><CityLink cityId={2923}>Scarborough, Toronto</CityLink> is situated in between the Canadian and the Indian clusters. It is a popular destination for new immigrants in Toronto and is one of its most diverse areas.</Typography></li>
                    </ul>

                    <Typography variant='body1'>
                        To provide additional context, we also assigned colors to the cities in such a way that if cities have similar colors, they should be nearby geographically.
                    </Typography>
                    <Typography variant='body1'>
                        <br/>
                        You can use the map below to explore the ties between the music space and the geographical one. Use the brush tool to select points of interest, and they will become highlighted in the music space.
                    </Typography>
                </div>
            </Box>
        </Paper>
    )
}