import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { device } from "../_styles/breakpoints";

const StyledContainer = styled.div`
  margin: 0 0.3em;
  display: flex;
  flex-direction: row;
  flex-wrap: flex;
  .primaryArtist {
    display: flex;
    align-items: center;
  }
  .featuredArtists {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    padding: 0.5em;
  }
  @media ${device.tablet} {
    .featuredArtists {
      display: none;
    }
  }
  @media ${device.mobileL} {
    justify-content: center;
    .primaryArtist {
      
    }
  }
`;
const ArtistCircle = styled.div`
  border-radius: 100%;
  margin: 0.15em 0.15em;
  display: flex;
  overflow: hidden;
  transition: opacity 0.3s ease;
  // transition: width 0.5s ease, height 0.5s ease;

  img {
    object-fit: cover;
    // transition: width 0.5s ease, height 0.5s ease;
  }
`;
const PrimaryArtistCircle = styled(ArtistCircle)`
  width: 110px;
  height: 110px;
  border: 2px #1c2331 dashed;
  opacity: 1;

  img {
    width: 110px;
    height: 110px;
  }

  @media ${device.laptop} {
    width: 80px;
    height: 80px;
    img {
      width: 80px;
      height: 80px;
    }
  }
`;
const FeaturedArtistCircle = styled(ArtistCircle)`
  width: 40px;
  height: 40px;
  opacity: 0.6;
  &:hover {
    opacity: 1;
  }
  img {
    width: 40px;
    height: 40px;
  }
  @media ${device.laptop} {
    width: 30px;
    height: 30px;
    img {
      width: 30px;
      height: 30px;
    }
  }
`;

const toSentence = arr => {
  return (
    arr.slice(0, -2).join(", ") +
    (arr.slice(0, -2).length ? ", " : "") +
    arr.slice(-2).join(" and ")
  );
};

class Artists extends Component {
  render() {
    const { artists } = this.props;
    return (
      <StyledContainer>
        <div className="primaryArtist">
          <PrimaryArtistCircle>
            <LazyLoadImage src={artists.artistArt} alt="artistArt" />
          </PrimaryArtistCircle>
        </div>
        <div className="featuredArtists">
          {artists.featuredArtistsNames.length !== 0 &&
            artists.featuredArtistsArt.map((a, i) => (
              <FeaturedArtistCircle key={i}>
                <LazyLoadImage effect="blur" src={a} alt="featuredArtistArt" />
              </FeaturedArtistCircle>
            ))}
        </div>
      </StyledContainer>
    );
  }
}

Artists.propTypes = {
  artists: PropTypes.object.isRequired
};

export { Artists };
