import React, { PureComponent } from 'react'
import AppContainer from './editor/App'
import Home from './home/Home'
import FAQ from './home/FAQ'


import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import withRoot from './home/modules/withRoot';


class Index extends PureComponent {
  render() {
    return (
      <Router >
        <Switch >
          <Route path="/projects" component={Home}></Route>
          <Route path="/editor" component={AppContainer}></Route>
          <Route path="/faq" component={FAQ}></Route>

          <Route path="/" component={Home}></Route>
        </Switch>
      </Router>
    )
  }
}


export default withRoot(Index);