/**
 * @author alteredq / http://alteredqualia.com/
 */
import { Color } from 'three';
import Pass from "./pass";
export default class RenderPass extends Pass {
    constructor(obj) {
        super();

        this.scene = obj.scene;
        this.camera = obj.camera;

        this.overrideMaterial = obj.overrideMaterial;

        this.clearColor = obj.clearColor;
        this.clearAlpha = obj.clearAlpha !== undefined ? obj.clearAlpha : 0;

        this.clear = true;
        this.clearDepth = false;
        this.needsSwap = false;


        this.clearColor = new Color( 0, 0, 0 );
	    this.clearAlpha = 0;
    }

    __setUpGUI = folder => {
        //this.folder = folder.addFolder("Render pass");
        //this.folder.add(this, "renderToSceen");
        this.addController(folder, this, "renderToScreenInternal").name(
            "Skip fx and render to screen"
        );
    };

    render(renderer, writeBuffer, readBuffer, delta, maskActive) {
        var oldAutoClear = renderer.autoClear;
        renderer.autoClear = false;

        this.scene.overrideMaterial = this.overrideMaterial;

        var oldClearColor, oldClearAlpha;

        if (this.clearColor) {
            oldClearColor = renderer.getClearColor().getHex();
            oldClearAlpha = renderer.getClearAlpha();

            renderer.setClearColor(this.clearColor, this.clearAlpha);
        }

        if (this.clearDepth) {
            renderer.clearDepth();
        }

        renderer.setRenderTarget(this.renderToScreen ? null : readBuffer);

        // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
        if (this.clear)
            renderer.clear(
                renderer.autoClearColor,
                renderer.autoClearDepth,
                renderer.autoClearStencil
            );
        renderer.render(this.scene, this.camera);

        if (this.clearColor) {
            renderer.setClearColor(oldClearColor, oldClearAlpha);
        }

        this.scene.overrideMaterial = null;
        renderer.autoClear = oldAutoClear;
    }
}
