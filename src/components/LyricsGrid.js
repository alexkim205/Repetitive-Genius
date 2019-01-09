import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const StyledSvg = styled.svg`
  width: 100%;
`;

class LyricsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyricsCorpus: null,
      count: null,
      matrix: null,
    };
    this.svgRef = React.createRef();

    this._makeCorpus = this._makeCorpus.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
  }

  _makeCorpus() {
    // https://datavizcatalogue.com/methods/gantt_chart.html
    // https://bost.ocks.org/mike/miserables/
    // unique words count
    // topical analysis
    const { lyrics } = this.props;

    // parse lyrics
    const lyricsCorpus = lyrics
      .join(' ') // join string
      .replace(/ *\[[^\]]*]|[()]/g, '') // remove everything btwn [] or remove just ()'s
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // remove punctuation
      .toLowerCase() // all words to lc
      .trim() // trim beginning and end of string
      .split(/\s+/); // split by whitespace
    // .slice(0, 50);

    // count and put in dictionary
    var count = {};
    var uniqueIndex = 1;
    for (let i = 0; i < lyricsCorpus.length; i++) {
      count[lyricsCorpus[i]] = {
        index: uniqueIndex++,
        count: count[lyricsCorpus[i]]
          ? parseInt(count[lyricsCorpus[i]]) + 1
          : 0,
      };
    }

    /*
        [c, a, b, c]
      c[[3,0,0,3],
      a [0,1,0,0],
      b [0,0,2,0],
      c [3,1,0,3]]
    */
    // build empty matrix
    var matrix = [];
    for (let _i = 0; _i < lyricsCorpus.length; _i++) {
      matrix[_i] = new Array(lyricsCorpus.length);
    }

    // populate matrix
    for (let row = 0; row < lyricsCorpus.length; row++) {
      for (let col = row; col < lyricsCorpus.length; col++) {
        let index = 0;
        if (lyricsCorpus[row] === lyricsCorpus[col]) {
          index = count[lyricsCorpus[row]].index;
        }
        // populate both halves
        matrix[row][col] = {
          r: row,
          c: col,
          i: index,
        };
        matrix[col][row] = {
          r: col,
          c: row,
          i: index,
        };
      }
    }
    this.setState({ lyricsCorpus, matrix, count }, () => {
      this.drawGrid();
    });
  }

  drawGrid() {
    const node = this.svgRef.current;
    const { matrix, lyricsCorpus, count } = this.state;

    var side = 800, // final side length
      pixel = 2,
      width = 2 * lyricsCorpus.length,
      height = 2 * lyricsCorpus.length;

    // Scales
    var _c = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain(Object.entries(count).map(([k, v]) => v.index));
    var _x = d3
      .scaleBand()
      .domain(d3.range(lyricsCorpus.length))
      .rangeRound([0, width]);

    // initialize svg
    var svg = node;
    var svgNS = svg.namespaceURI;
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);

    const _makePoint = (n, v) => {
      n = document.createElementNS(svgNS, n);
      for (var p in v) {
        n.setAttributeNS(null, p, v[p]);
      }
      return n;
    };

    // background color
    svg.appendChild(
      _makePoint('rect', { width: '100%', height: '100%', fill: '#000' }),
    );

    // draw each pixel
    matrix.forEach((row) => {
      row.forEach((col) => {
        const { r, c, i } = col;
        if (i === 0) return;
        svg.appendChild(
          _makePoint('rect', {
            x: _x(r),
            y: _x(c),
            width: pixel,
            height: pixel,
            fill: _c(i),
          }),
        );
      });
    });
    // resize to final size
    svg.setAttribute('width', side);
    svg.setAttribute('height', side);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  componentDidMount() {
    this._makeCorpus(); // make lyrics corpus => array of words and render
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
  lyrics: PropTypes.array.isRequired,
};

export { LyricsGrid };
