
import Scene from './Scene';
import * as PIXI from 'pixi.js';


export default class CanvasScene extends Scene{
    constructor(gui, resolution, remove, moveScene, renderer) {
        super(gui, resolution, remove, moveScene)
        const canvas = renderer.domElement

        this.renderer = new PIXI.autoDetectRenderer({ 
            antialias: true, 
            context: renderer.context,
            transparent: true,
            resolution: 1,
            view: canvas,
            width: canvas.width,
            height: canvas.height
        });
        this.controls = {};

        this.graphics = new PIXI.Graphics();
        this.container = new PIXI.Container();
        
        this.MODAL_REF_NR = 22;
        this.type = "pixi";
        if(this.folder) {
            this.folder.name = "PIXI scene";
        }  

        this.canvas = canvas;
    }

    update = (time, dt, audioData, shouldIncrement) => {
       this.items.forEach(item => {
           item.update(time, dt, audioData, shouldIncrement)
       });
    }

    render = (renderer) => {
        renderer.state.reset();
        renderer.setRenderTarget (null);
        this.renderer.reset();
        this.renderer.render(this.container, undefined, false);
        
        this.renderer.reset();
        renderer.clearDepth();
    }
}