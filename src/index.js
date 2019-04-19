/*import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Modal from 'react-modal'
import App from './App'

import 'simplebar'; // or "import SimpleBar from 'simplebar';" if you want to use it manually.
import 'simplebar/dist/simplebar.css';

Modal.setAppElement('#root')
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
*/

import WebGLManager from './editor/animation/WebGLManager';
const template = {
    fps: 60,
    items: {
        0: {type: "JSNation", configurations: 161616},
        1: {type: "Background", configurations: 171717},
        2: {type: "Particles", configurations: 181818}
        
    },
    scenes: [
        {type: 'ortho', configurations: 141414, items: [1]},
        {type: 'perspective', configurations: 141414, items: [2]},
        {type: 'canvas', configurations: 131313, items: [0]},

    ],
    configurations: {
        "131313": {},
        "141414": {},
        "151515": {},
        "161616": {},
        "171717": {},
        "181818": {},
    }
}

let canvas, manager;
function initCanvas() {
    canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    //ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
}

function initScenes() {
    manager = new WebGLManager({canvasMountRef: canvas});
    manager.init({width: 1280, height: 720}, false);

    template.scenes.forEach(scene => {
        const s = manager.addSceneFromText(scene.type);
        scene.items.forEach(id => {
            s.addItemFromText(template.items[id].type);
        })
    });
}

window.__draw = (time, audioData) => {
    manager.update(time, audioData, true); 
    window.__addImageData(manager.readPixels());
};

initCanvas();
initScenes();

window.__test = ":D";
