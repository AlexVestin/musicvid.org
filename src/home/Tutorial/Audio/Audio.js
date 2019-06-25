import React, { PureComponent } from "react";

import Main from "./AudioMain";
import AudioTheory from "./AudioTheory";
import AudioImpact from "./AudioImpact";
import AudioSpectrum from "./AudioSpectrum";



import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

export default class Tutorial extends PureComponent {
    render() {
        return (
            <React.Fragment>
                <Router>
                    <Switch>
                        <Route
                            path="/tutorial/audio_analysers/theory"
                            exact
                            component={AudioTheory}
                        />
                        <Route
                            path="/tutorial/audio_analysers/impact"
                            exact
                            component={AudioImpact}
                        />
                        <Route
                            path="/tutorial/audio_analysers/spectrum"
                            exact
                            component={AudioSpectrum}
                        />

                        <Route component={Main} />
                    </Switch>
                </Router>
            </React.Fragment>
        );
    }
}
