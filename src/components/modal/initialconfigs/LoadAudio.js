import React, { PureComponent } from 'react'
import classes from './SelectResolutionModal.module.scss'

const buttonStyle = {
    color: "#eee", 
    fontWeight: 700, 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    alignContent: "center", 
    margin: 20, 
    marginRight: 80, 
    marginLeft:80 , 
    width: 200 
};

const sampleUrl = "https://s3.eu-west-3.amazonaws.com/fysiklabb/De+Lorra+-+Slow+Drip.mp3";


export default class LoadAudio extends PureComponent {

    constructor() {
        super();

        this.state = { expanded: false };

        this.fileRef = React.createRef();
        this.inputRef = React.createRef();
    }

    componentDidMount() {

        this.fileRef.current.onchange = () => {
            this.props.onSelect(this.fileRef.current.files[0]);
        }
    }

    loadAudioFromFile = () => {
        this.fileRef.current.click()
    }

    loadAudioFromURL = (e) => {
        e.stopPropagation();
        this.props.onSelect(this.inputRef.current.value)
    }

    loadSampleAudio = () => {
        this.props.onSelect(sampleUrl)
    }


    render() {
        return (
            <React.Fragment>
                <input accept="audio/*" type="file" ref={this.fileRef} style={{ display: 'none' }} />

                <div className={classes.title}>
                    Choose audiofile
                </div>

                <div className={classes.resolutionBoxContainer}>
                    <div onClick={this.loadAudioFromFile} className={classes.button} style={buttonStyle}>Load from computer</div>
                    <div onClick={this.loadSampleAudio} className={classes.button} style={buttonStyle}>Use sample audio</div>
                </div>

            </React.Fragment>
        )
    }
}
