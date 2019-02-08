import React, { PureComponent } from 'react'
import classes from './App.module.scss';
import Sidebar from './sidebar/ControllerContainer'
import withHeader from './header/Header'
import * as dat from '../dat.gui.src'
import Canvas from './canvas/Canvas'
import TrackContainer from './track/TrackContainer';
import ModalContainer from './modal/initialconfigs/SelectResolutionModal';
import Sound from '../audio/Sound'
import Exporter from '../export/Exporter'


import AnimationManager from '../animation/templates/EmptyTemplate'

class App extends PureComponent {

    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.layersFolder       = this.gui.addFolder("Layers", false);
        this.overviewFolder     = this.gui.addFolder("Overview", false);
        this.audioFolder        = this.gui.addFolder("Audio", false);
        this.audioFolder.add(this, "loadNewAudioFile");
        

        this.hideStats = false;
        this.settingsFolder     = this.gui.addFolder("Settings", false);
        this.settingsFolder.add(this, "hideStats").onChange(() => this.canvasRef.current.hideStats(this.hideStats))
        this.exportFolder       = this.gui.addFolder("Export", false);       
        this.state = { audioDuration: 0, audioName: "", time: 0, disabled: true, playing: false, loaded: false };
        this.canvasRef = React.createRef();
        this.modalRef = React.createRef();

        this.firstLoad = true;
    }

    loadNewAudioFile = () =>  {
        this.modalRef.current.onParentSelect = this.onSelect;
        this.modalRef.current.toggleModal(1, true); 
    }

    componentDidMount = () => {
        this.mountRef = this.canvasRef.current.getMountRef();
        this.gui.modalRef = this.modalRef.current;
        this.gui.canvasMountRef = this.mountRef;
    }


    audioReady = (duration) => {
        this.setState({ audioDuration: duration, disabled: false, loaded: true });

        if(this.firstLoad) {
            this.update();
            this.firstLoad = false;
            this.audioFolder.add(this.audio, "fftSize", [1024, 2048, 4096, 8192, 16384]).onChange(() => this.audio.setFFTSize(this.audio.fftSize))
        }
       
    }

    play = () => {
        if(!this.state.playing) {
            this.setState({playing: true});
            this.audio.play(this.state.time);
            this.startTime =  performance.now();
        }else {
            this.stop();
        }
    }

    stop = () => {
        if(this.audio)
            this.audio.stop();
        this.setState({playing: false, time: 0});
    }

    update = () => {
        if(!this.encoding) {
            this.canvasRef.current.begin();
            if(this.state.playing && this.state.time < this.audio.duration) {
                const time = (performance.now() - this.startTime) / 1000;
                this.setState({time});
                const audioData = this.audio.getAudioData(time);
                this.animationManager.update(time, audioData);
            }

            requestAnimationFrame(this.update);
            this.canvasRef.current.end();
        } 
    }

    encoderDone = () => {
        this.encoding = false;
        requestAnimationFrame(this.update);
    }

    encoderReady = () => {
        this.encoding = true;
        this.stop();
        this.exporter.encode();
    }
    startEncoding = (selected) => {
        const config = {
            video: {
                width: this.resolution.width,
                height: this.resolution.height,
                fps: selected.fps,
                bitrate: selected.bitrate,
                preset: selected.preset
            },
            animationManager: this.animationManager,
            duration: this.state.duration,
            sound: this.audio
        }
      
        this.exporter = new Exporter(config, this.encoderReady, this.encoderDone);
    }

    seek = (time) => {
        if(this.state.playing) {
            this.audio.play(time);
        }

        this.startTime =  performance.now() -(time*1000);
        this.setState({time: time});     
    }

    loadNewAudio = (audio) => {
        this.stop();
        this.setState({ disabled: true});
        this.audio = new Sound(audio, this.audioReady);
    }

    onSelect = (selected) => {
        if(!this.resolution) {
            this.resolution = selected;
            this.canvasRef.current.setSize(this.resolution);
            this.modalRef.current.toggleModal(1, true); 
            this.animationManager = new AnimationManager(this.gui, this.resolution);
            return;
        }
        this.loadNewAudio(selected);
    }

    render() {
        const modal = true;
        return (
            <div className={classes.container}>
                {modal && <ModalContainer ref={this.modalRef} onSelect={this.onSelect}></ModalContainer>}

                <div className={classes.leftContainer} >
                    <Sidebar 
                        gui={this.gui} 
                        loaded={this}
                        startEncoding={this.startEncoding}
                    >
                    </Sidebar>
                    <Canvas ref={this.canvasRef}></Canvas>
                </div>
                <div className={classes.rightContainer}>
                    <TrackContainer
                        disabled={this.state.disabled}
                        time={this.state.time}
                        audioDuration={this.state.audioDuration}
                        play={this.play}
                        stop={this.stop}
                        seek={this.seek}
                        playing={this.state.playing}
                        audio={this.audio}
                    >
                    </TrackContainer>
                </div>
            </div>
        )
    }
}


export default withHeader(App);