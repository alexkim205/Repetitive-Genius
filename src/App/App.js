import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { HomePage } from "../HomePage";
import Genius from "./_services/genius.service";

// start Genius API
const genius = new Genius();

const About = () => <h2>About</h2>;

class App extends Component {
  render() {
    return (
      <Router>
        <React.Fragment>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
            </ul>
          </nav>
          <Route path="/" exact component={HomePage} />
          <Route path="/about" component={About} />
        </React.Fragment>
      </Router>
    );
  }
}

export { App };
