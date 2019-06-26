import React, { PureComponent } from "react";
import Typography from "../../modules/components/Typography";
import LayoutBody from "../../modules/components/LayoutBody";
import classes from "./AudioTheory.module.css";
import Sound from "editor/audio/Sound";
import {Link} from 'react-router-dom'
import impactSettings from './impactsettings.PNG'
import * as dat from 'editor/dat.gui.src';
import Mount from './Mount'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'


export default class AudioImpact extends PureComponent {
    constructor() {
        super();

        this.frequencyCanvasRef = React.createRef();
        this.impactCanvasRef = React.createRef();
        this.timeCanvasRef = React.createRef();

        this.fftSize = 16384;
        this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
        this.analyser = new ImpactAnalyser(this.gui, null, true, true);
        this.analyser.folder.open();
    }

    setSize = () => {
        if(!this.unmounting) {
            this.frequencyCanvasRef.current.width = this.frequencyCanvasRef.current.clientWidth;  
            this.frequencyCanvasRef.current.height = this.frequencyCanvasRef.current.clientHeight;  

            this.impactCanvasRef.current.width = this.impactCanvasRef.current.clientWidth;  
            this.impactCanvasRef.current.height = this.impactCanvasRef.current.clientHeight;  
        }
       
    }

    componentWillUnmount() {
        this.unmounting = true;
        this.audio.stop();
    }

    componentDidMount() {
        const url =
            "https://s3.eu-west-3.amazonaws.com/fysiklabb/Reverie.mp3";
        this.audio = new Sound(url, null, console.log);
        this.audio.load().then(() => {
            this.int = requestAnimationFrame(this.update);
            this.setSize();
            this.gui.open();
        });
    }

    setfftSize = e => {
        const val = e.target.value;
        this.fftSize = val;
        this.audio.setFFTSize(val);
    };

    play = () => {
        if (!this.playing) {
            this.audio.play();
            this.playing = true;
            this.startTime = performance.now();
        }
    };

    stop = () => {
        this.playing = false;
        this.audio.stop();
        const { width, height } = this.frequencyCanvasRef.current;
        this.frequencyCanvasRef.current.getContext("2d").clearRect(0,0, width, height);
    };


    updateImpactCanvas = (time, audioData) => {
        const c = this.impactCanvasRef.current.getContext("2d");
        const {width,height} = this.impactCanvasRef.current;

        const halfHeight = height / 2;
        const dy = 15;

        const amp = this.analyser.analyse(audioData.frequencyData);
        c.fillStyle = "black";
        c.clearRect(0,0,width,height);
        c.fillRect(0, halfHeight - dy, Math.floor(amp * 20), dy*2);
        c.fillText(amp, 10, 10);

    }
   

    updateFreqencyCanvas = (time, audioData) => {
        
        const c = this.frequencyCanvasRef.current.getContext("2d");
        const { width, height } = this.frequencyCanvasRef.current;
        c.clearRect(0, 0, width, height);
        const fd = audioData.frequencyData;

        c.strokeStyle = "black";
        c.fillStyle = "white";

        c.beginPath();
        c.moveTo(0, 0);

        for (var i = 0; i < fd.length; i++) {
            const x = (i / fd.length) * width;
            const y = height - fd[i];
            c.lineTo(x, y);
            c.moveTo( ((i / fd.length) * width) + 1, 0);
        }

      

        c.stroke();
        c.fillText(`${fd.length} nr of samples`, width -100, 10);
        if(this.analyser.startBin < this.analyser.endBin) {
            
            c.strokeStyle = "blue";
            c.beginPath();
            const sx = Math.floor( (this.analyser.startBin/fd.length) * width);
            c.moveTo( sx, 0);
            c.lineTo(sx, height);
            c.stroke();
            c.strokeStyle ="red";
            const ex = Math.floor( (this.analyser.endBin/fd.length) * width);
            c.beginPath();
            c.moveTo( ex, 0);
            c.lineTo(ex, height);
            c.stroke();

            c.globalAlpha = 0.2;
            c.fillStyle = "green";
            c.fillRect(sx, 0, ex-sx, height);
            c.globalAlpha = 1.0;
        }
    }


    update = () => {
        if(!this.unmounting) {
            const t = (performance.now() - this.startTime) / 1000;
            if (this.playing && t < this.audio.duration ) {
        
                const data = this.audio.getAudioData(t);
                this.updateFreqencyCanvas(t, data);
                this.updateImpactCanvas(t, data);

            }
    
            requestAnimationFrame(this.update);
        }
        
    };

