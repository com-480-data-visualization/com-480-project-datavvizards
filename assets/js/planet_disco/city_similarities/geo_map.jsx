import React, { Fragment, Component, createRef } from 'react'
import * as topojson from "topojson-client";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles'
import { Card, CardMedia, CardActions, Paper, Box, Button } from '@material-ui/core'
import * as d3 from 'd3'

const styles = theme => ({
  geoMapCard: {
    height: "100%",
  },
  geoMapMedia: {
    height: "80%",
  },
  geoMapContainer: {
    height: 350,
  },
  map: {
    height: "100%",
    width: "100%",
  }
});

class Map extends Component {
  constructor(props) {
    super(props);
    this.gRef = createRef();
    this.svgRef = createRef();
    this.transform = d3.zoomIdentity;
    this.state = { brush: false };
    this.data = props.data;
  }

  componentDidMount() {
    let data = this.data;
    const projection = d3.geoMercator()
      .center([200, -20])
      .scale(100)

    const path = d3.geoPath()
      .projection(projection);

    const svg = d3.select(this.svgRef.current);
    const g = d3.select(this.gRef.current);
    const width = this.svgRef.current.parentElement.clientWidth;
    const height = this.svgRef.current.parentElement.clientHeight;

    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((topology) => {
      g.selectAll("path")
        .data(topojson.feature(topology, topology.objects.countries).features)
        .enter().append("path")
        .attr("d", path);

      g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", function (d) {
          var p = projection([+d.g_x, +d.g_y]);
          return p[0];
        })
        .attr("cy", d => projection([+d.g_x, +d.g_y])[1])
        .attr("r", 2)
        .attr("fill", d => d.color)

      const updateChart = () => {
        let extent = d3.event.selection;
        const isBrushed = (d) => {
          let x0 = extent[0][0],
            x1 = extent[1][0],
            y0 = extent[0][1],
            y1 = extent[1][1];

          let proj = projection([+d.g_x, +d.g_y]);
          let cx = proj[0] * this.transform.k + this.transform.x;
          let cy = proj[1] * this.transform.k + this.transform.y;
          d.highlight = x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;
        }
        data.forEach(isBrushed);
        this.props.redraw();
      }

      const zoomed = () => {
        let transform = d3.event.transform;
        this.transform = transform;
        g.attr("transform", transform).attr("stroke-width", 5 / transform.k);
        g.selectAll("circle").attr("r", 2 / transform.k);
      }

      this.brush = svg.append("g");

      this.brush.call(d3.brush()
        .extent([[-200, 20], [width, height]])
        .on("start brush", updateChart)).attr("display", "none")

      const zoom = d3.zoom()
        .scaleExtent([0.5, 32])
        .on("zoom", zoomed);

      svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
    });
  }

  toggleBrush = () => {
    this.setState({ brush: !this.state.brush })
    this.brush.attr("display", this.state.brush ? "none" : "inline");
  }

  render() {
    return (
      <div className={this.props.classes.geoMapContainer}>
        <Card className={this.props.classes.geoMapCard}>
          <CardMedia className={this.props.classes.geoMapMedia}>
            <svg ref={this.svgRef} className={this.props.classes.map} viewBox="-10 -70 300 400">
              <g ref={this.gRef}></g>
            </svg>
          </CardMedia>
          <CardActions>
            <Box m={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={this.toggleBrush}
                style ={{textDecoration: "none"}}
              >
                Enable {this.state.brush ? "move" : "brush"}
              </Button>
            </Box>
          </CardActions>
        </Card>
      </div>
    );
  }
}


Map.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Map);