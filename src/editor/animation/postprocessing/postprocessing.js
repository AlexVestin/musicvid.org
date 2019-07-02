

import EffectComposer from './effectcomposer'
import { loadPassFromText } from './passes'
import RenderPass from './passes/renderpass'

export default class PostProcessing {
    constructor(width, height, info) {
        this.width = width;
        this.height = height;

        const { renderer, gui, addEffect, moveItem, removeItem } = info;
        this.removeItem = removeItem;
        this.gui = gui;
        this.moveItem = moveItem;
        this.addEffectToManager = addEffect;
        this.effectComposer = new EffectComposer(renderer)
        this.passes = [];
    }

    addEffect = () => {
        const ref = this.gui.getRoot().modalRef;
        ref.toggleModal(15).then(selected => {
            if(selected)
                this.addEffectPass(selected);
        })
    }

    remove = (pass, index) => {
        this.effectComposer.passes.splice(index, 1);
        this.passes.splice(index, 1);   

    }

    addRenderPass = (obj) => {
        const renderPass = new RenderPass(obj);
        obj.pass = renderPass;
        this.effectComposer.addPass(renderPass);
        this.passes.push(obj);   
    }

    update = (time, dt, audioData, shouldIncrement) => {
        this.passes.forEach( e =>  {
            e.applyAutomations(shouldIncrement)
            e.update(time, dt, audioData, shouldIncrement)
        });
    }

    move = (from, to, pass) => {
        let obj = pass;
        if(pass.isScene) {
            obj = pass.pass;
        }
        this.passes.splice(from, 1);
        this.passes.splice(to, 0, obj);

        this.effectComposer.passes.splice(from, 1);
        this.effectComposer.passes.splice(to, 0, obj);
    }

    render = () => {

        this.effectComposer.render()
    }

 
    addEffectPass = (type) =>  {
        var fx = loadPassFromText(type);
        fx.__moveItem = this.moveItem;
        fx.removeMe = () =>  this.removeItem({scene: fx, undoAction: false });
        this.passes.push(fx);
        fx.__gui = this.gui;
        fx.setUpGUI(this.gui);
        this.effectComposer.addPass(fx);     
        this.addEffectToManager(fx); 
        return fx;
    }

    removeEffect = (config) =>  {
        this.effectComposer.removePass(config);
        this.effectComposer.passes[this.effectComposer.passes.length - 1].renderToScreen = true
    }
}