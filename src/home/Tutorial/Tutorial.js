import React, { PureComponent } from "react";

import Main from "./Main";
import Audio from "./Audio/Audio";
import Automations from "./Automations";
import Export from "./Export";
import Basics from "./Basics";

import AppAppBar from "../modules/views/AppAppBar";
import AppFooter from "../modules/views/AppFooter";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class Tutorial extends PureComponent {
    render() {
        return (
            <React.Fragment>
                <AppAppBar />
                <Router>
                    <Switch>
                    <Route
                            path="/tutorial/basics"
                            exact
                            component={Basics}
                        />
                        <Route
                            path="/tutorial/audio_analysers"
                            component={Audio}
                        />
                        <Route
                            path="/tutorial/automations"
                            exact
                            component={Automations}
                        />
                        <Route
                            path="/tutorial/exporting"
                            exact
                            component={Export}
                        />
                        <Route component={Main} />
                    </Switch>
                </Router>
                <AppFooter />
            </React.Fragment>
        );
    }
}
