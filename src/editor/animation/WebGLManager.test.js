import WebGLManager from './WebGLManager'
import { items } from './items';
import { passes } from './postprocessing/passes';

import * as dat from "../dat.gui.src";

const resolution = { width: 1280, height: 720 };

describe('Animation Manager Basics', () => {
    let manager = {};
    beforeEach(() => {
        const gui = new dat.GUI({ autoPlace: false });
        gui.addFolder('Layers');
        gui.addFolder('Settings');
        gui.addFolder('Audio');
        gui.addFolder('Export');

        manager =  new WebGLManager({gui}); 
        manager.init(resolution, true);
    })

    it('Redos render without crashing', () => {
        manager.redoUpdate();
    });

    it('Adds ortho scene without crashing', () => {
        expect(manager.scenes.length).toEqual(0);
        manager.addSceneFromText('ortho');
        expect(manager.scenes.length).toEqual(1);
    }) 

    it('Adds perspective scene without crashing', () => {
        expect(manager.scenes.length).toEqual(0);
        manager.addSceneFromText('perspective');
        expect(manager.scenes.length).toEqual(1);
    }) 

    it('Adds canvas scene without crashing', () => {
        expect(manager.scenes.length).toEqual(0);
        manager.addSceneFromText('canvas');
        expect(manager.scenes.length).toEqual(1);
    }); 

    it('Adds and removes scenes without crashing', () => {
        const subFolders = manager.layersFolder.__folders;
        const scene1 = manager.addSceneFromText('canvas');
        expect(manager.scenes.length).toEqual(1);
        expect(Object.keys(subFolders).length).toEqual(1);
        const scene2 = manager.addSceneFromText('ortho');
        expect(manager.scenes.length).toEqual(2);
        expect(Object.keys(subFolders).length).toEqual(2);
        scene1.removeMe();
        expect(manager.scenes.length).toEqual(1);
        expect(Object.keys(subFolders).length).toEqual(1);
        scene2.removeMe();
        expect(manager.scenes.length).toEqual(0);
        expect(Object.keys(subFolders).length).toEqual(0);
    }); 

    it('Adds and item to scene without crashing', () => {
        const scene1 = manager.addSceneFromText('canvas');
        scene1.addItemFromText("JSNation");
        expect(scene1.items.length).toEqual(1);
        expect(Object.keys(scene1.itemsFolder.__folders).length).toEqual(1);
    }); 

    it('Removes item from scene without crashing', () => {
        const scene1 = manager.addSceneFromText('canvas');
        const item = scene1.addItemFromText("JSNation");
        scene1.removeItem({item});
        expect(scene1.items.length).toEqual(0);
        expect(Object.keys(scene1.itemsFolder.__folders).length).toEqual(0);
    }); 

    it('Loads all items without crashing', () => {
        const sceneLoopUp = [
            manager.addSceneFromText('canvas'),
            manager.addSceneFromText('ortho'),
            manager.addSceneFromText('perspective')
        ]

        items.forEach((sceneItems, i) => {
            Object.keys(sceneItems).forEach(itemKey => {
                sceneLoopUp[i].addItemFromText(itemKey);
                manager.redoUpdate();
            })
        })
    })

    it('Loads all passes without crashing', () => {
        Object.keys(passes).forEach(key => {
            //manager.postProcessing.addEffectPass(key);
            manager.redoUpdate();
        })
    })
});
