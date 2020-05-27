import React, { useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { StoreContext } from '../common/store'
import { useApolloClient } from '@apollo/react-hooks'
import { RETRIEVE_CITY_BY_ID } from './helpers'

const useStyles = makeStyles((theme) => ({
    city_link: {
        color: "inherit",
        whiteSpace: "nowrap",
        overflow: "hidden",
        maxWidth: "90%",
        textDecoration: "underline",
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
}))

export default ({ cityId, children }) => {
    const { dispatch } = useContext(StoreContext)
    const graphql = useApolloClient()

    const citySelect = (e) => {
        e.preventDefault();
        graphql.query({
            query: RETRIEVE_CITY_BY_ID,
            variables: { cityId: cityId.toString() }
        }).then((res) => {
            try {
                dispatch({ type: 'SET_CITY', city: res.data.cities.entries[0] })
            } catch (err) {
                console.log(err);
            }
        })
    }

    const classes = useStyles()

    return (
        <a href='' rel="search" onClick={(e) => citySelect(e)} className={classes.city_link}>{children}</a>
    )
}