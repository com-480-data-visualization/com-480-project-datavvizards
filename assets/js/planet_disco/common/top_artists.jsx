import React, { Fragment, useState, useEffect } from 'react'
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Divider } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { Skeleton } from '@material-ui/lab'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { processScroll, updateQuery } from './utils'
import invariant from 'invariant'
import PersonIcon from '@material-ui/icons/Person';

import ArtistPlayer from './artist_player'

const TOP_ARTISTS = gql`query TopArtists($byType: String!, $byId: ID!, $cursor: String) {
  topArtists(byType: $byType, byId: $byId, cursor: $cursor, limit: 20) {
    entries {
      name
      spotifyId
      genres {
        name
      }
      images {
        path
      }
    }
    cursor
  }
}`

const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: "scroll",
    scrollBehavior: "smooth",
    height: "100%",
    '& li:last-child': {
      display: 'none'
    },
    marginBottom: theme.spacing(1),
  },
  formControl: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexWrap: 'wrap',
  },
  controlItem: {
    flex: '1 1 auto',
    margin: theme.spacing(1),
  },
  placeHolderAvatar: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.getContrastText(theme.palette.background.paper),
  }
}))

export default ({ city, genre }) => {
  invariant(!!city ^ !!genre, 'Either city or genre should be passed into TopArtists component')
  const classes = useStyles()

  const variables = city ? { byType: 'city', byId: city.id } : { byType: 'genre', byId: genre.genreId }
  const { loading, data, fetchMore } = useQuery(TOP_ARTISTS, { variables, fetchPolicy: "cache-and-network" })

  const [artistIdx, setArtistIdx] = useState(0)
  useEffect(() => setArtistIdx(0), [city, genre])

  const fetchNextArtist = () => {
    if (!data) {
      return
    }

    if (artistIdx < data.topArtists.entries.length - 1) {
      setArtistIdx(artistIdx + 1)
      return
    }

    if (!loading && data.topArtists.cursor)
      fetchMore({
        variables: { ...variables, cursor: data.topArtists.cursor },
        updateQuery: updateQuery('topArtists')
      })
    else
      setArtistIdx(-1)
  }

  return (
    <Fragment>
      <List
        className={classes.root}
        onScroll={processScroll(variables, 600, 'topArtists', { loading, data, fetchMore })}
      >
        {data && data.topArtists.entries.map((artist, i) => (<Fragment key={i}>
          <ListItem button selected={i == artistIdx} alignItems="flex-start" onClick={() => setArtistIdx(i)}>
            <ListItemAvatar>
              {artist.images[0] ?
                <Avatar alt={artist.name} src={artist.images[0].path} />
                :
                <Avatar className={classes.placeHolderAvatar} alt={artist.name}>
                  <PersonIcon />
                </Avatar>
              }
            </ListItemAvatar>

            <ListItemText
              primary={`#${i + 1} ${artist.name}`}
              secondary={artist.genres.map(g => g.name).join(', ')}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>))}

        {loading && new Array(20).fill(0).map((_, i) => (<Fragment key={i}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Skeleton variant="circle" animation="wave" height={40} width={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="rect" animation="wave" height={45} width={"100%"} />}
            />
          </ListItem>
          <Divider variant="inset" component="li" />
        </Fragment>))}
      </List>

      <ArtistPlayer currentArtist={(data && artistIdx > -1) ? data.topArtists.entries[artistIdx] : null} fetchNext={fetchNextArtist} />
    </Fragment>
  )
}
