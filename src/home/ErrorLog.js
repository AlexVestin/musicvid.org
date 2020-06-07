import React from "react";
import { connect } from "react-redux";
import AppFooter from "./modules/views/AppFooter";
import AppAppBar from "./modules/views/AppAppBar";
import LayoutBody from "./modules/components/LayoutBody";
import { app } from "backend/firebase";

import ReactJson from "react-json-view";

class ErrorComponent extends React.PureComponent {
    state = { json: {}, list: [], useList: false, errors: 0, exports: 0 };

    componentDidMount() {
        console.log(window.location);
        const urlParams = new URLSearchParams(window.location.search);
        const errId = urlParams.get("err");

        app.firestore()
            .collection("exports")
            .get()
            .then((querySnapshot) => {
                this.setState({ exports: querySnapshot.size });
            });

        if (errId) {
            app.firestore()
                .collection("errors")
                .doc(errId)
                .get()
                .then((res) => this.setState({ json: res.data() }))
                .catch((err) => {
                    console.log(err);
                });
        } else {
            app.firestore()
                .collection("errors")
                .get()
                .then((snapshot) => {
                    const errors = snapshot.docs
                        .map((doc) => doc.data())
                        .sort((a, b) => b.time - a.time);

                    let internalErrCount = 0;
                    for (const err of errors) {
                        if (
                            err.log &&
                            err.log.includes("Failed to create internal buffer")
                        ) {
                            const parts = err.log.split("\n");
                            for (const p of parts) {
                                if (p.includes("padded buf size")) {
                                    const size = Number(p.split(":")[1]);
                                    console.log(p, `${size / (1000 * 1000)}MB`);
                                }
                            }
                            internalErrCount++;
                        }
                    }

                    this.setState({
                        errors: snapshot.size,
                        json: errors,
                        internalErrCount
                    });
                })
                .catch((err) => console.log(err));
            return;
        }
    }
    render() {
        return (
            <React.Fragment>
                <LayoutBody margin marginBottom>
                    <AppAppBar />
                    <div>
                        <div>errors: {this.state.errors}</div>
                        <div>malloc errors: {this.state.internalErrCount}</div>
                        <div>exports: {this.state.exports}</div>

                        <div>
                            success rate:
                            {(1.0 - this.state.errors / this.state.exports) *
                                100}
                            %
                        </div>
                    </div>
                    <ReactJson collapsed src={this.state.json} />
                </LayoutBody>
                <AppFooter />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        code: state.error.code,
        message: state.error.message,
        title: state.error.title
    };
};

export default connect(mapStateToProps)(ErrorComponent);
