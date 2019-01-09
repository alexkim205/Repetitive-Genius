import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Badge } from 'reactstrap';

const StyledBadge = styled(Badge)`
  margin: 0 0.15em;
  &.soundcloud-pill {
    background-color: #ff7700 !important;
    color: white;
    &:hover {
      background-color: #cc5f00 !important;
    }
  }
`;

const abbreviateNumber = (number) => {
  var SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
  var tier = (Math.log10(number) / 3) | 0;
  if (tier === 0) return number;
  var suffix = SI_SYMBOL[tier];
  var scale = Math.pow(10, tier * 3);
  var scaled = number / scale;
  // console.log(scaled.toFixed(1) + suffix);
  return scaled.toFixed(1) + suffix;
};

class SongPills extends Component {
  render() {
    const { pills } = this.props;
    return (
      <Fragment>
        {pills.hot && (
          <StyledBadge color='danger' pill>
            Hot
          </StyledBadge>
        )}
        <StyledBadge href={pills.appleMusic} color='secondary' pill>
          Apple Music
        </StyledBadge>
        {pills.media.length !== 0 &&
          pills.media.map((m, i) => {
            let provider, color, className;
            switch (m.provider) {
              case 'spotify':
                provider = 'Spotify';
                color = 'success';
                break;
              case 'youtube':
                provider = 'Youtube';
                color = 'danger';
                break;
              case 'soundcloud':
                provider = 'SoundCloud';
                className = 'soundcloud-pill';
                break;
              default:
                break;
            }
            return (
              <StyledBadge
                key={i}
                href={m.url}
                color={color}
                className={className}
                pill>
                {provider}
              </StyledBadge>
            );
          })}
        <StyledBadge href={pills.genius} color='warning' pill>
          Genius Lyrics
        </StyledBadge>
        <StyledBadge color='info' pill>
          {abbreviateNumber(pills.pageViews)} Page Views
        </StyledBadge>
      </Fragment>
    );
  }
}

SongPills.propTypes = {
  pills: PropTypes.object.isRequired,
};

export { SongPills };