    render() {
        return (
            <LayoutBody margin marginBottom>
                 <div style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                    <Link to="/tutorial/audio_analysers/theory">{"< Theory"}</Link>
                    <Link to="/tutorial/audio_analysers/spectrum">Spectrum Analyser ></Link>
                </div>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Impact Analyser
                </Typography>

               
                <Typography
                        style={{ marginTop: 40 }}
                        component="h4"
                        variant="h4"

                    >
                        Introduction
                </Typography>

                <Typography>
                    The impact analyser is pretty cool since it is usable as an <a href="/tutorial/automations">automation</a>. 
                    This means that almost any number value can be automated using the impact analyser. But what is the impact analyser?

                    <br/> 
                    <br/> 
                    The impact analyser averages up the strength of frequencies given a <b>bin</b> range. It also has settings
                    to smooth and clamp the value. Below are two template projects that use the impact analyser to make the speed
                    impact reactive.

                    <div style={{marginTop: 30, display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                        <div style={{display:"flex", flexDirection: "column",alignItems: "center"}}>
                            
                        <video style={{width: 774/3, height: 430/3}} loop autoPlay muted>
                            <source type="video/mp4" data-reactid=".0.1.0.0.0" src="/nodes.mp4" ></source>    
                        </video>  
                        <i>The Universe Within by BigWings</i>
                        </div>

                        <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                            
                            <video style={{width: 774/3, height: 430/3}} loop autoPlay muted> 
                                <source type="video/mp4" data-reactid=".0.1.0.0.0" src="/ring.mp4" ></source>    
                            </video>
                            <i>Electric Noise by Stormoid</i>
                        </div>  
                    </div>

                    <div style={{marginTop: 15}}>
                        This page will focus on the settings that can be used to tweak the impact analyser.
                    </div>
                </Typography>


                <Typography
                        style={{ marginTop: 15 }}
                        component="h4"
                        variant="h4"
                        
                    >
                        Settings
                </Typography>

                <div style={{width: "100%", alignItems: "center", display: "flex", justifyContent: "center", marginTop: 20}}>
                    <img src={impactSettings} alt="Audio impact analyser settings"></img>
                </div>
               

                <div className={classes.container}>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                         Above is an image of the settings in the imapct analyser. We'll start with the top level controllers
                        and work our way down.
                       

                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        startBin & endBin
                    </Typography>

                    <Typography
                        className={classes.item}
                    >
                        The <i>startBin</i> is the lower end of the range of bins, and <i>endBin</i> is the upper end of the range.
                        The analyser averages the values of the bins in the range from the <i>startBin</i> to the <i>endBin</i>. 
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        baseAmount & enableImpactAnlysis
                    </Typography>
                    <Typography
                        className={classes.item}
                    >
                        Deselecting <i>enableImpactAnalysis</i> turns off the impact analyser for debugging purposes,
                        instead using the <i>baseAmount</i> value.
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        Amplitude
                    </Typography>
                    <Typography>
                        Amount to multiply the averaged value by. Internally divided by 1024 to keep numbers in a better scale. 
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        Clamping - maxAmount, minAmount & minThreshold
                    </Typography>

                    <Typography>
                        <i>maxAmount</i> - The maximum value the analyser can have, sets the value to the given value if analyser value goes above.<br/>
                        <i>minAmount</i> - The miimnum value the analyser can have, sets the value to the given value if analyser value goes below.<br/>
                        <i>minThreshold</i> - A minimum value the analyser needs to reach, sets analyser to 0 if not reached.<br/>
                    </Typography>


                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h6"
                        variant="h6"
                    >
                        Smoothing - useDeltaSmoothing, minDeltaNeededToTrigger & deltaDecay
                    </Typography>

                    <Typography>
                        Smoothing compares the current value of the analyser with its previous value, to enable more smooth
                        animation. These values are scaled with the amplitude and don't represent an exact value. 
                        <div style={{marginTop: 10, marginBottom: 10}}>
                            <i>useDeltaSmoothing</i> - Bypasses smoothing if not checked. <br/>
                            <i>minDeltaNeededToTrigger</i> - Minimum positive delta needed from previous value to allow new value, otherwise decay with deltaDecay. <i>(multiplied with amplitude to keep scale)</i><br/>
                            <i>deltaDecay</i> - Amount to decay with. <i>(multiplied with amplitude to keep scale)</i> <br/>
                        </div>

                    </Typography>

                    <Typography
                        variant="h3"
                        gutterBottom
                        marked="center"
                        align="center"
                        style={{ marginTop: 50 }}
                    >
                        Demo
                    </Typography>

                    <Typography
                        style={{ marginTop: 15, marginBottom: 15 }}
                        className={classes.item}
                    >
                         
                    </Typography>


                    <Typography>

                        <div>
                            <button onClick={this.play}>play</button>
                            <button onClick={this.stop}>stop</button>
                        </div>

                        <div>
                            window size:
                            <select onChange={this.setfftSize}>
                                <option>16384</option>
                                <option>8192</option>
                                <option>4096</option>
                                <option>2048</option>
                            </select>
                        </div>

                        <Mount height={240}  gui={this.gui.__folders["Audio Impact Analysis Settings"]}></Mount>

                        <canvas
                        style={{border: "1px solid gray", width: "100%", height: 300}}
                        ref={this.frequencyCanvasRef}
                        />

                        
                        <canvas
                            style={{border: "1px solid gray", width: "100%", height: 120}}
                            ref={this.impactCanvasRef}
                        />
                    </Typography>

   
                </div>

             
              

                <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h4"
                        variant="h4"

                    >
                        next
                        </Typography>

                    <Typography
                        style={{ marginTop: 15, marginBottom: 15 }}
                        className={classes.item}
                    >
                       Up next is the spectrum analyser where we use the frequency data to generate an impact value
                       which can be used to animate items.  
                        
                        <div style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                       <Link to="/tutorial/audio_analysers/theory">Previous tutorial</Link>
                       <Link to="/tutorial/audio_analysers/impact">Next tutorial</Link>
                       </div>
                    </Typography>


            </LayoutBody>
        );
    }
}
