import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { getDarkColor } from '../_styles/generate-color';
import { processData } from '../_datamunge/process-data';

const StyledSvg = styled.svg`
  width: 100%;
  g {
    rect {
      -webkit-transform: scale(1);
      -webkit-transform-origin: 50% 50%;
      // -webkit-transition: 0.1s;
      transform: scale(1);
      transform-origin: 50% 50%;
      // transition: 0.1s;
      transform-box: fill-box;
    }
    &.selected {
      rect {
        -webkit-transform: scale(5);
        transform: scale(5);
      }
    }
  }
`;

class LyricsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: null,
      matrix: null,
      groups: null,
      colors: null,
    };
    this.svgRef = React.createRef();

    this.setAsyncState = this.setAsyncState.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, () => resolve()));

  drawGrid() {
    const node = this.svgRef.current;
    const { matrix, count, groups, colors } = this.state;
    const { lyricsCorpus } = this.props;

    var side = 800, // final side length
      pixel = 2,
      width = 2 * lyricsCorpus.length,
      height = 2 * lyricsCorpus.length;

    // Scales
    var color_domain = Object.keys(colors).map((key, i) => colors[key]);
    // color_domain.sort((a, b) => a - b);
    var _c = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain([0, Math.max(...color_domain)]);
    var _x = d3
      .scaleBand()
      .domain(d3.range(lyricsCorpus.length))
      .rangeRound([0, width]);

    // initialize svg
    var svg = node;
    var svgNS = svg.namespaceURI;

    const _makeElement = (n, v) => {
      n = document.createElementNS(svgNS, n);
      for (var p in v) {
        n.setAttributeNS(null, p, v[p]);
      }
      return n;
    };

    // background color
    svg.appendChild(
      _makeElement('rect', { width: '100%', height: '100%', fill: '#000' }),
    );

    // draw each pixel by group
    var groupRefs = [];
    groups.forEach((group) => {
      if (group.length === 0) {
        groupRefs.push(null);
        return;
      }
      // make different color scale for each group
      let domain = group.map((point) => point.i);

      // make group
      var g = _makeElement('g', { class: 'island' });
      // if single word match, then don't draw
      if (group.length !== 1) {
        group.forEach((point) => {
          const { r, c } = point;
          let n1 = _makeElement('rect', {
            x: _x(r),
            y: _x(c),
            row: r,
            col: c,
            width: pixel,
            height: pixel,
            fill: _c(colors[lyricsCorpus[r]]),
          });
          let n2 = _makeElement('rect', {
            x: _x(c),
            y: _x(r),
            row: c,
            col: r,
            width: pixel,
            height: pixel,
            fill: _c(colors[lyricsCorpus[r]]),
          });
          // append to group
          g.appendChild(n1);
          g.appendChild(n2);
          // keep refs of all pixels and groups
          matrix[r][c]['ref'] = [n1, n2];
          matrix[r][c]['groupRef'] = g;
        });
      }
      // append group to svg
      svg.appendChild(g);
      groupRefs.push(g);
    });

    const { wordRefs, origToMini, miniToOrig } = this.props;
    // mouseover -> draw rectangle for every group and highlight words
    var onMouseOverHandler = (ref, points, event) => {
      ref.classList.add('selected');
      // highlight all words corresponding to group
      points.forEach((point) => {
        /*
         * Highlight points
         */
        let pointsToHighlight = point.ref; // rn only 2 points (halves) but later highlight all same words
        pointsToHighlight.forEach((pTH) => {
          pTH.classList.add('selected');
        });
        /* Highlight corresponding lyrics when hover over groups
         * Each point has two lyric references (row and column)
         */
        let lyricsToHighlight = [
          wordRefs[miniToOrig[point.r].o_i],
          wordRefs[miniToOrig[point.c].o_i],
        ];
        lyricsToHighlight.forEach((lTH) => {
          lTH.classList.add('selected');
        });
      });
    };
    var onMouseOutHandler = (ref, points, event) => {
      ref.classList.remove('selected');
      // highlight all words corresponding to group
      points.forEach((point) => {
        /*
         * Unhighlight points
         */
        let pointsToHighlight = point.ref; // rn only 2 points (halves) but later highlight all same words
        pointsToHighlight.forEach((pTH) => {
          pTH.classList.remove('selected');
        });
        /* Unighlight corresponding lyrics when mouse leaves over groups
         */
        let lyricsToHighlight = [
          wordRefs[miniToOrig[point.r].o_i],
          wordRefs[miniToOrig[point.c].o_i],
        ];
        lyricsToHighlight.forEach((lTH) => {
          lTH.classList.remove('selected');
        });
      });
    };

    console.log(wordRefs);
    console.log(origToMini);
    console.log(miniToOrig);
    console.log(groups);
    console.log(groupRefs);
    console.log(matrix);
    // hoverify each group
    for (var g_i in groups) {
      if (g_i === 0) {
        continue;
      }
      let island = groupRefs[g_i];
      let points = groups[g_i];
      // group hover
      island.onmouseover = (e) => onMouseOverHandler(island, points, e);
      island.onmouseout = (e) => onMouseOutHandler(island, points, e);
    }

    // resize to final size
    // svg.setAttribute('width', side);
    // svg.setAttribute('height', side);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  componentDidMount() {
    processData(this.props.lyricsCorpus)
      .then(({ count, matrix, groups, colors }) => {
        // this.setState({count, matrix, groups})
        // console.log(count);
        // console.log(matrix);
        // console.log(groups);
        return this.setAsyncState({ count, matrix, groups, colors });
      })
      .then(this.drawGrid)
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <Fragment>
        <StyledSvg ref={this.svgRef} />
      </Fragment>
    );
  }
}

LyricsGrid.propTypes = {
  lyricsCorpus: PropTypes.array.isRequired,
  wordRefs: PropTypes.array.isRequired,
  origToMini: PropTypes.object.isRequired,
  miniToOrig: PropTypes.object.isRequired,
};

export { LyricsGrid };
