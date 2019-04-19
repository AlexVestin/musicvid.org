const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const { spawn } = require('child_process');
const Audio = require('./audio')

//const proc = spawn('ffmpeg', ['-pix_fmt', 'rgb32', '-s:v', '1280x720', '-f', 'rawvideo', '-i', 'pipe:0', '-framerate', '30', 'output.mp4']);

const proc = spawn('ffmpeg', ['-y', '-pix_fmt', 'rgb32', '-s:v', '1280x720', '-f', 'rawvideo', '-i', '-', '-r', '60', '-c:v', 'libx264', 'output.mp4']);
proc.stdout.on('data', function(data) {
    console.log(data.toString()); 
});

proc.stderr.on('data', function(data) {
    console.log(data.toString()); 
});

console.log("Decoding audio");
const audio = new Audio('./test.mp3')
audio.decodeAudio().then(() => {
    function addData(data, index) {
        const buffer = Buffer.from(data);

        if(proc.stdin.writable) {
            proc.stdin.write(buffer);
        } else {
            console.log("Error: process closed");
        }
    }

    function animate(dom) {
        const window = dom.window;
        window.__addImageData = addData;
        for(var i = 0; i < 200; i++) {
            window.__draw(i);
            if(i % 20 === 0) console.log("--",i);
        }
        proc.stdin.end();
    }


    JSDOM.fromFile('../build/index.html',  { runScripts: "dangerously", resources: 'usable', }).then((dom) => {
        dom.window.onload = () => { animate(dom) };
    });
})




  