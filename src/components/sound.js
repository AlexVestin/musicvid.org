



export default class Audio {
    constructor(infile, onfileloaded) {
        if (typeof infile === "string") {
            this.loadFileFromUrl(infile);
        } else {
            this.loadFileFromFile(infile);
        }

        this.onfileready = onfileloaded;
        this.audioCtx = new AudioContext();
        this.analyser = this.audioCtx.createAnalyser();
        this.playing = false;
        this.playBufferSource = this.audioCtx.createBufferSource();
        this.loaded = false;
        this.fftSize = 2048;
        this.analyser.fftSize = this.fftSize;
    }

    play = (time = 0, offset = 0) => {
        
        if(this.playing) {
            this.playBufferSource.stop();
        }

        this.playBufferSource = this.audioCtx.createBufferSource();
        this.playBufferSource.buffer = this.bufferSource.buffer;
        this.playBufferSource.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination);
        this.playBufferSource.start(offset, time);
        this.playing = true;
    }

    getAudioData = () => {
        const halfFftSize = this.fftSize / 2;
        const frequencyData = new Uint8Array(halfFftSize);
        const timeData = new Uint8Array(halfFftSize);
        this.analyser.getByteTimeDomainData(timeData);
        this.analyser.getByteFrequencyData(frequencyData);

        return {timeData, frequencyData}

    }

    stop = () => {
        if(this.playing) {
            this.playBufferSource.stop();
        }
        this.playing = false;
    }

    onload = (ev) => {
        this.audioCtx.decodeAudioData(ev.target.result, (buffer) => {
            this.bufferSource = this.audioCtx.createBufferSource();
            this.bufferSource.buffer = buffer;
            this.duration = buffer.duration;
            this.onfileready(buffer.duration);
        });
    }

    loadFileFromUrl(url) {
        fetch(url).then((response) => {
            return response.blob();
        }).then((blob) => {
            let fileReader = new FileReader();
            fileReader.readAsArrayBuffer(blob);
            fileReader.onload = this.onload;
        }).catch(err => {
            console.log(err)
        })
    }

    loadFileFromFile(file) {
        let fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = this.onload;
        fileReader.onerror = (err) => console.log(err);
    }
}