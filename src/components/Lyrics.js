import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Loading, CustomLoader } from './';

const LyricsWrapper = styled.div`
  background-color: #4285f4;
  padding: 1em;
  code {
    color: white;
  }
`;

class Lyrics extends Component {

  render() {
    const {
      lyrics,
      lyricsCorpus,
      lyricsAreLoading,
      lyricsAreLoaded,
    } = this.props;
    return (
      <LyricsWrapper>
        <Loading
          isLoading={lyricsAreLoading}
          isLoaded={lyricsAreLoaded}
          loader={CustomLoader}>
          <Fragment>
            {lyrics &&
              lyrics.map((verse, i) => (
                <Fragment key={i}>
                  {verse.split(' ').map((word, i) => (
                    <span>{word} </span>
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
};

export { Lyrics };
