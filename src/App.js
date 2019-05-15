import React, { PureComponent } from "react";
import Home from "./home/Home";
import Downloads from "./home/Downloads";
import Videos from "./home/Videos";
import Projects from "./home/Community";
import Profile from "./home/Profile";
import AppContainer from "./editor/App";
import FAQ from "./home/FAQ";
import SignIn from "./home/SignIn";
import SignUp from "./home/SignUp";
import Missing from "./home/Missing";
import AddProject from "./home/AddProject";

import Forgot from "./home/ForgotPassword";
import SignOutComponent from './home/SignOutComponent'
import { app } from "backend/firebase";
import { setIsAuthenticated } from "./fredux/actions/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import withRoot from "./home/modules/withRoot";

class Index extends PureComponent {
    componentDidMount() {
        this.removeAuthListener = app.auth().onAuthStateChanged(user => {
            if (user) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        });
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/" exact component={Home} />
                    <Route path="/index.html" exact component={Home} />
                    <Route path="/home" component={Home} />
                    <Route path="/downloads" component={Downloads} />
                    <Route path="/videos" component={Videos} />
                    <Route path="/projects" component={Projects} />
                    <Route path="/add-project" component={AddProject} />

                    <Route path="/profile" component={Profile} />
                    <Route path="/editor" component={AppContainer} />
                    <Route path="/faq" component={FAQ} />
                    <Route path="/about" component={FAQ} />
                    <Route path="/sign-in" component={SignIn} />
                    <Route path="/sign-up" component={SignUp} />
                    <Route path="/forgot-password" component={Forgot} />
                    <Route path="/sign-out" component={SignOutComponent} />
                    <Route component={Missing} />
                </Switch>
            </Router>
        );
    }
}

export default withRoot(Index);
