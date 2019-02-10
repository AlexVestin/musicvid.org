import KissFFT from "./KissFFT";

export default class Audio {
    constructor(infile, onfileloaded, gui) {
        if (typeof infile === "string") {
            this.loadFileFromUrl(infile);
        } else {
            this.loadFileFromFile(infile);
        }

        this.onfileready = onfileloaded;
        this.audioCtx = new AudioContext();
        this.playing = false;
        this.playBufferSource = this.audioCtx.createBufferSource();
        this.loaded = false;
        this.fftSize = 2048 * 8;
        this.volume = 0;
        this.exportWindowSize = 2048;
        this.exportFrameIdx = 0;
        this.gui = gui;
        this.loadFft();
    }

    loadFft = () => {
        this.Module = {};
        KissFFT(this.Module);
        this.Module["onRuntimeInitialized"] = () => {
            this.Module._init_r(this.fftSize);
        };
    };

    setFFTSize = ( fftSize ) => {
        this.fftSize = Number(fftSize);
        this.Module._init_r(this.fftSize);
        this.gui.updateDisplay();
    }

    getEncodingFrame = () => {
        const sidx = this.exportFrameIdx * this.exportWindowSize;
        const eidx = (this.exportFrameIdx + 1) * this.exportWindowSize;

        const left = this.bufferSource.buffer.getChannelData(0).slice(sidx, eidx);
        const right = this.bufferSource.buffer.getChannelData(1).slice(sidx, eidx);
        this.exportFrameIdx++;
        return {type: "audio", left, right, sampleRate: this.sampleRate }
    }

    // VOLUME FROM [0..1]
    setVolume = (volume) => {
        if(this.gainNode)
            this.gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
        this.volume = volume;
    }


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
        const rightAudio = buffer.getChannelData(1);
        for (var i = 0; i < buffer.length; i++) {
            this.combinedAudioData[i] = (leftAudio[i] + rightAudio[i]) / 2;
        }
    };

    getAudioData = time => {
        const halfWindowSize = this.fftSize / 2;
        let idx = Math.floor(time * this.bufferSource.buffer.sampleRate);
        if (idx < 0) idx = 0;
        let audio_p, bins;
        const data = this.combinedAudioData.subarray(idx, idx + this.fftSize);

        try {
            audio_p = this.Module._malloc(this.fftSize * 4);
            this.Module.HEAPF32.set(data, audio_p >> 2);

            const buf_p = this.Module._fft_r(audio_p, this.fftSize, 2);
            bins = new Float32Array(
                this.Module.HEAPU8.buffer,
                buf_p,
                halfWindowSize
            );
        } finally {
            this.Module._free(audio_p);
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
        this.audioCtx.decodeAudioData(ev.target.result, buffer => {
            this.bufferSource = this.audioCtx.createBufferSource();
            this.bufferSource.buffer = buffer;
            this.duration = buffer.duration;
            this.sampleRate = buffer.sampleRate;

            this.getAudioByteData(buffer);
            this.onfileready(buffer.duration);
        });
    };

    loadFileFromUrl(url) {
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
    }

    loadFileFromFile(file) {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = this.onload;
        fileReader.onerror = err => console.log(err);
    }
}
