import React, { Component, Fragment } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import * as d3 from "d3";

class LyricsGrid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lyricsCorpus: null,
      count: null,
      matrix: null
    };

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
      .join(" ") // join string
      .replace(/ *\[[^\]]*]|[()]/g, "") // remove everything btwn [] or remove just ()'s
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "") // remove punctuation
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
        count: count[lyricsCorpus[i]] ? parseInt(count[lyricsCorpus[i]]) + 1 : 0
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
        // console.log(index);
        // populate both halves
        matrix[row][col] = {
          r: row,
          c: col,
          i: index
        };
        matrix[col][row] = {
          r: col,
          c: row,
          i: index
        };
      }
    }
    this.setState({ lyricsCorpus, matrix, count }, () => {
      // console.log(this.state);
      this.drawGrid();
    });
  }

  drawGrid() {
    const node = this.node;
    const { matrix, lyricsCorpus, count } = this.state;

    var pixel = 2,
      width = pixel * lyricsCorpus.length,
      height = pixel * lyricsCorpus.length;

    // Scales
    var _c = d3
      .scaleSequential(d3.interpolateRainbow)
      .domain(Object.entries(count).map(([k, v]) => v.index));
    var _x = d3
      .scaleBand()
      .domain(lyricsCorpus.map((v, i) => i))
      .rangeRound([0, width]);
    // console.log(_c);
    // console.log(_x);
    console.log(this.state);

    d3.select(node)
      .select("canvas")
      .remove();

    var canvas = d3
      .select(node)
      .append("canvas")
      .attr("width", width)
      .attr("height", height);

    var ctx = canvas.node().getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // draw each pixel
    for (const [_ri, row] of matrix.entries()) {
      for (const [_ci, col] of row.entries()) {
        const { r, c, i } = col;
        if (i === 0) {
          continue;
        }
        ctx.fillStyle = _c(i);
        ctx.fillRect(_x(r), _x(c), pixel, pixel);
      }
    }
  }

  componentDidMount() {
    this._makeCorpus(); // make lyrics corpus => array of words
  }
  // componentDidUpdate() {
  //   this.drawGrid();
  // }

  render() {
    return (
      <Fragment>
        <div ref={node => (this.node = node)}>
          <canvas />
        </div>
      </Fragment>
    );
  }
}

LyricsGrid.propTypes = {
  lyrics: PropTypes.array.isRequired
};

export { LyricsGrid };
