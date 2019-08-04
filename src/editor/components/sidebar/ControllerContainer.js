import React, { PureComponent } from "react";
import classes from "./ControllerContainer.module.scss";
import SimpleBar from "simplebar-react";
import Automations from "./Automations";
import "simplebar/dist/simplebar.min.css";
import Projects from "./Projects";
import { app, base } from "backend/firebase";

export class GUIMount extends PureComponent {
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
        folder
            .add(this, "useCustomTimeRange")
            .name("Use custom time range")
            .disableAll();
        folder
            .add(this, "startTime")
            .name("Start time (if custom time range is enabled)")
            .disableAll();
        folder
            .add(this, "endTime")
            .name("End time (if custom time range is enabled)")
            .disableAll();

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
                endTime: this.endTime
            };
            startEncoding(settings);
        }
    };

    convertAndLoad = projectFile => {
        if (projectFile.str) {
            base.collection("projects")
                .doc(projectFile.id)
                .set({
                    projectSrc: projectFile.str,
                    name: projectFile.name,
                    width: projectFile.name,
                    height: projectFile.name,
                    owner: app.auth().currentUser.uid
                })
                .then(() => {
                    let p = { ...projectFile, projectSrc: projectFile.src };
                    window.history.pushState(
                        {},
                        null,
                        "/editor?project=" + projectFile.id
                    );
                    this.props.loadProject(p);
                });
        } else {
            base.collection("projects")
                .doc(projectFile.id)
                .get()
                .then(snapshot => {
                    window.history.pushState(
                        {},
                        null,
                        "/editor?project=" + projectFile.id
                    );
                    this.props.loadProject(snapshot.data());
                });
        }
    };

    render() {
        const { index, nav } = this.state;
        const { gui, loaded } = this.props;

        const selectedColor = "#444";
        const bg = nav === 0 ? selectedColor : "";
        const c = nav === 0 ? "#FFF" : "";

        const w = this.props.advanced ? "16.67%" : "25%";



        return (
            <div className={classes.container}>
                
                <div className={classes.wrapper}>
                    
                    <div className={classes.sideNav}>
                        <div style={{backgroundColor: index === 0 ? selectedColor : ""}} onClick={() => this.setState({index: 0})}>Quick Settings</div>
                        <div style={{backgroundColor: index === 1 ? selectedColor : ""}} onClick={() => this.setState({index: 1})}>Audio</div>
                        <div style={{marginLeft: 0, backgroundColor: index === 2 ? selectedColor : ""}} onClick={() => this.setState({index: 2})}>Layers</div>
                        <div style={{marginLeft: 0, backgroundColor: index === 3 ? selectedColor : ""}} onClick={() => this.setState({index: 3})}>Automations</div>
                        <div style={{marginLeft: 0, backgroundColor: index === 4 ? selectedColor : ""}} onClick={() => this.setState({index: 4})}>Settings</div>
                        <div style={{backgroundColor: index === 5 ? selectedColor : ""}} onClick={() => this.setState({index: 5})}>Project</div>
                        <div style={{backgroundColor: index === 6 ? selectedColor : ""}}onClick={() => this.setState({index: 6})}>Export</div>
                    </div>
                    <SimpleBar
                        data-simplebar-force-visible
                        className={classes.scrollbar}
                        style={{  height: "90%" }}
                    >
                        {index === 0 && loaded && (
                            <GUIMount
                                gui={gui.__folders["Overview"].domElement}
                            />
                        )}

                        {index === 1 && loaded && (
                            <GUIMount gui={gui.__folders["Audio"].domElement} />
                        )}

                        {index === 2 && loaded && (
                            <GUIMount
                                gui={gui.__folders["Layers"].domElement}
                            />
                        )}
                        {index === 3 && loaded && <Automations gui={gui} />}
                       
                        {index === 4 && loaded && (
                            <GUIMount
                                gui={gui.__folders["Settings"].domElement}
                            />
                        )}

                        {index === 5 && loaded && <Projects loadProject={this.convertAndLoad} gui={gui}></Projects> }
                        {index === 6 && loaded && (
                            <GUIMount
                                gui={gui.__folders["Export"].domElement}
                            />
                        )}
                    </SimpleBar>
                </div>
            </div>
        );
    }
}
