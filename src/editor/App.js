import React, { PureComponent } from "react";
import classes from "./App.module.scss";
import Sidebar from "./components/sidebar/ControllerContainer";
import withHeader from "./components/header/Header";
import * as dat from "./dat.gui.src";
import Canvas from "./components/canvas/Canvas";
import TrackContainer from "./components/track/TrackContainer";
import ModalContainer from "./components/modal/ModalContainer";
import Sound from "./audio/Sound";
import Exporter from "./export/CopiedExporter";
import license from "./util/License";
import ExportScreen from "./components/Export";
import LinearProgress from "@material-ui/core/LinearProgress";
import { base } from 'backend/firebase';
import { connect } from "react-redux";
import WaveCanvas from "./WaveCanvas";
import OverviewgGroup from "./OverviewGroup";

class App extends PureComponent {
    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.overviewFolder = this.gui.addFolder("Overview", false);
        this.overviewFolder.add(this, "addFolderToOverview").name("Add group").disableAll();
        
        this.layersFolder = this.gui.addFolder("Layers", false);
        this.audioFolder = this.gui.addFolder("Audio", false);
        this.audioFolder.add(this, "loadNewAudioFile");
        this.settingsFolder = this.gui.addFolder("Settings", false);      
        this.exportFolder = this.gui.addFolder("Export", false);
        this.state = {
            shouldLoadProject: false,
            videoLoaded: false,
            audioLoaded: false,
            audioDuration: 0,
            time: 0,
            playing: false,
            loaded: false,
            progress: 0,
            encoding: false,
            doneEncoding: false,
        };
       
        this.firstLoad = true;
        this.fastLoad = false;
        this.timeOffset = 0;

