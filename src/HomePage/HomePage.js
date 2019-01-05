import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Genius from "../_services/genius.service";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = { songs: [] };
  }

  componentDidMount() {
    const { geniusApi } = this.props;

    geniusApi
      .searchSong("Hello")
      .then(response => {
        this.setState({ songs: response.data.hits })
        console.log(this.state.songs)
      })
      .catch(err => console.log(err));
  }

  render() {
    const { songs } = this.state;
    return (
      <Fragment>
        <h1>Song Search</h1>
        <ul>
          {songs &&
            songs.map((song, i) => <li key={i}>{song.result.full_title}</li>)}
        </ul>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  geniusApi: PropTypes.instanceOf(Genius)
};

export { HomePage };
