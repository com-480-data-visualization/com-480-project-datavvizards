import React, { useEffect, useRef, useContext, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import Map from './geo_map'
import * as d3 from 'd3'
import { TextUtils } from './text_layout';
import { PointsLayout } from './point_layout';
import { CitySelector } from './city_selection';
import EmbeddingsCanvas from './embeddings_canvas'
import { useApolloClient } from '@apollo/react-hooks'
import { RETRIEVE_CITY_BY_ID } from './helpers'

import { FragmentWormhole } from '../common/wormhole'
import { StoreContext } from '../common/store'
import Description from './description'

const zoomExtent = [0.7, 32];
const labelExtent = [1, 10];

const initialScale = 0.7;

const geoColorScale = d3.scaleSequential().domain([0, 1])
  .interpolator(d3.interpolateSpectral);


const useStyles = makeStyles(theme => ({
  root: {
    letterSpacing: "initial",
    width: "100%",
    height: "100%"
  },
  fixedHeight: {
    height: '50vh',
  },
  cities: {
    height: '80vh',
  },
  panelContainer: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: "space-between",
    height: "100%",
  },
  panelDescription: {
    flex: "2 1 20%",
    marginBottom: 20,
  },
  panelMap: {
    flex: "1 1 20%"
  }
}));


//Data needs to be ready
export default ({ data }) => {
  const { state: { city, wormholes: { panel, sidebar } }, dispatch } = useContext(StoreContext)

  const onCitySelect = (c) => dispatch({ type: 'SET_CITY', city: c })

  const graphql = useApolloClient()

  const canvasDomRef = useRef(null);
  const divRef = useRef(null);
  const classes = useStyles();
  const citySelector = useMemo(() => new CitySelector(data), [data]);

  const currentK = useRef(initialScale);
  const inTransition = useRef(false);
  const dims = useRef([0, 0]);

  const emCanvasRef = useRef(null);
  let canvas = emCanvasRef.current;

  const textLayoutRef = useRef(null);
  let textLayout = textLayoutRef.current;

  const pointsLayoutRef = useRef(null);
  let pointsLayout = pointsLayoutRef.current;

  const zoom = d3.zoom()
    .scaleExtent(zoomExtent)
    .on("start", () => inTransition.current = true)
    .on("zoom", () => zoomCanvas(d3.event.transform))
    .on("end", () => inTransition.current = false)

  const zoomCanvas = (transform) => {
    currentK.current = transform.k;
    window.requestAnimationFrame(() => {
      canvas.clear();

      //Calculate which dots are in the viewport
      const padding = 10;
      let [width, height] = dims.current;
      let visible = data.filter((d) => {
        let newX = d.cx * transform.k + transform.x;
        let newY = d.cy * transform.k + transform.y;
        d.dotVisible = (newX > -padding && newX < width + padding) && (newY > -padding && newY < height + padding)
        return d.dotVisible
      })

      textLayout.withTransform(transform).calculateTextLayout(visible);

      canvas.doAtScale(transform, () => {
        pointsLayout.atScale(currentK.current).drawPoints(visible);
        textLayout.drawLabels();
      })
    });
  }

  const redraw = () => {
    if (!inTransition.current)
      zoom.scaleTo(canvas.d3, currentK.current);
  }

  const prepareData = () => {
    //Rescale embedding coordinates to the canvas size
    let [width, height] = dims.current;
    let x = d3.scaleLinear().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);
    x.domain(d3.extent(data, (d) => +d.x));
    y.domain(d3.extent(data, (d) => +d.y));

    // Scale the range of the data
    const labelScale = d3.scaleLinear().range(labelExtent).domain(d3.extent(data, (d) => +d.rank));
    const ex = d3.extent(data, (d) => +d.population);
    const populationRadius = d3.scaleLog().domain(ex).range([2, 6]);

    data.forEach(function (d) {
      d.population = +d.population;
      d.radius = populationRadius(d.population);
      d.rank = +d.rank;
      d.x = +d.x;
      d.y = +d.y;
      d.cx = x(d.x);
      d.cy = y(d.y);
      d.geohash_norm = +d.geohash_norm;
      d.color = geoColorScale(d.geohash_norm)
      d.scale = labelScale(d.rank);
      d.dotVisible = true;
      d.highlight = false;
    });
  }

  const registerEvents = (canvasDom) => {
    window.addEventListener('resize', handleResize);

    // Listen for clicks on the main canvas
    canvasDom.addEventListener("click", (e) => {
      const id = textLayout.findUnderMouseId(e);
      let d = citySelector.findCity(id)
      if (d) {
        citySelector.setSelectedElement(d)
        graphql.query({
          query: RETRIEVE_CITY_BY_ID,
          variables: { cityId: d.id }
        })
          .then((res) =>
            onCitySelect(res.data.cities.entries[0])
          )
      }
    });

    // Listen for mouse move on the main canvas
    canvasDom.addEventListener("mousemove", (e) => {
      const id = textLayout.findUnderMouseId(e);
      let d = citySelector.findCity(id);
      citySelector.setMouseOverElement(d) && redraw();
    });
  }

  useEffect(() => {
    //Set up the canvas
    updateDimensions();
    let canvasDom = canvasDomRef.current;
    let d3Canvas = d3.select(canvasDom);
    let [width, height] = dims.current;
    canvas = new EmbeddingsCanvas(d3Canvas).setDimensions(width, height);
    emCanvasRef.current = canvas

    textLayout = new TextUtils(canvas.ctx)
    textLayoutRef.current = textLayout

    pointsLayout = new PointsLayout(canvas.ctx)
    pointsLayoutRef.current = pointsLayout

    registerEvents(canvasDom);

    canvas.d3.call(zoom);
    zoom.scaleTo(canvas.d3, initialScale);
    reset()

    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const handleResize = () => { updateDimensions(); reset() }

  useEffect(() => {
    if (city) {
      handleSearch(city.id)
    }
  }, [city])

  const handleSearch = (cityId) => {
    let [width, height] = dims.current;
    let city = citySelector.findCity(cityId)
    citySelector.setSelectedElement(city)
    if (city) {
      //Zoom in on a new city
      canvas.d3.transition().duration(1000).call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(Math.max(10, currentK.current))
          .translate(-city.cx, -city.cy)
      );
    }else{
      redraw()
    }
  }

  const updateDimensions = () => {
    let height = divRef.current.parentElement.clientHeight;
    let width = divRef.current.parentElement.clientWidth;
    dims.current = [width, height];
  };

  const reset = () => {
    let [width, height] = dims.current;
    canvas.setDimensions(width, height);
    prepareData();
    redraw();
  }

  return (
    <React.Fragment>
      {panel && <FragmentWormhole to={panel}>
        <Box className={classes.panelContainer}>
          <Description className={classes.panelDescription} />
          <Map className={classes.panelMap} data={data} redraw={() => redraw()} />
        </Box>
      </FragmentWormhole>}

      <div className={classes.root} ref={divRef}>
        <canvas ref={canvasDomRef}>
        </canvas>
      </div>
    </React.Fragment >
  );
}