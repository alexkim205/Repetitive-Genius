import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import AsyncSelect from 'react-select/lib/Async';
import { Container, Row, Col, Jumbotron } from 'reactstrap';
import { SongTile, Lyrics, Graph } from '../components';

import { Genius, getSongLyrics } from '../_services';

const StyledJumbotron = styled(Jumbotron)`
  text-align: center;
`;
const SearchContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  text-align: left;
`;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      queriedSong: null,
      lyrics: [],
      lyricsCorpus: [],
      wordRefs: [],
      url: '',
      // loading flags
      lyricsAreLoading: false,
      lyricsAreLoaded: false,
      songInfoIsLoading: false,
      songInfoIsLoaded: false,
      // typing
      typing: false,
      typingTimeout: 0,
      error: null,
    };

    this.getSongList = this.getSongList.bind(this);
    this.createWordRef = this.createWordRef.bind(this);
    this._handleInputChange = this._handleInputChange.bind(this);
    this._handleChange = this._handleChange.bind(this);
  }

  getSongList(query, callback) {
    const { geniusApi } = this.props;
    const _this = this;

    // only call api when user stops typing for 1 second
    if (_this.state.typingTimeout) {
      clearTimeout(_this.state.typingTimeout);
    }
    _this.setState({
      typing: false,
      typingTimeout: setTimeout(() => {
        geniusApi
          .searchSong(query)
          .then((response) => {
            if (response.status !== 200) {
              throw new Error('Something went wrong ...');
            }
            let options = response.data.hits.map((song) => {
              return {
                value: song.result.id,
                label: song.result.full_title,
                url: song.result.url,
              };
            });
            callback(options);
          })
          .catch((error) => _this.setState({ error }));
      }, 300),
    });
  }

  _handleChange(selected) {
    const _this = this;
    const { geniusApi } = this.props;

    // request song information
    _this.setState({ songInfoIsLoading: true });
    geniusApi
      .getSong(selected.value)
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Something went wrong ...');
        }
        let song = response.data.song;
        this.setState({
          error: null,
          songInfoIsLoading: false,
          songInfoIsLoaded: true,
          queriedSong: {
            title: song.title,
            titleWFeature: song.title_with_featured,
            album: song.album ? song.album.name : song.full_title,
            albumArt: song.song_art_image_thumbnail_url,
            artists: {
              primaryArtist: song.primary_artist.name,
              artistArt: song.primary_artist.image_url,
              featuredArtistsNames: song.featured_artists.map((a) => a.name),
              featuredArtistsArt: song.featured_artists.map((a) => a.image_url),
            },
            pills: {
              media: song.media,
              appleMusic: song.apple_music_player_url,
              genius: song.url,
              hot: song.stats.hot,
              pageViews: song.stats.pageviews,
            },
          },
        });
        console.log(this.state.queriedSong);
      })
      .catch((error) =>
        this.setState({
          error,
          songInfoIsLoading: false,
          songInfoIsLoaded: false,
        }),
      );

    // request lyrics
    _this.setState({ lyricsAreLoading: true });
    getSongLyrics(selected.url)
      .then((lyrics) => {
        // parse lyrics
        let lyricsCorpus = lyrics
          .join(' ') // join string
          .replace(/ *\[[^\]]*]|[()]/g, '') // remove everything btwn [] or remove just ()'s
          .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '') // remove punctuation
          .toLowerCase() // all words to lc
          .trim() // trim beginning and end of string
          .split(/\s+/); // split by whitespace
        // .slice(0, 50);

        _this.setState({
          error: null,
          lyrics,
          lyricsCorpus,
          wordRefs: [],
          lyricsAreLoading: false,
          lyricsAreLoaded: true,
        });
      })
      .catch((error) =>
        this.setState({
          error,
          lyricsAreLoading: false,
          lyricsAreLoaded: false,
        }),
      );
  }

  _handleInputChange(newValue) {
    // const query = newValue.replace(/\W/g, "");
    this.setState({ query: newValue });
    return newValue;
  }

  createWordRef = (ref) => {
    var newArray = this.state.wordRefs;
    newArray.push(ref);
    this.setState({ wordRefs: newArray });
  };

  render() {
    const {
      lyrics,
      lyricsCorpus,
      wordRefs,
      lyricsAreLoading,
      lyricsAreLoaded,
      songInfoIsLoading,
      songInfoIsLoaded,
      queriedSong,
      error,
    } = this.state;

    console.log(wordRefs.length);

    return (
      <Fragment>
        <StyledJumbotron>
          <h1>Repetitive Genius</h1>
          <p className='lead'>
            visualizing repetition in our music, inspired by{' '}
            <a
              href='https://github.com/colinmorris/SongSim'
              target='_blank'
              rel='noopener noreferrer'>
              SongSim
            </a>
          </p>
          {/* <hr /> */}
          <SearchContainer>
            <AsyncSelect
              cacheOptions
              onChange={this._handleChange}
              loadOptions={this.getSongList}
              onInputChange={this._handleInputChange}
            />
          </SearchContainer>
        </StyledJumbotron>
        <Container>
          <Row>
            {/* error */}
            <Col lg={12}>{error && <p>{error.message}</p>}</Col>
            {/* album/song art + info */}
            <Col lg={12}>
              {!songInfoIsLoading && songInfoIsLoaded && queriedSong && (
                <SongTile queriedSong={queriedSong} />
              )}
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row>
            {/* graph */}
            <Col lg={12} xl={6}>
              {/* <Graph
                lyrics={lyrics}
                lyricsCorpus={lyricsCorpus}
                origToMini={origToMini}
                miniToOrig={miniToOrig}
                lyricsAreLoading={lyricsAreLoading}
                lyricsAreLoaded={lyricsAreLoaded}
                wordRefs={wordRefs}
              /> */}
            </Col>
            {/* lyrics */}
            <Col lg={12} xl={6}>
              <Lyrics
                lyrics={lyrics}
                lyricsCorpus={lyricsCorpus}
                lyricsAreLoading={lyricsAreLoading}
                lyricsAreLoaded={lyricsAreLoaded}
                createRef={this.createWordRef}
              />
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  geniusApi: PropTypes.instanceOf(Genius),
};

export { HomePage };
