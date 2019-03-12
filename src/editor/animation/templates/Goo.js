

import Manager from '../Manager'
import { initQuad, createTexture, makeProgram } from '../shaders/CommonFunctions'
import SHADERS from '../shaders/Goo'

export default class Man extends Manager {

    setUpRenderers = () => {
        this.gl = this.internalCanvas.getContext("webgl2");
        if(!this.gl) {
            alert("webgl2 not supported in this browser");
        }
    }

    setUpScene() {    
      const { gl } = this;    

      const prog1 = makeProgram(gl, SHADERS.fsA, 1280, 720, { });
      const prog2 = makeProgram(gl, SHADERS.fsB, 1280, 720, { iChannel0: "t" });
      const prog3 = makeProgram(gl, SHADERS.fsC, 1280, 720, { iChannel0: "t" });

      this.program1 = { positions: prog1.positions, program: prog1.program, vp:  gl.getAttribLocation(prog1.program, 'aVertexPosition') };
      this.program2 = { positions: prog2.positions, program: prog2.program };
      this.program3 = { positions: prog3.positions, program: prog3.program };
    
      this.texProg2Chan0 = gl.getUniformLocation(this.program2.program, "iChannel0");
      this.texProg3Chan0 = gl.getUniformLocation(this.program3.program, "iChannel0");

      this.quad = initQuad(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.vertexAttribPointer(this.program1.vp,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray( this.program1.vp);

      this.rTarget1 = createTexture(gl, 1280, 720);
      this.rTarget2 = createTexture(gl, 1280, 720);
      this.cTarget = createTexture(gl, 1280, 720);

      gl.viewport(0, 0, 1280, 720);
      this.frame = 0;

      fetch("https://www.shadertoy.com/api/v1/shaders/3ssXRB?key=ftrKwh").then(json => json.json()).then(console.log)
    }   

    stop = () => { }

    update = (time, audioData) => {
        const { gl } = this;
        gl.clearColor(0.0, 0.0, 0.0, 1.0); 
        gl.clearDepth(1.0);                 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
         
        // FIRST RENDER -----------------------------------------------------------
        gl.useProgram(this.program1.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTarget1.fbo);
        gl.uniform1f(this.program1.positions.iTime, time);
        gl.uniform1i(this.program1.positions.iFrame, this.frame);
        gl.viewport(0, 0, 1280, 720);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        
        // SECOND RENDER -----------------------------------------------------------
        gl.useProgram(this.program2.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTarget2.fbo);
        gl.uniform1f(this.program2.positions.iTime, time);
        gl.uniform1i(this.program2.positions.iFrame, this.frame);
       
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,  this.rTarget1.texture);
        gl.uniform1i(this.texProg2Chan0, 0);

        gl.clearColor(1, 1, 1, 1);   // clear to white
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, 1280, 720);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        // THIRD RENDER ---------------------------------------------------------------------
        gl.useProgram(this.program3.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.uniform1f(this.program3.positions.iTime, time);
        gl.uniform1i(this.program3.positions.iFrame, this.frame);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.rTarget2.texture);
        gl.uniform1i(this.texProg3Chan0, 0);
        
        gl.clearColor(1, 1, 1, 1);   // clear to white
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, 1280, 720);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        

        this.frame++;
        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }
}