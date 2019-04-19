const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const Audio = require('./audio')



let time = 0;

const audio = new Audio("./test.mp3");
audio.decodeAudio().then(() => {
    function animate() {
        const done = audio.fourier(time, 16384);
        if(done !== true) {
            time += 1 / 60;
            animate();
        }   
    }
    
    JSDOM.fromFile('./index.html',  { runScripts: "dangerously", resources: 'usable', }).then((dom) => {
        dom.window.onload = () => { animate(dom) };
    });
})



  