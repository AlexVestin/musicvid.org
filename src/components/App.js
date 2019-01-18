import React, { PureComponent } from 'react'
import classes from './App.module.css';
import Sidebar from './sidebar/ControllerContainer'
import withHeader from './header/Header'
import * as dat from 'dat.gui'
import Canvas from './canvas/Canvas'
import TrackContainer from './track/TrackContainer';
import SelectResolutionModal from './modal/initialconfigs/SelectResolutionModal';
import Sound from './sound'
import AnimationManager from './animation/Manager'

class App extends PureComponent {

    constructor() {
        super();
        this.gui = new dat.GUI({ autoPlace: false });
        this.state = { audioDuration: 0, audioName: "", time: 0, disabled: true }
        this.canvasRef = React.createRef();
        this.update();
    }


    audioReady = (duration) => {
        this.setState({ audioDuration: duration, disabled: false });
        this.animationManager = new AnimationManager(this.canvasRef.current.getMountRef(), this.configurations.resolution);
    }

    play = () => {
        this.playing = true;
        this.lastUpdate = performance.now();
        this.audio.play(this.state.time);
        this.update();
    }

    stop = () => {
        this.audio.stop();
        this.playing = false;
    }

    update = () => {
        if(this.playing) {
            const dt = (performance.now() - this.lastUpdate) / 1000;
            this.setState({time: this.state.time + dt})
            const audioData = this.audio.getAudioData();
            this.animationManager.update(this.state.time + dt, audioData)
        }

        this.lastUpdate = performance.now();
        setTimeout(this.update, 16);
    }

    seek = (time) => {
        if(this.playing) {
            this.audio.play(time)
        }

        this.setState({time: time})     
        this.lastUpdate = performance.now()   
    }

    onSelect = (configurations) => {
        this.configurations = configurations;
        this.audio = new Sound(configurations.audio, this.audioReady)
        this.canvasRef.current.setSize(configurations.resolution)
    }

    render() {
        return (
            <div className={classes.container}>
                <SelectResolutionModal onSelect={this.onSelect}></SelectResolutionModal>

                <div className={classes.topContainer} >
                    <Sidebar gui={this.gui}></Sidebar>
                </div>
                <div className={classes.botContainer}>
                    <Canvas ref={this.canvasRef}></Canvas>
                    <TrackContainer
                        disabled={this.state.disabled}
                        time={this.state.time}
                        audioDuration={this.state.audioDuration}
                        play={this.play}
                        stop={this.stop}
                        seek={this.seek}
                    >
                    </TrackContainer>
                </div>
            </div>
        )
    }
}


export default withHeader(App);