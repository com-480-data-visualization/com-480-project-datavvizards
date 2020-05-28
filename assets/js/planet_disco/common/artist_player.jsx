import React, { useState, useEffect, Fragment, useRef } from 'react'

import { Paper } from '@material-ui/core'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import Skeleton from '@material-ui/lab/Skeleton';

import PlayerLink from './player_link'

const TRACKS = gql`query Tracks($spotifyId: String!) {
  tracks(spotifyId: $spotifyId) {
    name
    url
  }
}`

const useStyles = makeStyles((theme) => ({
  container: {
    position: "relative",
  },
  root: {
    display: 'flex',
    width: "100%",
    justifyContent: 'space-between',
    pointerEvents: "auto",
    zIndex: 10,
  },
  details: {
    flex: '2 0 auto',
    maxWidth: "60%",
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    padding: 0,
    margin: theme.spacing(2),
    overflow: "hidden",
  },
  cover: {
    width: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 34,
    width: 34,
  },
  placeholder: {
    backgroundColor: theme.palette.background.default,
  }
}));

export default function ArtistPlayer({ currentArtist, fetchNext }) {
  const classes = useStyles();
  const graphql = useApolloClient()
  const audioPromiseRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentAudio, setAudioState] = useState(null)

  const fetchSong = (artist) => {
    const spotifyId = artist.spotifyId;
    return graphql.query({query: TRACKS, variables: { spotifyId }}).then(({ data: { tracks } }) => {
      if (tracks.length === 0) {
        new Error('no tracks for this bastard')
      }
      
      return {
        audio: new Audio(tracks[0].url),
        artistName: artist.name,
        artistId: spotifyId,
        trackName: tracks[0].name,
        trackId: spotifyId, // I don't have track id... so
        albumCover: artist.images[0] && artist.images[0].path
      }
    });
  }

  useEffect(() => {
    if (currentArtist) {
      fetchSong(currentArtist).then((result) => {
        pause();
        setAudioState(result);
      }).catch(fetchNext);
    } else {
      setPlaying(false)
    }
  }, [currentArtist])

  const controlPlayback = () => {
    if (playing) {
      let [a, promise] = play();
      if (a) {
        return () => {
          promise.then(() => a.pause()).catch((error) => error)
        }
      }
    } else {
      pause()
    }
  }

  useEffect(() => {
    if (!currentAudio) {
      fetchNext()
    }
  }, [currentAudio])

  useEffect(() => controlPlayback(), [currentArtist, playing, currentAudio]);

  const getCurrentAudio = () => {
    return currentAudio ? currentAudio.audio : null;
  }

  const play = () => {
    let a = getCurrentAudio();
    if (a) {
      a.addEventListener('ended', next);
      let promise = a.play();
      audioPromiseRef.current = promise;
      return [a, promise];
    }
    return [null, null];
  }

  const pause = () => {
    let a = getCurrentAudio();
    if (a) {
      let promise = audioPromiseRef.current;
      if (promise)
        promise.then(() => a.pause()).catch((error) => error)
    }
  }

  const next = () => {
    fetchNext();
  }

  const getPlayer = () => {
    return (
      <Card className={classes.root}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            {currentAudio ?
              <Fragment>
                <div onClick={() => setPlaying(false)}>
                  <PlayerLink href={`https://open.spotify.com/artist/${currentAudio.trackId}`} content={currentAudio.trackName} header={true} playing={playing} />
                  <PlayerLink href={`https://open.spotify.com/artist/${currentAudio.artistId}`} content={currentAudio.artistName} header={false} playing={playing} />
                </div>
              </Fragment>
              :
              <Fragment>
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"80%"} height={"35px"} />
                <Skeleton className={classes.placeholder} variant="text" animation={false} width={"60%"} height={"20px"} />
              </Fragment>
            }
          </CardContent>
          <div className={classes.controls}>
            <IconButton aria-label="play/pause" onClick={() => setPlaying(!playing)}>
              {playing ?
                <PauseCircleFilledIcon className={classes.playIcon} />
                : <PlayArrowIcon className={classes.playIcon} />}
            </IconButton>
            <IconButton aria-label="next" onClick={next}>
              <SkipNextIcon />
            </IconButton>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={currentAudio && currentAudio.albumCover ? currentAudio.albumCover : '/images/album-placeholder.png'}
          title="album cover"
        />
      </Card>
    )
  }
  return (
    <Paper className={classes.container}>
      {getPlayer()}
    </Paper>
  )
}
