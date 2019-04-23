import KissFFT from "./KissFFT";

export default class Audio {
    constructor(infile, gui, onprogress) {
        this.infile = infile;
        this.audioCtx = new AudioContext();
        this.playing = false;
        this.playBufferSource = this.audioCtx.createBufferSource();
        this.loaded = false;
        this.fftSize = 2048 * 8;
        
        this.volume = 1;
        this.storedVolume = 1;
        this.muted = false;
        this.exportWindowSize = 2048;
        this.exportFrameIdx = 0;
        this.gui = gui;
        this.onProgress = onprogress;
        this.loadFft();
    }

    load = () => {
        return new Promise( (resolve, reject) => {
            this.onfileready = resolve;
            if (typeof this.infile === "string") {
                this.loadFileFromUrl(this.infile);
            } else {
                this.loadFileFromFile(this.infile);
            }
        })
    }

    loadFft = () => {
        this.Module = {};
        KissFFT(this.Module);
        this.Module["onRuntimeInitialized"] = () => {
            this.Module._init_r(this.fftSize);
            this.moduleLoaded = true;
        };
    };

    setFFTSize = fftSize => {
        this.fftSize = Number(fftSize);
        if(this.moduleLoaded) {
            this.Module._init_r(this.fftSize);
            this.gui.updateDisplay();
        }
        
    };

    getEncodingFrame = () => {
        const sidx = this.exportFrameIdx * this.exportWindowSize;
        const eidx = (this.exportFrameIdx + 1) * this.exportWindowSize;

        const left = this.bufferSource.buffer
            .getChannelData(0)
            .slice(sidx, eidx);
        const right = this.bufferSource.buffer
            .getChannelData(1)
            .slice(sidx, eidx);
        this.exportFrameIdx++;
        return { type: "audio", left, right, sampleRate: this.sampleRate };
    };

    // VOLUME FROM [0..1]
    setVolume = volume => {
        if (this.gainNode)
            this.gainNode.gain.setValueAtTime(
                volume,
                this.audioCtx.currentTime
            );
        this.volume = volume;
    };

    play = (time = 0, offset = 0) => {
        if (this.playing) {
            this.playBufferSource.stop();
        }
        this.playBufferSource = this.audioCtx.createBufferSource();
        this.playBufferSource.buffer = this.bufferSource.buffer;
        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = this.volume;
        this.playBufferSource.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.playBufferSource.start(offset, time);
        this.playing = true;
    };

    getAudioByteData = buffer => {
        this.combinedAudioData = new Float32Array(buffer.length);

        const leftAudio = buffer.getChannelData(0);
        if(buffer.numberOfChannels === 1) {
            this.combinedAudioData = leftAudio;
            return;
        }
        
        const rightAudio = buffer.getChannelData(1);
        for (var i = 0; i < buffer.length; i++) {
            this.combinedAudioData[i] = (leftAudio[i] + rightAudio[i]) / 2;
        }
    };

    toggleMuted = () => {
        this.muted =  !this.muted;
        if(this.muted) {
            this.storedVolume = this.volume;
            this.setVolume(0);
        }else {
            this.setVolume(this.storedVolume);
        }

        
    }

    getAudioData = time => {
        const halfWindowSize = this.fftSize / 2;
        let idx = Math.floor(time * this.bufferSource.buffer.sampleRate);
        if (idx < 0) idx = 0;
        let audio_p, bins, buf_p;
        const data = this.combinedAudioData.subarray(idx, idx + this.fftSize);

        try {
            audio_p = this.Module._malloc(this.fftSize * 4);
            this.Module.HEAPF32.set(data, audio_p >> 2);

            buf_p = this.Module._fft_r(audio_p, this.fftSize, 2);
            bins = new Float32Array(
                this.Module.HEAPU8.buffer,
                buf_p,
                halfWindowSize
            );
        } finally {
            this.Module._free(audio_p);
            this.Module._free(buf_p);
        }

        return { frequencyData: bins, timeData: data };
    };
    stop = () => {
        if (this.playing) {
            this.playBufferSource.stop();
        }
        this.playing = false;
    };

    onload = ev => {
        this.audioCtx.decodeAudioData(ev.target.result).then(buffer => {
            this.bufferSource = this.audioCtx.createBufferSource();
            this.bufferSource.buffer = buffer;
            this.duration = buffer.duration;
            this.sampleRate = buffer.sampleRate;
            this.onProgress(0.99);
            this.getAudioByteData(buffer);
            this.onfileready(buffer.duration);
        });
    };

    loadFileFromUrl(url) {
        var oReq = new XMLHttpRequest();
        oReq.open("GET", url);
        oReq.responseType = "arraybuffer";
        oReq.onload = () => {
            var blob = oReq.response; // Note: not oReq.responseText
            if (blob) {
                this.onload({target: {result: blob}})
            }
        };

        oReq.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                const percentComplete = event.loaded / event.total;
                this.onProgress(Math.max(percentComplete-0.02, 0));
              }
        });

        oReq.send();

        /*
        fetch(url)
            .then(response => {
                return response.blob();
            })
            .then(blob => {
                let fileReader = new FileReader();
                fileReader.readAsArrayBuffer(blob);
                fileReader.onload = this.onload;
            })
            .catch(err => {
                console.log(err);
            });
            */
    }

    loadFileFromFile(file) {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = this.onload;
        fileReader.onerror = err => console.log(err);
        fileReader.onprogress = (event) => {
            if (event.lengthComputable) {
                const percentComplete = event.loaded / event.total;
                this.onProgress(Math.max(percentComplete-0.02, 0));
              }
        };
    }
}
