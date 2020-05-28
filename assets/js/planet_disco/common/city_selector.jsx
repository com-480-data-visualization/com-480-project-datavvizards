import React, { useState, useEffect, useContext } from 'react'
import { TextField, CircularProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Autocomplete } from '@material-ui/lab'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { StoreContext } from './store'

const CITIES = gql`query CitiesAutocomplete($term: String) {
  cities(q: $term, limit: 10) {
    entries {
      id
      city
      humanCountry
      coord
    }
  }
}`

const useStyles = makeStyles((theme) => ({
  header: {
    marginBottom: theme.spacing(2)
  },
}))

export default () => {
  const classes = useStyles()
  const [options, setOptions] = useState([])
  const { dispatch } = useContext(StoreContext)
  const { loading, data, refetch } = useQuery(CITIES)

  useEffect(() => {
    data && setOptions(data.cities.entries)
  }, [data])

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  return <Autocomplete
    filterOptions={(_, input) => {
      refetch({term: input.inputValue})
      return options
    }}
    autoComplete={false}
    getOptionSelected={(option, value) => option.id === value.id}
    getOptionLabel={(option) => `${option.city}, ${option.humanCountry}`}
    onChange={(_, city) => dispatch({type: 'SET_CITY', city})}
    options={options}
    loading={loading}
    className={classes.header}
    ListboxProps={{className: classes.search}}
    renderInput={(params) => (
      <TextField
        {...params}
        label="Pick a city to learn more..."
        InputProps={{
          ...params.InputProps,
          endAdornment: (
            <>
              {loading && <CircularProgress color="inherit" size={20} />}
              {params.InputProps.endAdornment}
            </>
          ),
        }}
      />
    )}
  />
}