const decode = require('audio-decode');
var fs = require('fs');

const KissFFT = require('./KissFFT')

class Audio {
    constructor(filename) {
        this.buffer = fs.readFileSync(filename);
        this.duration = -1;
        this.sampleRate = -1;
        this.audioBuffer = []; 
        this.fftSize = 16384;
        this.loadFft();
    }

    loadFft() {
        this.Module = {};
        KissFFT(this.Module);
        this.Module["onRuntimeInitialized"] = () => {
            this.Module._init_r(this.fftSize);
            this.moduleLoaded = true;
            console.log("audio loaded")
        };
    };

    decodeAudio() {
        return new Promise((resolve, reject) => {
            decode(this.buffer).then(audioBuffer => {
                this.duration = audioBuffer.length / audioBuffer.sampleRate;
                const bufLength = audioBuffer.length;
                this.sampleRate = audioBuffer.sampleRate;
                this.audioBuffer = new Float32Array(bufLength);
            
                const nrChannels = audioBuffer._channelData.length
                for(var i = 0; i < bufLength; i++)  {
                    let sum = 0;
                    for(var j = 0; j < nrChannels; j++) {
                        sum += audioBuffer._channelData[j][i];
                    }
            
                    this.audioBuffer[i] = sum / nrChannels;
                }
            
                console.log("audio decode done")
                resolve();
            }, reject );
            
        })
    }

    fourier(time) {
        if(time > this.duration) 
            return true;

        let idx = Math.floor(this.sampleRate * time);
        const audioData = this.audioBuffer.slice(idx, idx+this.fftSize);
        if (idx < 0) idx = 0;
        let audio_p, bins, buf_p;
        const data = audioData.subarray(idx, idx + this.fftSize);

        try {
            audio_p = this.Module._malloc(this.fftSize * 4);
            this.Module.HEAPF32.set(data, audio_p >> 2);

            buf_p = this.Module._fft_r(audio_p, this.fftSize, 2);
            bins = new Float32Array(
                this.Module.HEAPU8.buffer,
                buf_p,
                this.fftSize / 2
            );
        } finally {
            this.Module._free(audio_p);
            this.Module._free(buf_p);
        }

        return { frequencyData: bins, timeData: data };
    };
}


module.exports = Audio;

