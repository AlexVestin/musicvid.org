import React, { Component } from 'react';
import Container from './gui/ControllerContainer'
import Test from './test'

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Container></Container>
          <Test></Test>
      </div>
    );
  }
}

export default App;
