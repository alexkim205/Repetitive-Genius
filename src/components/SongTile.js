import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Row, Col } from "reactstrap";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { SongPills, Artists } from "./";
import { device } from "../_styles/breakpoints";

const StyledMedia = styled.div`
  display: flex;

  @media ${device.mobileL} {
    flex-direction: column;
    align-items: center;
  }

  .album-art {
    display: flex;
    align-items: center;
    padding: 1em;
    img {
      border: 2px #1c2331 solid;
      width: 100%;
      min-width: 235px;
      height: auto;
    }
  }
  .title {
    padding: 1em 0;
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
    margin: 0.5em 0 0.3em;
    @media ${device.mobileL} {
      width: 250px;
      text-align: center;
    }
  }
`;

class SongTile extends Component {
  render() {
    const { queriedSong } = this.props;
    return (
      <Fragment>
        {queriedSong && (
          <StyledMedia>
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
