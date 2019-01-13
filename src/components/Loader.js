import React from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

const StyledLoader = styled(Loader)`
  margin: 0 auto;
`;

const WhiteLoader = (props) => (
  <StyledLoader type='ThreeDots' color='white' height='100' width='100' />
);

const BlackLoader = (props) => (
  <StyledLoader type='ThreeDots' color='black' height='100' width='100' />
);

const DarkLoader = (props) => (
  <StyledLoader type='ThreeDots' color='#3167C1' height='100' width='100' />
);

const LightLoader = (props) => (
  <StyledLoader type='ThreeDots' color='#F9F2EB' height='100' width='100' />
);

export { WhiteLoader, BlackLoader, DarkLoader, LightLoader };

/*
FCFAFB
E96685
67C2E2
AB9542
214057
*/
