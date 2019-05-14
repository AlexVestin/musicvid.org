import React, { PureComponent } from "react";
import classes from "./ControllerContainer.module.scss";
import SimpleBar from "simplebar-react";
import Automations from "./Automations";
import "simplebar/dist/simplebar.min.css";
import Projects from "./Projects";

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
        folder.add(this, "useCustomTimeRange").name("Use custom time range");
        folder
            .add(this, "startTime")
            .name("Start time (if custom time range is enabled)").disableAutomations();
        folder
            .add(this, "endTime")
            .name("End time (if custom time range is enabled)").disableAutomations();

        folder.add(this, "fileName");
        folder.add(this, "fps", [24, 25, 30, 48, 60]);
        folder.add(this, "preset", this.presetLookup);
        folder.add(this, "MBitBitrate", 0, 20, 0.1).disableAutomations();
        folder.add(this, "startEncoding");
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
        const proj = JSON.parse(projectFile.str);
        window.history.pushState({}, null, "/editor?project=" + projectFile.id);

        this.props.loadProject(proj);
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
