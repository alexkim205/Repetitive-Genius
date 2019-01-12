import React from 'react';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';

const StyledLoader = styled(Loader)`
  margin: 0 auto;
`;

export const CustomLoader = (props) => (
  <StyledLoader type='ThreeDots' color='white' height='100' width='100' />
);
