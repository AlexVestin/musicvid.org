

import Manager from '../Manager'
import { initQuad, createTexture, makeProgram } from '../shaders/CommonFunctions'
import SHADERS from '../shaders/OutrunTheRain'


const WIDTH = 1280;
const HEIGHT = 720;


export default class Man extends Manager {

    setUpRenderers = () => {
        this.gl = this.internalCanvas.getContext("webgl2");
        if(!this.gl) {
            alert("webgl2 not supported in this browser");
        }
    }

    setUpScene() {    
      const { gl } = this;    
      const prog1 = makeProgram(gl, SHADERS.fsA, WIDTH, HEIGHT, { iChannel0: { type: "t", res: { w: WIDTH, h: HEIGHT }} }, false);
      const prog2 = makeProgram(gl, SHADERS.fsB, WIDTH, HEIGHT, { iChannel0: {type: "t", res: { w: WIDTH, h: HEIGHT }} }, true);

      this.program1 = { positions: prog1.positions, program: prog1.program, vp:  gl.getAttribLocation(prog1.program, 'aVertexPosition') };
      this.program2 = { positions: prog2.positions, program: prog2.program };

      this.texProg1Chan0 = gl.getUniformLocation(this.program1.program, "iChannel0");
      this.texProg2Chan0 = gl.getUniformLocation(this.program2.program, "iChannel0");

      this.quad = initQuad(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.vertexAttribPointer(this.program1.vp,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray( this.program1.vp);


      this.rTargets1 = [createTexture(gl, WIDTH, HEIGHT), createTexture(gl, WIDTH, HEIGHT)];

      this.frame = 0;
      this.lastTime = 0;
      gl.viewport(0, 0, WIDTH, HEIGHT);

      //fetch("https://www.shadertoy.com/api/v1/shaders/3ssXRB?key=ftrKwh").then(json => json.json()).then(console.log)
      
      gl.getExtension('EXT_color_buffer_float');
      gl.getExtension("OES_texture_float_linear");
      gl.getExtension("OES_texture_half_float_linear");
      gl.getExtension("EXT_texture_filter_anisotropic")


    }   

    setProgram(gl, program, time) {
        gl.useProgram(program.program);    
        gl.uniform1f(program.positions.iTime, time);
        gl.uniform1i(program.positions.iFrame, this.frame);
        gl.uniform1f(program.positions.iTimeDelta, time - this.lastTime);
    }

    clear(gl) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    }

    setTexture(gl, tex, location, spot) {
        gl.activeTexture(gl.TEXTURE0 + spot);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i( location, spot);
    }

    stop = () => { }

    update = (time, audioData) => {
        const { gl } = this;
        
         
        // FIRST RENDER -----------------------------------------------------------
        this.setProgram(gl, this.program1, time);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTargets1[0].fbo);
        this.setTexture(gl, this.rTargets1[1].texture, this.texProg1Chan0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);                                                                                                                                                                  
        
        // THIRD RENDER ---------------------------------------------------------------------
        this.setProgram(gl, this.program2, time);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.setTexture(gl, this.rTargets1[0].texture, this.texProg2Chan0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        
        this.rTargets1.reverse();
        this.frame++;
        this.lastTime = time;

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }
}