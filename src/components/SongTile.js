import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { SongPills, Artists } from "./";
import { device } from "../_styles/breakpoints";
import * as Vibrant from "node-vibrant";

const StyledMedia = styled.div`
  display: flex;
  transition: border-top 1s ease;
  border-top: 10px ${props => props.topBarColor} solid;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  margin-bottom: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  @media ${device.mobileL} {
    flex-direction: column;
    align-items: center;
  }

  .album-art {
    display: flex;
    align-items: center;
    padding: 2em;
    img {
      // border: 2px #1c2331 solid;
      width: 100%;
      min-width: 235px;
      height: auto;
    }

  }
  @media ${device.laptop} {
    .album-art {
      padding: 1em;
      img {
        width: 240px;
      }
    }
  }
  .title {
    padding: 1.1em 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
      margin: 0 0 0.3em 0;
    }
    small,
    h4 {
      margin: 0.5em 0 0.3em 0;
    }
    @media ${device.laptop} {
      h2 {
        font-size: 1.5em;
      }
      h4 {
        font-size: 1em;
      }
    }
    @media ${device.mobileL} {
      h2 {
        font-size: 2em;
      }
      width: 250px;
      text-align: center;
    }
  }
  .pills {
    margin: 0.5em 0 0.3em;
  }
  .artists {
    margin: 1em 0 0.3em;
    @media ${device.mobileL} {
      margin: 0.5em 0 0.3em;
      width: 250px;
      text-align: center;
    }
  }
`;

class SongTile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      palette: null
    };

    this._getVibrantColor = this._getVibrantColor.bind(this);
  }

  componentDidMount() {
    this._getVibrantColor(this.props.queriedSong.albumArt);
  }

  _getVibrantColor(imgPath) {
    Vibrant.from(imgPath)
      .getPalette()
      .then(palette => {
        this.setState({ palette });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { queriedSong } = this.props;
    const vc = this.state.palette ? this.state.palette.Vibrant : null;
    const topBarColor = vc
      ? `rgb(${vc._rgb[0]},${vc._rgb[1]},${vc._rgb[2]})`
      : "#0275d8";

    return (
      <Fragment>
        {queriedSong && (
          <StyledMedia topBarColor={topBarColor}>
            <div className="album-art">
              <LazyLoadImage
                effect="blur"
                src={queriedSong.albumArt}
                alt="albumArt"
              />
            </div>
            <div className="flex-grow-1 title">
              <h2>{queriedSong.title}</h2>
              <h4> by {queriedSong.artists.primaryArtist}</h4>
              <div className="pills">
                <SongPills pills={queriedSong.pills} />
              </div>
              <div className="artists">
                <Artists artists={queriedSong.artists} />
              </div>
            </div>
          </StyledMedia>
        )}
      </Fragment>
    );
  }
}

SongTile.propTypes = {
  queriedSong: PropTypes.object.isRequired
};

export { SongTile };
