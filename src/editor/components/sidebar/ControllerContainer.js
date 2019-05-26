import React, { PureComponent } from "react";
import classes from "./ControllerContainer.module.scss";
import SimpleBar from "simplebar-react";
import Automations from "./Automations";
import "simplebar/dist/simplebar.min.css";
import Projects from "./Projects";
import { app, base } from "backend/firebase";


class GUIMount extends PureComponent {
    constructor() {
        super();

        this.mountRef = React.createRef();
    }

    componentDidMount() {
        this.mountRef.current.appendChild(this.props.gui);
    }

    render() {
        return <div ref={this.mountRef} />;
    }
}

export default class ControllerContainer extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { index: 1, nav: 0 };
    }

    componentDidMount() {
        const { firstLoad } = this.props;
        if (firstLoad) this.initExportGUI();
    }

    initExportGUI = () => {
        const folder = this.props.gui.__folders["Export"];
        this.MBitBitrate = 7.2;
        this.fps = 60;
        this.preset = "veryfast";
        this.useCustomTimeRange = false;
        this.startTime = 0;
        this.endTime = 0;

        this.presetLookup = [
            "ultrafast",
            "veryfast",
            "fast",
            "medium",
            "slow",
            "veryslow"
        ];
        this.fileName = "myvid.mp4";
        folder.add(this, "useCustomTimeRange").name("Use custom time range").disableAll();
        folder
            .add(this, "startTime")
            .name("Start time (if custom time range is enabled)").disableAll();
        folder
            .add(this, "endTime")
            .name("End time (if custom time range is enabled)").disableAll();

        folder.add(this, "fileName").disableAll();
        folder.add(this, "fps", [24, 25, 30, 48, 60]).disableAll();
        folder.add(this, "preset", this.presetLookup).disableAll();
        folder.add(this, "MBitBitrate", 0, 20, 0.1).disableAll();
        folder.add(this, "startEncoding").disableAll();
    };

    startEncoding = () => {
        const { disabled, startEncoding } = this.props;
        if (!disabled) {
            const bitrate = this.MBitBitrate * Math.pow(10, 6);
            const preset = this.presetLookup.findIndex(e => e === this.preset);
            const settings = {
                fps: this.fps,
                bitrate: bitrate,
                preset: preset,
                fileName: this.fileName,
                useCustomTimeRange: this.useCustomTimeRange,
                startTime: this.startTime,
                endTime: this.endTime,
            };
            startEncoding(settings);
        }
    };

    convertAndLoad = projectFile => {
        if(projectFile.str) {
            base.collection("projects").doc(projectFile.id).set({
                projectSrc: projectFile.str,
                name: projectFile.name,
                width: projectFile.name,
                height: projectFile.name,
                owner: app.auth().currentUser.uid
            }).then(() => {
                let p = {...projectFile, projectSrc: projectFile.src}
                window.history.pushState({}, null, "/editor?project=" + projectFile.id);
                this.props.loadProject(p);
            })
        }else {
            base.collection("projects").doc(projectFile.id).get().then((snapshot) => {
                window.history.pushState({}, null, "/editor?project=" + projectFile.id);
                this.props.loadProject(snapshot.data());
            })                  
        }
    };

    render() {
        const { index, nav } = this.state;
        const { gui, loaded } = this.props;

        const selectedColor = "#444";
        const bg = nav === 0 ? selectedColor : "";
        const c = nav === 0 ? "#FFF" : "";

        return (
            <div className={classes.container}>
                <div className={classes.wrapper}>
                    <div className={classes.navWrapper}>
                        <div className={classes.nav}>
                            <button
                                onClick={() => this.setState({ nav: 0 })}
                                style={{ backgroundColor: bg, color: c }}
                            >
                                Editor
                            </button>
                            <button
                                onClick={() => this.setState({ nav: 1 })}
                                style={{
                                    backgroundColor:
                                        nav === 1 ? selectedColor : "",
                                    color: nav === 1 ? "#FFF" : ""
                                }}
                            >
                                Projects
                            </button>
                            <button disabled>Community</button>
                        </div>
                    </div>

                    {this.state.nav === 0 && (
                        <React.Fragment>
                            <div className={classes.headerButtons}>
                                <div
                                    onClick={() => this.setState({ index: 0 })}
                                    style={{
                                        backgroundColor:
                                            index === 0 ? selectedColor : ""
                                    }}
                                >
                                    Overview
                                </div>
                                <div
                                    onClick={() => this.setState({ index: 1 })}
                                    style={{
                                        backgroundColor:
                                            index === 1 ? selectedColor : ""
                                    }}
                                >
                                    layers
                                </div>
                                <div
                                    onClick={() => this.setState({ index: 2 })}
                                    style={{
                                        backgroundColor:
                                            index === 2 ? selectedColor : ""
                                    }}
                                >
                                    automations
                                </div>
                                <div
                                    onClick={() => this.setState({ index: 3 })}
                                    style={{
                                        backgroundColor:
                                            index === 3 ? selectedColor : ""
                                    }}
                                >
                                    audio
                                </div>
                                <div
                                    onClick={() => this.setState({ index: 4 })}
                                    style={{
                                        backgroundColor:
                                            index === 4 ? selectedColor : ""
                                    }}
                                >
                                    settings
                                </div>
                                <div
                                    onClick={() => this.setState({ index: 5 })}
                                    style={{
                                        backgroundColor:
                                            index === 5 ? selectedColor : ""
                                    }}
                                >
                                    export
                                </div>
                            </div>
                            <SimpleBar
                                data-simplebar-force-visible
                                className={classes.scrollbar}
                                style={{ width: "100%", height: "90%" }}
                            >
                                {index === 0 && loaded && (
                                    <GUIMount
                                        gui={gui.__folders["Overview"].domElement}
                                    />
                                )}

                                {index === 1 && loaded && (
                                    <GUIMount
                                        gui={gui.__folders["Layers"].domElement}
                                    />
                                )}
                                {index === 2 && loaded && (
                                    <Automations gui={gui} />
                                )}
                                {index === 3 && loaded && (
                                    <GUIMount
                                        gui={gui.__folders["Audio"].domElement}
                                    />
                                )}
                                {index === 4 && loaded && (
                                    <GUIMount
                                        gui={
                                            gui.__folders["Settings"].domElement
                                        }
                                    />
                                )}
                                {index === 5 && loaded && (
                                    <GUIMount
                                        gui={gui.__folders["Export"].domElement}
                                    />
                                )}
                            </SimpleBar>
                        </React.Fragment>
                    )}
                    {this.state.nav === 1 && (
                        <SimpleBar
                            data-simplebar-force-visible
                            className={classes.scrollbar}
                            style={{ width: "100%", height: "90%" }}
                        >
                            <Projects loadProject={this.convertAndLoad} />
                        </SimpleBar>
                    )}
                </div>
            </div>
        );
    }
}
