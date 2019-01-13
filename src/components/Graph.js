import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loading, DarkLoader, LyricsGrid } from './';

const GraphWrapper = styled.div`
  // background-color: ;
  // padding: 1em;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow: hidden;
`;

class Graph extends Component {
  render() {
    const {
      lyricsCorpus,
      origToMini,
      miniToOrig,
      lyricsAreLoading,
      lyricsAreLoaded,
      wordRefs,
    } = this.props;
    return (
      <GraphWrapper>
        <Loading
          isLoading={lyricsAreLoading}
          isLoaded={lyricsAreLoaded}
          loader={<DarkLoader />}>
          <LyricsGrid
            lyricsCorpus={lyricsCorpus}
            wordRefs={wordRefs}
            origToMini={origToMini}
            miniToOrig={miniToOrig}
          />
        </Loading>
      </GraphWrapper>
    );
  }
}

Graph.propTypes = {
  lyrics: PropTypes.array.isRequired,
  lyricsCorpus: PropTypes.array.isRequired,
  lyricsAreLoading: PropTypes.bool.isRequired,
  lyricsAreLoaded: PropTypes.bool.isRequired,
  wordRefs: PropTypes.array.isRequired,
  origToMini: PropTypes.object.isRequired,
  miniToOrig: PropTypes.object.isRequired,
};

export { Graph };
