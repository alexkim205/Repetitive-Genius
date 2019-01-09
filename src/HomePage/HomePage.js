import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import AsyncSelect from "react-select/lib/Async";
import Loader from "react-loader-spinner";
import { Container, Row, Col, Jumbotron } from "reactstrap";
import { SongTile, LyricsGrid, Loading } from "../components";

import { Genius, getSongLyrics } from "../_services";

const StyledJumbotron = styled(Jumbotron)`
  text-align: center;
`;
const SearchContainer = styled.div`
  max-width: 450px;
  margin: 0 auto;
  text-align: left;
`;
const Graph = styled.div`
  background-color: #aa66cc;
  padding: 1em;
  code {
    color: white;
  }
`;
const Lyrics = styled.div`
  background-color: #4285f4;
  padding: 1em;
  code {
    color: white;
  }
`;
const CenteredLoader = styled(Loader)`
  margin: 0 auto;
`;

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      queriedSong: null,
      lyrics: [],
      url: "",
      lyricsAreLoading: false,
      lyricsAreLoaded: false,
      songInfoIsLoading: false,
      songInfoIsLoaded: false,
      typing: false,
      typingTimeout: 0,
      error: null
    };

    this.getSongList = this.getSongList.bind(this);
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
          .then(response => {
            if (response.status !== 200) {
              throw new Error("Something went wrong ...");
            }
            let options = response.data.hits.map(song => {
              return {
                value: song.result.id,
                label: song.result.full_title,
                url: song.result.url
              };
            });
            callback(options);
          })
          .catch(error => _this.setState({ error }));
      }, 300)
    });
  }

  _handleChange(selected) {
    const _this = this;
    const { geniusApi } = this.props;

    // request song information
    _this.setState({ songInfoIsLoading: true });
    geniusApi
      .getSong(selected.value)
      .then(response => {
        if (response.status !== 200) {
          throw new Error("Something went wrong ...");
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
              featuredArtistsNames: song.featured_artists.map(a => a.name),
              featuredArtistsArt: song.featured_artists.map(a => a.image_url)
            },
            pills: {
              media: song.media,
              appleMusic: song.apple_music_player_url,
              genius: song.url,
              hot: song.stats.hot,
              pageViews: song.stats.pageviews
            }
          }
        });
        console.log(this.state.queriedSong);
      })
      .catch(error =>
        this.setState({
          error,
          songInfoIsLoading: false,
          songInfoIsLoaded: false
        })
      );

    // request lyrics
    _this.setState({ lyricsAreLoading: true });
    getSongLyrics(selected.url)
      .then(lyrics => {
        _this.setState({
          error: null,
          lyrics,
          lyricsAreLoading: false,
          lyricsAreLoaded: true
        });
      })
      .catch(error =>
        this.setState({
          error,
          lyricsAreLoading: false,
          lyricsAreLoaded: false
        })
      );
  }

  _handleInputChange(newValue) {
    // const query = newValue.replace(/\W/g, "");
    const query = newValue;
    this.setState({ query });
    return query;
  }

  render() {
    const {
      lyrics,
      lyricsAreLoading,
      lyricsAreLoaded,
      songInfoIsLoading,
      songInfoIsLoaded,
      error,
      queriedSong
    } = this.state;

    return (
      <Fragment>
        <StyledJumbotron>
          <h1>Repetitive Genius</h1>
          <p className="lead">
            visualizing repetition in our music, inspired by{" "}
            <a
              href="https://github.com/colinmorris/SongSim"
              target="_blank"
              rel="noopener noreferrer"
            >
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
          {/* <p>inspired by SongSim</p> */}
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
              <Graph>
                <Loading
                  isLoading={lyricsAreLoading}
                  isLoaded={lyricsAreLoaded}
                  loader={
                    <CenteredLoader
                      type="ThreeDots"
                      color="white"
                      height="100"
                      width="100"
                    />
                  }
                >
                  <LyricsGrid lyrics={lyrics} />
                </Loading>
              </Graph>
            </Col>
            {/* lyrics */}
            <Col lg={12} xl={6}>
              <Lyrics>
                <Loading
                  isLoading={lyricsAreLoading}
                  isLoaded={lyricsAreLoaded}
                  loader={
                    <CenteredLoader
                      type="ThreeDots"
                      color="white"
                      height="100"
                      width="100"
                    />
                  }
                >
                  <Fragment>
                    {lyrics &&
                      lyrics.map((verse, i) => (
                        <Fragment key={i}>
                          <code>{verse}</code>
                          <br />
                        </Fragment>
                      ))}
                  </Fragment>
                </Loading>
              </Lyrics>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  geniusApi: PropTypes.instanceOf(Genius)
};

export { HomePage };
