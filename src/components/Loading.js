import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Loading = (props) => {
  const { isLoading, isLoaded, loader } = props;
  console.log(!isLoading && isLoaded);
  return (
    <Fragment>
      {!isLoading && isLoaded ? (
        <Fragment>{props.children}</Fragment>
      ) : (
        <Fragment>{isLoading && <Fragment>{loader}</Fragment>}</Fragment>
      )}
    </Fragment>
  );
};

Loading.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired,
  loader: PropTypes.element.isRequired,
};

export { Loading };