        this.trackRef = React.createRef();
        this.canvasRef = React.createRef();
        this.modalRef = React.createRef();
        this.audioWaveCanvasRef = React.createRef();
    }

    addFolderToOverview = () => {
        new OverviewgGroup(this.overviewFolder);
    }

    loadNewAudioFile = () => {
        return this.modalRef.current.toggleModal(1, true).then(this.onSelect);
    };


    async loadProject(uid){
        return await base.collection("projects").doc(uid).get();
    }


    initFromProjectFile = (projectFile) => {
        this.resolution = {width: projectFile.width, height: projectFile.height};
        this.canvasRef.current.setSize(this.resolution);
        this.animationManager.init(this.resolution);
        this.animationManager.loadProject(projectFile);
        this.loadNewAudioFile();
        this.setState({shouldLoadProject: false});
    }

    async componentWillReceiveProps(props) {
        if(!props.authFetching && this.state.shouldLoadProject) {
            const url = new URL(window.location.href);
            const project = url.searchParams.get("project");
            let projectFile = await this.loadProject(project);
            this.initFromProjectFile(projectFile.data());
        }
    }

    componentDidMount = async () => {
        if (!this.fastLoad) {
            window.onbeforeunload = function(event) {
                // do stuff here
                event.returnValue =
                    "If you leave this page you will lose your unsaved changes.";
                return "If you leave this page you will lose your unsaved changes.";
            };
        }

        this.gui.modalRef = this.modalRef.current;
        this.gui.canvasMountRef = this.canvasRef.current.getMountRef();

        const url = new URL(window.location.href);
        const template = url.searchParams.get("template") || "EmptyTemplate";
        const project = url.searchParams.get("project");
        let projectFile;
       
        import("./animation/templates/" + template + ".js")
            .then(async AnimationManager  =>  {
                this.animationManager = new AnimationManager.default(this);
                this.update();
                this.setState({ videoLoaded: true });

                if(project && !this.props.authFetching) {
                    projectFile = await this.loadProject(project);
                    this.initFromProjectFile(projectFile.data());
                }else if(project && this.props.authFetching) {
                    this.setState({shouldLoadProject: true});
                }else {
                    this.modalRef.current.toggleModal(0).then(this.onSelect);
                }
            })
    };

    toggleMuted = () => {
        this.audio.toggleMuted();
    }

    audioReady = duration => {
        if (this.firstLoad) {
            this.audioFolder
                .add(this.audio, "fftSize", [1024, 2048, 4096, 8192, 16384])
                .onChange(() => this.audio.setFFTSize(this.audio.fftSize));
            this.firstLoad = false;
        }
        if(duration > 8*60) {
            this.modalRef.current.toggleModal(10)
        }

        this.audioWaveCanvasRef.current.generateAudioWave(this.audio.combinedAudioData);

        this.animationManager.setAudio(this.audio);
        this.setState({ audioDuration: duration, audioLoaded: true });
    };

    play = () => {
        if (!this.state.playing) {
            this.setState({ playing: true });
            const t = this.time;
            this.audio.play(t);
            this.gui.__time = t;
            this.startTime = performance.now();
            if (this.animationManager) this.animationManager.play(t);
        } else {    
            this.timeOffset = this.time;
            this.setState({ playing: false });
            this.audio.stop();
        }
    };

    componentWillUnmount() {
        this.stop();
    }

    stop = () => {
        if (this.audio) this.audio.stop();
        if (this.animationManager) this.animationManager.stop();
        this.time = 0;
        this.setState({ playing: false });
        if (this.trackRef.current) {
            this.trackRef.current.setTime(this.time);
        }
        
        
        this.timeOffset = 0;
        this.gui.__time = 0;
        
    };


    applyAutomation = (time, audioData) => {
        const root = this.gui.getRoot();
        const automations = Object.keys(root.__automations).map(key => root.__automations[key]);
        automations.forEach(item => {
            item.update(time, audioData);    
        });
    }

    update = () => {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;

        if (!disabled && (this.canvasRef.current !== null)) {
            this.canvasRef.current.begin();
            
            let time, audioData;
            if (this.state.playing && this.time < this.audio.duration) {
                time = (performance.now() - this.startTime) / 1000 + this.timeOffset;
                audioData = this.audio.getAudioData(time);

                this.trackRef.current.setTime(time);
                //this.setState({ time });
                this.gui.__time = time;
                this.time = time;

                this.applyAutomation(time, audioData);
                this.animationManager.update(time, audioData, true);
            }else {
                this.animationManager.redoUpdate();
                if(this.time >= this.audio.duration && this.state.playing) {
                    this.play();
                }
            }     
            
            this.canvasRef.current.end();
        }


        if(!this.encoding)
            requestAnimationFrame(this.update);
    };

    encoderDone = (file, fileName) => {
        this.file = file;
        this.setState({doneEncoding: true, fileName: fileName})
    };

    cancelEncoder = () => {
        this.exporter.cancel();
        this.animationManager.cancelEncoding();
        this.setState({ encoding: false, doneEncoding: false }, () => {
            this.encoding = false;
            this.stop();
            this.exporter = null;
            this.update();
            this.audio.exportFrameIdx = 0;
            

            this.canvasRef.current.setSize(this.resolution);
            this.gui.canvasMountRef = this.canvasRef.current.getMountRef();
            this.animationManager.refresh( this.gui.canvasMountRef)
        });
     
    };

    encoderReady = () => {
        this.encoding = true;
        this.stop();

        this.exporter.prepare();
        this.exporter.encode();
        this.setState({ encoding: true });
    };

    onProgress = (current, max) => {
        this.setState({ progress: current / max });
    };

    onAudioProgress = e => {
        this.setState({ progress: e });
    };

    startEncoding = selected => {

        let duration = this.state.audioDuration;
        if(selected.useCustomTimeRange) {
            if(selected.startTime < 0 || selected.endTime > duration) {
                alert("Error: Cant before 0 sec or after audio duration length");
                return;
            }else if(selected.startTime >= selected.endTime) {
                alert("Error: selected start time is bigger or uqual to the end time");
                return;
            }
        }

        this.checkLicense().then(() => {
            
            const config = {
                video: {
                    width: this.resolution.width,
                    height: this.resolution.height,
                    fps: selected.fps,
                    bitrate: selected.bitrate,
                    presetIdx: selected.preset
                },
                fileName: selected.fileName,
                animationManager: this.animationManager,
                duration: duration,
                sound: this.audio,
                gui: this.gui,
                startTime: selected.startTime,
                endTime: selected.endTime,
                useCustomTimeRange: selected.useCustomTimeRange
            };
    
            this.exporter = new Exporter(
                config,
                this.encoderDone,
                this.onProgress
            );

            this.animationManager.prepareEncoding();
            this.exporter.init(this.encoderReady);
            this.encoding = true; 
        });
    };

    seek = time => {
        this.timeOffset = time;
        this.startTime  = performance.now();
        if (this.state.playing) {
            this.audio.play(time);
        }

        this.animationManager.seekTime(time);
        this.trackRef.current.setTime(time);
        
        this.gui.__time = time;
        this.setState({ time: time });
    };

    loadNewAudio = audio => {
        this.stop();
        this.setState({ audioLoaded: false });
        this.audio = new Sound(audio, this.audioFolder, this.onAudioProgress);
        return this.audio.load();
    };

    onSelect = selected => {
        if (!this.resolution) {
            this.resolution = selected;
            this.modalRef.current.toggleModal(1, true).then(this.onSelect);
            this.canvasRef.current.setSize(this.resolution);
            this.animationManager.init(this.resolution);
            
            return;
        }

        
        this.usingSampleAudio = selected === "https://s3.eu-west-3.amazonaws.com/fysiklabb/Reverie.mp3";
        this.loadNewAudio(selected).then(this.audioReady);
        
    };

    checkLicense = () => {
        return new Promise((resolve, reject) => {
            const items = this.animationManager.getAllItems();
            this.__items = items;
            let attribFound = false;
            items.forEach(item => {
                if (item.license === license.REQUIRE_ATTRIBUTION) {
                    this.modalRef.current.openLicenseModal(
                        items,
                        this.usingSampleAudio,
                        resolve,
                        reject
                    );
                    attribFound = true;
                }
            });

            if (!attribFound) resolve();
        });
    };
    render() {
        const disabled = !this.state.audioLoaded || !this.state.videoLoaded;
        const { progress, fileName } = this.state;

        const loadProject = this.animationManager ? this.animationManager.loadProject : null;

        return (
            <div className={classes.container}>
                {
                    <ModalContainer
                        ref={this.modalRef}
                        onSelect={this.onSelect}
                        gui={this.gui}
                    />
                }

                {this.state.encoding ? (
                    <ExportScreen
                        encoding={this.state.doneEncoding}
                        cancel={this.cancelEncoder}
                        progress={progress}
                        blobFile={this.file}
                        fileName={fileName}
                        items={this.__items}
                        usingSampleAudio={this.usingSampleAudio}
                    />
                ) : (
                    <React.Fragment>
                        {disabled && (
                            <LinearProgress
                                style={{
                                    position: "absolute",
                                    top: 5,
                                    width: "100%",
                                    opacity: 1 - progress / 2
                                }}
                                color="secondary"
                                variant="determinate"
                                value={progress * 100}
                            />
                        )}

                        <div className={classes.leftContainer}>
                            <Sidebar
                                gui={this.gui}
                                startEncoding={this.startEncoding}
                                checkLicense={this.checkLicense}
                                disabled={disabled}
                                loaded={this.state.videoLoaded}
                                firstLoad={this.firstLoad}
                                loadProject={loadProject}
                            />
                            <Canvas ref={this.canvasRef} />
                        </div>
                        <div className={classes.rightContainer}>
                            <TrackContainer
                                disabled={disabled}
                                audioDuration={this.state.audioDuration}
                                play={this.play}
                                stop={this.stop}
                                seek={this.seek}
                                playing={this.state.playing}
                                audio={this.audio}
                                canvas={this.audioWaveCanvas}
                                toggleMuted={this.toggleMuted}
                                ref={this.trackRef}
                            >
                            <WaveCanvas ref={this.audioWaveCanvasRef} classes={classes}></WaveCanvas>
                                
                            </TrackContainer>
                        </div>
                    </React.Fragment>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        authFetching:  state.auth.fetching
    }
}


export default connect(mapStateToProps)( withHeader(App));
