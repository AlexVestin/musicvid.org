import React, { PureComponent } from "react";
import Typography from "../../modules/components/Typography";
import LayoutBody from "../../modules/components/LayoutBody";
import classes from "./AudioTheory.module.css";
import Sound from "editor/audio/Sound";
import {Link} from 'react-router-dom'
import eq from './eq.PNG';
import * as dat from 'editor/dat.gui.src';
import Mount from './Mount'
import SpectrumAnalyser from 'editor/audio/SpectrumAnalyser';
import { transformToVisualBins } from 'editor/audio/analyse_functions'
export default class AudioTheory extends PureComponent {
    constructor() {
        super();

        this.frequencyCanvasRef = React.createRef();
        this.combineCanvasRef = React.createRef();

        this.gui = new dat.GUI({ autoPlace: false, width: "50%" });
        this.analyser = new SpectrumAnalyser(this.gui, null, true);
        this.gui.__folders["General settings"].open();

        this.fftSize = 16384;
    }

    setSize = () => {
        if(!this.unmounting) {
            this.frequencyCanvasRef.current.width = this.frequencyCanvasRef.current.clientWidth;  
            this.frequencyCanvasRef.current.height = this.frequencyCanvasRef.current.clientHeight;  

            this.combineCanvasRef.current.width = this.combineCanvasRef.current.clientWidth;  
            this.combineCanvasRef.current.height = this.combineCanvasRef.current.clientHeight; 
        }
    }

