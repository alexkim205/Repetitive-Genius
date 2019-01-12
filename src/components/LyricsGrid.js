import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { update } from 'timm';

const StyledSvg = styled.svg`
  width: 100%;
  g {
    rect {
      -webkit-transform: scale(1);
      -webkit-transform-origin: 50% 50%;
      -webkit-transition: 0.1s;
      transform: scale(1);
      transform-origin: 50% 50%;
      transition: 0.1s;
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
    };
    this.svgRef = React.createRef();

    this.setAsyncState = this.setAsyncState.bind(this);
    this.processData = this.processData.bind(this);
    this._DFS = this._DFS.bind(this);
    this.findIslands = this.findIslands.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
  }

  setAsyncState = (newState) =>
    new Promise((resolve) => this.setState(newState, () => resolve()));

  processData() {
    // https://datavizcatalogue.com/methods/gantt_chart.html
    // https://bost.ocks.org/mike/miserables/
    // unique words count
    // topical analysis
    const { lyricsCorpus } = this.props;

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

    return this.setAsyncState({ lyricsCorpus, matrix, count });
  }

  _DFS = (rootX, rootY, visited, group, groupIndex) => {
    // DFS traverse to find all neighbors on island and mark visited
    const { matrix } = this.state;
    let toVisit = [matrix[rootX][rootY]],
      currNode = null;

    let rowNbr = [-1, -1, -1, 0, 0, 1, 1, 1], // relative neighboring indices
      colNbr = [-1, 0, 1, -1, 1, -1, 0, 1],
      side = visited.length;

    while (toVisit.length > 0) {
      currNode = toVisit.pop();
      visited[currNode.r][currNode.c] = 1; // mark visited

      // Add neighboring nodes that are not empty
      for (let i = 0; i < 8; i++) {
        let x = currNode.r + rowNbr[i];
        let y = currNode.c + colNbr[i];
        if (x >= 0 && x < side && y >= 0 && y < side) {
          // within boundaries
          if (visited[x][y] === 0 && matrix[x][y].i !== 0) {
            // not visited and not empty
            matrix[x][y].g = groupIndex++; // add group index to data
            group.push(matrix[x][y]); // add node to island
            toVisit.push(matrix[x][y]); // visit neighbors of this node too
          }
        }
      }
    }
  };

  findIslands() {
    const { matrix } = this.state;
    var groups = []; // all islands kept here
    var groupIndex = 1;

    // build empty matrix of visited nodes
    var visited = [];
    for (let _i = 0; _i < matrix.length; _i++) {
      visited[_i] = new Array(matrix.length).fill(0);
    }
    for (let row = 0; row < matrix.length; row++) {
      for (let col = row; col < matrix.length; col++) {
        // Visit unvisited cells that aren't empty
        if (visited[row][col] === 0 && matrix[row][col].i !== 0) {
          var group = [matrix[row][col]];
          this._DFS(row, col, visited, group, groupIndex); // go off and find an island!
          groups.push(group); // island has been found and visited
        }
      }
    }

    this.setState({ groups });
  }

  drawGrid() {
    const node = this.svgRef.current;
    const { matrix, lyricsCorpus, count, groups } = this.state;

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
      // make group
      var g = _makeElement('g', { class: 'island' });
      group.forEach((point) => {
        const { r, c, i } = point;
        let n1 = _makeElement('rect', {
          x: _x(r),
          y: _x(c),
          row: r,
          col: c,
          width: pixel,
          height: pixel,
          fill: _c(i),
        });
        let n2 = _makeElement('rect', {
          x: _x(c),
          y: _x(r),
          row: c,
          col: r,
          width: pixel,
          height: pixel,
          fill: _c(i),
        });
        // append to group
        g.appendChild(n1);
        g.appendChild(n2);
        // keep refs of all pixels and groups
        matrix[r][c]['ref'] = [n1, n2];
        matrix[r][c]['groupRef'] = g;
      });
      // append group to svg
      svg.appendChild(g);
      groupRefs.push(g);
    });

    // mouseover -> draw rectangle for every group and highlight words
    var onMouseOverHandler = (ref, g_i, event) => {
      ref.classList.add('selected');
      // highlight all words corresponding to group
      let points = groups[g_i];
      points.forEach((point) => {
        let refsToHighlight = point.ref; // rn only 2 points (halves) but later highlight all same words
        refsToHighlight.forEach((pTH) => {
          pTH.classList.add('selected');
        });
      });
    };
    var onMouseOutHandler = (ref, g_i, event) => {
      ref.classList.remove('selected');
      // highlight all words corresponding to group
      let points = groups[g_i];
      points.forEach((point) => {
        let refsToHighlight = point.ref; // rn only 2 points (halves) but later highlight all same words
        refsToHighlight.forEach((pTH) => {
          pTH.classList.remove('selected');
        });
      });
    };

    const { wordRefs, origToMini } = this.props;
    console.log(wordRefs);
    console.log(origToMini);
    console.log(groups);
    console.log(groupRefs);
    console.log(matrix);
    // hoverify each group
    for (var g_i in groupRefs) {
      let island = groupRefs[g_i];
      // group hover
      island.onmouseover = (e) => onMouseOverHandler(island, g_i, e);
      island.onmouseout = (e) => onMouseOutHandler(island, g_i, e);
    }

    // resize to final size
    svg.setAttribute('width', side);
    svg.setAttribute('height', side);
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  }

  componentDidMount() {
    this.processData() // process lyrics data into matrix
      .then(this.findIslands)
      .then(this.drawGrid) // draw grid
      .catch((err) => console.error(err));
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
};

export { LyricsGrid };
