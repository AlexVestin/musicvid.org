import React, { PureComponent } from 'react'
import AppContainer from './editor/App'
import Home from './home/Home'
import FAQ from './home/FAQ'
import SignUp from './home/SignUp'
import SignIn from './home/SignIn'
import Missing from './home/Missing'



import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import withRoot from './home/modules/withRoot';


class Index extends PureComponent {
  render() {
    return (
      <Router >
        <Switch >
          <Route path="/" exact component={Home}></Route>
          <Route path="/index.html" exact component={Home}></Route>

          <Route path="/home" component={Home}></Route>
          <Route path="/projects" component={Home}></Route>
          <Route path="/editor" component={AppContainer}></Route>
          <Route path="/faq" component={FAQ}></Route>
          <Route path="/about" component={FAQ}></Route>
          <Route path="/sign-in" component={SignIn}></Route>
          <Route path="/sign-up" component={SignUp}></Route>
          
          <Route component={Missing}></Route>
        </Switch>
      </Router>
    )
  }
}


export default withRoot(Index);