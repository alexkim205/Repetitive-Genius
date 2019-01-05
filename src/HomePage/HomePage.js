import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import genius

class HomePage extends Component {
  render() {
    return (
      <Fragment>
        <h1>Song Search</h1>
      </Fragment>
    );
  }
}

HomePage.propTypes = {
  geniusApi: PropTypes.instanceOf()
};

export { HomePage };