    componentDidMount() {
        const url =
            "https://fysiklabb.s3.eu-west-3.amazonaws.com/shortrev.wav";
        this.audio = new Sound(url, null, console.log);
        this.audio.load().then(() => {
            this.int = requestAnimationFrame(this.update);
            this.setSize();
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


    updateAveraged = (data) => {
        const c = this.averageCanvasRef.current;
        const  {width, height} = c;
        const ctx = c.getContext("2d");
        for(let i = 0; i < data.length; i++) {

        }
    }

    componentWillUnmount() {
        this.unmounting = true;
        this.audio.stop();
    }


    updateFreqencyCanvas = (time, audioData, bins) => {
        const c = this.frequencyCanvasRef.current.getContext("2d");
        const { width, height } = this.frequencyCanvasRef.current;
        c.clearRect(0, 0, width, height);
        const fd = audioData.frequencyData;

        c.strokeStyle = "black";
        c.fillStyle = "white";

        c.beginPath();
        c.moveTo(0, 0);

        const start = this.analyser.spectrumStart; 
        const end = this.analyser.spectrumEnd;
        const length  = end - start;

        for (var i = 0; i < length; i++) {
            const x = (i / length) * width;
            const y = height - fd[i + start];
            c.moveTo(x, height);
            c.lineTo(x, y);
        }

        c.stroke();
        c.fillText(`${length} nr of samples`, width -100, 10);

        c.beginPath();
        c.strokeStyle = "green";

        const { spectrumSize, spectrumScale, spectrumStart, spectrumEnd, mult, spectrumHeight } = this.analyser;
        if(spectrumStart >= spectrumEnd || spectrumStart < 0)     {
            return;
        }
            
        const e = Math.min(fd.length, spectrumEnd);    
        const s = Math.max(0, spectrumStart);

        const cc = this.combineCanvasRef.current.getContext("2d");
        const cwidth = this.combineCanvasRef.current.width;
        const cheight = this.combineCanvasRef.current.height;

        cc.fillStyle="black";
        cc.clearRect(0,0,cwidth,cheight);
        const b = [];

        for(let i = 0; i < spectrumSize; i++) {
            
            var bin = Math.pow(i / spectrumSize, spectrumScale) * (e - s) + s;
            const x = (bin / length) * width;

            let val =  fd[Math.floor(bin) + s] * (bin % 1) + fd[Math.floor(bin + 1) + s] * (1 - (bin % 1));
        
            if (!val) {
                val = 0;
            } 

            val *= spectrumHeight;
            b.push({bin, x, val});
        }

        let w = Math.floor(cwidth / spectrumSize);
        w = Math.max(1, w);
        b.forEach( (item, i) => {
            
            c.moveTo(item.x, 0);
            c.lineTo(item.x, height);

            
            cc.fillRect(Math.floor( (i / b.length) * cwidth), cheight, 5, -item.val / (8*280) )
        })
        c.stroke();

    }

    updateTimeCanvas = (time, audioData) => {
        const c = this.timeCanvasRef.current.getContext("2d");
        const { width, height } = this.timeCanvasRef.current;
        c.clearRect(0, 0, width, height);
        const fd = audioData.timeData;

        const halfHeight = height / 2;
        c.strokeStyle = "black";
        c.beginPath();
        c.moveTo(0, halfHeight);

        for (var i = 0; i < fd.length; i++) {
            const x = (i / fd.length) * width;
            const y = fd[i] * 40 + halfHeight;
            c.lineTo(x, y);
        }

        c.stroke();
        c.fillText(`${fd.length} nr of samples`, width -100, 10);
    };

    update = () => {
        if(!this.unmounting) {
            const t = (performance.now() - this.startTime) / 1000;
            if (this.playing && t < this.audio.duration ) {
        
                const data = this.audio.getAudioData(t);
                //this.updateWindow(t);
                //this.updateTimeCanvas(t, data);
                this.analyser.enableToWebAudioForm = false;
                this.analyser.enableCombineBins = false;
                this.analyser.enableNormalizeTransform = false;
                this.analyser.enableAverageTransform = false;
                this.analyser.enableTailTransform = false;
                this.analyser.enableSmoothingTransform = false;
                this.analyser.enableExponentialTransform = false;
                const freqs = this.analyser.analyse(data.frequencyData);
                const bins = transformToVisualBins(freqs, this.analyser);
                this.updateFreqencyCanvas(t, data, bins);
            }

            requestAnimationFrame(this.update);
     }
    };

    render() {
        return (
            <LayoutBody margin marginBottom>
                 <div style={{width: "100%", display: "flex", justifyContent: "flex-start", flexDirection: "row"}}>
                    <Link to="/tutorial/audio_analysers/impact">{"< Impact Analyser"}</Link>
                </div>
                <Typography
                    variant="h3"
                    gutterBottom
                    marked="center"
                    align="center"
                >
                    Spectrum Analyser
                </Typography>
                <Typography
                        style={{ marginTop: 40 }}
                        component="h4"
                        variant="h4"

                    >
                        Introduction
                </Typography>

                <Typography>
                    The spectrum analyser is in my opinion the more interesting of the two analysers since it allows for more advanced
                    visualizers. This analyser is almost entirely built from functions in Caseifs Vis.js project. 

                    <div style={{marginTop: 30, display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                        <div style={{display:"flex", flexDirection: "column",alignItems: "center"}}>
                            
                        <video style={{width: 264, height: 106}} loop autoPlay muted>
                            <source type="video/mp4" data-reactid=".0.1.0.0.0" src="/spec.mp4" ></source>    
                        </video>  
                        <i>JSNation by Caseif and Incept</i>
                        </div>

                        <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                            
                            <video loop autoPlay muted> 
                                <source type="video/mp4" data-reactid=".0.1.0.0.0" src="/bars.mp4" ></source>    
                            </video>
                            <i>Monstercat visualizer by Caseif and Incept</i>
                        </div>  
                    </div>

                    <div style={{marginTop: 15}}>
                        There are seven transforms and some general settings that are configurable in the spectrum analyser, and we'll go through them 
                        one by one.
                    </div>


                </Typography>


                <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                        General Settings
                </Typography>

                <Typography>
                    Here can the size, height of the spectrum be configured. These will make more sense in the combineBins description
                    a bit down.
                    <div className={classes.grid}>

                        <div>spectrumSize</div>
                        <div>The number of values we use from the frequency bins.</div>
                        <div>shouldCapHeight</div>
                        <div>If checked caps the height of a ouput spectrum bar.</div>
                        <div>spectrumHeight</div>
                        <div>Amount to mulitply each spectrum bar with.</div>
                        <div>spectrumScale</div>
                        <div>Scale the spectrum to grab more values from lower frequencies</div>
                    </div>

                </Typography>



                <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                        1. toWebAudioTransform
                </Typography>

                <Typography className={classes.item}>
                    This transform is used since this website doesn't use the Web Audio API analyser,it helps
                    to keep the transformation for the editor in line with other projects on the web. 
                    <div className={classes.grid}>

                        <div>smoothingTimeConstant</div>
                        <div>Represents the averaging constant with the last analysis frame. <a href="https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/smoothingTimeConstant">link</a></div>
                        <div>minDecibel</div>
                        <div>Minimum power value in the scaling range for the FFT analysis data. <a href="https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/minDecibels">link</a></div>
                        <div>maxDecibel</div>
                        <div>Maximum power value in the scaling range for the FFT analysis data. <a href="https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/maxDecibels">link</a></div>
                    </div>

                </Typography>


                <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       2. combineBins
                </Typography>


                <Typography className={classes.item}>
                    We don't want to use all the thousands of bins that the analyser spits when it transforms 
                    the audio data to frequency data. Instead we pick out <i>spectrumSize</i> number of bins 
                    from these. How we pick these values is determined by the <i>spectrumStart, spectrumEnd & 
                    spectrumScale</i>.

                    <div style={{marginTop: 20}}>
                    A linear representation doesn't look as good as a logarithmic. What does that mean?
                    if we look at FL Studio 12's Fruity Parametric EQ 2:
                    </div>

                    <div style={{width: "100%", display: "flex", justifyContent:"center"}}>
                        <img src={eq} alt="Parametric EQ"/>  
                    </div>
                    <div style={{marginTop: 15}}>
                    we can see that the bottom 500Hz of frequencies take up more space than 
                    the rest of the 19000+ frequencies. This is because it is using a logarithmic 
                    scale, which is more closely matched to our perception of the sound spectrum. 
                     
                    </div>

                    <Typography style={{marginTop: 10}}>
                    
                        I put together a demo to showcase how the bins are chosen from the range. 
                        Below is the frequency data, but note that it only displays the bins from <i>spectrumStart</i>
                        to <i>spectrumEnd</i>. A green line represents which bins are grabbed to be used.
                    </Typography>
                    <div style={{marginTop: 15, marginBot: 10}}>
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
                    <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%"}}>
                        <Mount width="33%" gui={this.gui.__folders["General settings"]}></Mount>
                        <canvas style={{width: "66%", height: 400}} ref={this.frequencyCanvasRef}/>
                    </div>

                    <Typography style={{marginTop: 30}} variant="h6" component="h6">
                        Which results in:
                    </Typography> 

                    <canvas style={{width: "100%", height: 200, border: "1px solid gray"}} ref={this.combineCanvasRef}/>
            

                </Typography>



                <div className={classes.container}>
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        And we already have something that looks a lot better. An important thing to note is to 
                        remember to scale the <i>spectrumStart</i> and <i>spectrumEnd</i> with the window size. 
                        
                        <br/>
                        <br/>


                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       3. enableNormalizeTransform
                    </Typography>

                 
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        This transform only scales the values of the bin with the spectrumHeight and a constant. <i> value = value * spectrumHeight / 255</i> 
                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       4. enableAverageTransform
                    </Typography>

                 
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        Averages the bin with the previous and next bin value. No controllers are attached to this transform.

                    </Typography>
                    

                    <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       5. enableTailTransform
                    </Typography>

                 
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        Transforms the start and end of the spectrum to fade to 0 for a more smooth looking visualizer.

                        <div className={classes.grid}>

                            <div>headMargin</div>
                            <div>Number of bins at the start of the spectrum to smooth.</div>
                            <div>tailMargin</div>
                            <div>Number of bins at the end of the spectrum to smooth</div>
                            <div>minMarginWeight</div>
                            <div>Minimum multiplier for the bins in <i>headMargin</i> or <i>tailMargin</i> </div>
                            <div>marginDecay</div>
                            <div>Logarithmic value of how much to decay with when getting closer to the edges.</div>
                            <div>headMarginSlope</div>
                            <div>Constant value to decay with for bins in <i>headMargin</i></div>
                            <div>tailMarginSlope</div>
                            <div>Constant value to decay with for bins in <i>tailMargin</i></div>
                    </div>

                    <i>value *= marginSlope * nrBinsFromEdge<sup>marginDecay</sup> + minMarginWeight;</i>

                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       6. enableExponentialTransform
                    </Typography>

                 
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        Exponentially transforms the values of the bins. 
                        Creates a logarithmic ramp from spectrumMaxExponent to spectrumMinComponent,
                        and then raises the (value[i] / <i>spectrumHeight</i>)<sup>ramp[i]</sup>. So in this case, a 
                        high value of ramp[i] makes the result smaller.

                        <br/>
                        <br/>
                        This means that a high <i>spectrumMaxComponent</i> will transform low to mid frequencies lower,
                        a high <i>spectrumMinComponent</i> will transform mid to high frequencies lower.

                        The <i>spectrumExponentScale</i> logarithmically scales the ramp.  



                        <div className={classes.grid}>

                            <div>spectrumMaxExponent</div>
                            <div>Maximum exponent to transform bins with. Mostly affects lower frequencies. </div>
                            <div>spectrumMinExponent</div>
                            <div>Minimum exponent to transform bins with. Mostly affects higher frequencies.</div>
                            <div>spectrumExponentScale</div>
                            <div>Logarithmically scales the ramp, similar to how the spectrumScale works in the combineBins transform.</div>
    
                    </div>

                    </Typography>

                    <Typography
                        style={{ marginTop: 15 }}
                        component="h6"
                        variant="h6"
                        
                    >
                       7. enableSmoothingTransform
                    </Typography>

                 
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                    >
                        <div className={classes.grid}>
                            <div>smoothingPasses</div>
                            <div>Number of smoothing passes performed.</div>
                            <div>smooothingPoints</div>
                            <div>How many bins wide we want to smooth with for each pass.</div>
              
                        </div>

                    </Typography>
                   

                    
                    <Typography
                        style={{ marginTop: 15 }}
                        className={classes.item}
                        component="h4"
                        variant="h4"

                    >
                        Demo
                        </Typography>

                    <Typography
                        style={{ marginTop: 15, marginBottom: 15 }}
                        className={classes.item}
                    >
                        Below is a demonstration of of how the windowing looks.
                        The red line is the playback time and the blue area is the
                        window containing the samples extracted. In the next part we 
                        will go over how to use the frequency data in an impact analyser.
                    </Typography>


                    <div
                    style={{
                        width: "100%",
                        margin: 20,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
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
                </div>

                    
                </div>

                <Typography
                    style={{ marginTop: 15 }}
                    className={classes.item}
                    component="h4"
                    variant="h4"

                >
                    Summary
                    </Typography>

                <Typography
                    style={{ marginTop: 15, marginBottom: 15 }}
                    className={classes.item}
                >
                    This concludes the tutorial series on the audio analysers. If you feel that there is still something that is unclear
                    don't hesitate to message me any questions or suggestions.
                    
                    <div style={{width: "100%", display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
                <Link to="/tutorial/audio_analysers/impact">Previous tutorial</Link>
                </div>
                </Typography>


            </LayoutBody>
        );
    }
}
