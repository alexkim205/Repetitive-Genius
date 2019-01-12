import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loading, CustomLoader, LyricsGrid } from './';

const GraphWrapper = styled.div`
  background-color: #aa66cc;
  padding: 1em;
  code {
    color: white;
  }
`;

class Graph extends Component {
  render() {
    const {
      lyricsCorpus,
      origToMini,
      lyricsAreLoading,
      lyricsAreLoaded,
      wordRefs,
    } = this.props;
    return (
      <GraphWrapper>
        <Loading
          isLoading={lyricsAreLoading}
          isLoaded={lyricsAreLoaded}
          loader={<CustomLoader />}>
          <LyricsGrid
            lyricsCorpus={lyricsCorpus}
            wordRefs={wordRefs}
            origToMini={origToMini}
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
};

export { Graph };
