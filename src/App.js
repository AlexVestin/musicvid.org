import React, { PureComponent } from 'react'
import AppContainer from './editor/App'
import Home from './home/Home'

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";



export default class Index extends PureComponent {
  render() {
    return (
      <Router >
        <Switch >
          <Route path="/projects" component={Home}></Route>
          <Route path="/editor" component={AppContainer}></Route>
          <Route path="/" component={Home}></Route>
        </Switch>
      </Router>
    )
  }
}
