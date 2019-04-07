

import Manager from '../Manager'
import { initQuad, createTexture, makeProgram } from '../shaders/CommonFunctions'
import SHADERS from '../shaders/licensed/Filaments'
import ImpactAnalyser from '../../audio/ImpactAnalyser'

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
      const res = {w: 1280, h: 720};
      const prog1 = makeProgram(gl, SHADERS.fsA, WIDTH, HEIGHT, { iChannel0: { type: "t", res}});
      const prog2 = makeProgram(gl, SHADERS.fsB, WIDTH, HEIGHT, { iChannel0: { type: "t", res} }, true);

      this.program1 = { positions: prog1.positions, program: prog1.program, vp:  gl.getAttribLocation(prog1.program, 'aVertexPosition') };
      this.program2 = { positions: prog2.positions, program: prog2.program };
    
      this.texProg1Chan0 = gl.getUniformLocation(this.program1.program, "iChannel0");
      this.texProg2Chan0 = gl.getUniformLocation(this.program2.program, "iChannel0");
      

      this.quad = initQuad(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.vertexAttribPointer(this.program1.vp,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray( this.program1.vp);
      gl.useProgram(this.program1.program);

      this.nWavePos  = gl.getUniformLocation(this.program1.program, "nWavePos");
      this.fftPos  = gl.getUniformLocation(this.program1.program, "fft");
      this.rTargets1 = [createTexture(gl, WIDTH, HEIGHT), createTexture(gl, WIDTH, HEIGHT)];

      this.frame = 0;
      this.iTime = 0;
      this.iFrame = 0;

      gl.getExtension('EXT_color_buffer_float');
      gl.getExtension("OES_texture_float_linear");
      gl.getExtension("OES_texture_half_float_linear");
      gl.getExtension("EXT_texture_filter_anisotropic")

  
      this.impactAnalyser = new ImpactAnalyser(this.gui);
      this.baseSpeed = 0.2;
      this.movementAmplitude = 0.2;
      this.moveToAudioImpact = true;

    }   

    stop = () => { 
      const {gl} = this;
      this.time = 0;
      this.iTime = 0;
      this.lastTime = 0;
      this.frame = 0;
      this.iFrame = 0;
      gl.clearColor(0.0, 0.0, 0.0, 0); 
      gl.clearDepth(1.0);                 
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);

      this.rTargets1.forEach((rt) => {
        gl.bindTexture(gl.TEXTURE_2D, rt.texture);
        gl.texImage2D(gl.TEXTURE_2D, this.level, gl.RGBA32F, rt.width, rt.height, 0, gl.RGBA, gl.FLOAT, null);
      })

    }

    setTime = (time) => {
      this.lastTime = time;
    }

    update = (time, audioData) => {
      const { gl } = this;
      let iFrame = this.frame; 
      let iTime = time;

      const fft = audioData.frequencyData[ Math.floor( audioData.frequencyData.length * 0.75 ) ];
      const nWave = audioData.frequencyData[ Math.floor( audioData.frequencyData.length * 0.25 ) ];


        gl.clearColor(0.0, 0.0, 0.0, 0); 
        gl.clearDepth(1.0);                 
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
         
        // FIRST RENDER -----------------------------------------------------------
        gl.useProgram(this.program1.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTargets1[0].fbo);
        gl.uniform1f(this.program1.positions.iTime, iTime);
        gl.uniform1i(this.program1.positions.iFrame, iFrame);
        gl.uniform1f(this.fftPos, fft);
        gl.uniform1f(this.nWavePos, nWave);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.rTargets1[1].texture);
        gl.uniform1i(this.texProg1Chan0, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        //gl.bindTexture(gl.TEXTURE_2D, this.cTarget2.texture);
        //gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1280, 720, 0);
        
        // THIRD RENDER ---------------------------------------------------------------------
        gl.useProgram(this.program3.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.uniform1f(this.program3.positions.iTime, iTime);
        gl.uniform1i(this.program3.positions.iFrame, iFrame);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.rTargets2[0].texture);
        gl.uniform1i(this.texProg3Chan0, 0);
        
        gl.clearColor(0, 0, 0, 0);   // clear to white
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0, 0, 1280, 720);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        this.rTargets1.reverse();

        this.frame++;
        this.lastTime  = time; 
        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }
}