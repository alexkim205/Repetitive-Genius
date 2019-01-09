import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { HomePage } from '../HomePage';
import { Genius } from '../_services';

// start Genius API
const genius = new Genius();

const About = () => <h2>About</h2>;

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <Route
            path='/'
            exact
            render={(props) => <HomePage {...props} geniusApi={genius} />}
          />
          <Route path='/about' component={About} />
        </React.Fragment>
      </Router>
    );
  }
}

export { App };
