import React, { PureComponent } from "react";
import AppContainer from "./editor/App";
import Home from "./home/Home";
import FAQ from "./home/FAQ";
import SignUp from "./home/SignUp";
import SignIn from "./home/SignIn";
import Missing from "./home/Missing";
import Downloads from "./home/Downloads";
import { app } from "backend/firebase";
import { setIsAuthenticated } from "./fredux/actions/auth";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import withRoot from "./home/modules/withRoot";
import Videos from "./home/Videos";

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
                    <Route path="/projects" component={Home} />
                    <Route path="/editor" component={AppContainer} />
                    <Route path="/faq" component={FAQ} />
                    <Route path="/about" component={FAQ} />
                    <Route path="/sign-in" component={SignIn} />
                    <Route path="/sign-up" component={SignUp} />
                    <Route component={Missing} />
                </Switch>
            </Router>
        );
    }
}

export default withRoot(Index);
