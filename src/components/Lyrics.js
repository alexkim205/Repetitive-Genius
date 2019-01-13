import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loading, LightLoader } from './';

const LyricsWrapper = styled.div`
  background-color: #4285f4;
  padding: 2em;
  column-count: 2;
  column-gap: 1em;
  font-size: 0.8em;
  span {
    // font-family: 'Source Code Pro', monospace;
    color: white;
    &.selected {
      background-color: yellow;
      color: red;
    }
  }
`;

class Lyrics extends Component {
  render() {
    const {
      lyrics,
      lyricsCorpus,
      lyricsAreLoading,
      lyricsAreLoaded,
      createRef,
    } = this.props;

    return (
      <LyricsWrapper>
        <Loading
          isLoading={lyricsAreLoading}
          isLoaded={lyricsAreLoaded}
          loader={<LightLoader />}>
          <Fragment>
            {lyrics &&
              lyrics.map((verse, i) => (
                <Fragment key={i}>
                  {verse.split(' ').map((word, i) => (
                    <Fragment>
                      <span ref={createRef} key={i}>
                        {word}
                      </span>{' '}
                    </Fragment>
                  ))}
                  <br />
                </Fragment>
              ))}
          </Fragment>
        </Loading>
      </LyricsWrapper>
    );
  }
}

Lyrics.propTypes = {
  lyrics: PropTypes.array.isRequired,
  lyricsCorpus: PropTypes.array.isRequired,
  lyricsAreLoading: PropTypes.bool.isRequired,
  lyricsAreLoaded: PropTypes.bool.isRequired,
  createRef: PropTypes.func.isRequired,
};

export { Lyrics };
