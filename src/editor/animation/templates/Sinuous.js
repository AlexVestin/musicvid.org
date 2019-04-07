

import Manager from '../Manager'
import { initQuad, loadTextureFromImage, createTexture, makeProgram, makeTextureProgram } from '../shaders/CommonFunctions'
import SHADERS from '../shaders/licensed/Sinuous'
import ImpactAnalyser from '../../audio/ImpactAnalyser'
import AttribItemGL from '../items/ortho/AttributionGL'
import LICENSE from '../../util/License'

export default class Man extends Manager {

    setUpRenderers = () => {
        this.gl = this.internalCanvas.getContext("webgl2");
        if(!this.gl) {
            alert("webgl2 not supported in this browser");
        }
    }

    updateAttribution = () => {
      this.gl.useProgram(this.program3.program);
      this.gl.uniform1i(this.attribEnabledLoc, this.drawAttribution);
    }

    setUpScene() {    
      const { gl } = this;    

      this.drawAttribution = false;
      this.gui.__folders["Settings"].add(this, "drawAttribution").onChange(this.updateAttribution);
      const res = { w: this.width, h: this.height };
      const prog1 = makeProgram(gl, SHADERS.fsA, res.w, res.h, { iChannel0: { type: "t", res}, iChannel1: {type: "t", res }});
      const prog2 = makeProgram(gl, SHADERS.fsB, res.w, res.h, { iChannel0: { type: "t", res}, iChannel1: { type: "t", res} });
      const prog3 = makeProgram(gl, SHADERS.fsC, res.w, res.h, { iChannel0: { type: "t", res} }, true);

      this.program1 = { positions: prog1.positions, program: prog1.program, vp:  gl.getAttribLocation(prog1.program, 'aVertexPosition') };
      this.program2 = { positions: prog2.positions, program: prog2.program };
      this.program3 = { positions: prog3.positions, program: prog3.program };


      this.attribProgram = makeTextureProgram(gl);
      this.attribItem = new AttribItemGL(gl, res.w, res.h, "nmz (@stormoid)");
      this.drawAttribution = true;

      const p1 = loadTextureFromImage(gl, 'img/rgb.png');
      Promise.all([p1]).then((values) => {
        this.tex1 = values[0];
        this.texProg1Chan0 = gl.getUniformLocation(this.program1.program, "iChannel0");
        this.texProg1Chan1 = gl.getUniformLocation(this.program1.program, "iChannel1");
        this.texProg2Chan0 = gl.getUniformLocation(this.program2.program, "iChannel0");
        this.texProg2Chan1 = gl.getUniformLocation(this.program2.program, "iChannel1");
        this.texProg3Chan0 = gl.getUniformLocation(this.program3.program, "iChannel0");
        this.attribLoc     = gl.getUniformLocation(this.program3.program, "tex1");
        this.attribEnabledLoc     = gl.getUniformLocation(this.program3.program, "drawAttrib");

      })

      this.quad = initQuad(gl);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.quad);
      gl.vertexAttribPointer(this.program1.vp,2,gl.FLOAT,false,0,0);
      gl.enableVertexAttribArray( this.program1.vp);

      
      gl.useProgram(this.program1.program);
      this.movAmpPos  = gl.getUniformLocation(this.program1.program, "movementAmplitude");
      this.rTargets1 = [createTexture(gl, res.w, res.h), createTexture(gl, res.w, res.h)];
      this.rTargets2 = [createTexture(gl, res.w, res.h), createTexture(gl, res.w, res.h)];

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

      this.scenes = [ { items: [{__attribution: {
        showAttribution: true,
        name:"Sinuous",
        authors: [
            {
                name: "nmz (@stormoid)", 
                social1: {type: "website", url: "http://stormoid.com/"},
                social2: {type: "twitter", url: "https://twitter.com/stormoid"},
            },
        ],
        projectUrl: "https://www.shadertoy.com/view/ldlXRS",
        description: "",
        license: LICENSE.REQUIRE_ATTRIBUTION,
        changeDisclaimer: true,
        imageUrl: "img/templates/Sinuous.png"
    }}]}]

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

      this.rTargets2.forEach((rt) => {
        gl.bindTexture(gl.TEXTURE_2D, rt.texture);
        gl.texImage2D(gl.TEXTURE_2D, this.level, gl.RGBA32F, rt.width, rt.height, 0, gl.RGBA, gl.FLOAT, null);
      })

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    setTime = (time) => {
      this.lastTime = time;
    }

    update = (time, audioData) => {
      const { gl } = this;
      let iFrame = this.frame; 
      let iTime = time;
      //gl.enable(gl.BLEND);
      //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      //gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);


                         
        // FIRST RENDER -----------------------------------------------------------
        gl.useProgram(this.program1.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTargets1[0].fbo);
        gl.uniform1f(this.program1.positions.iTime, iTime);
        gl.uniform1i(this.program1.positions.iFrame, iFrame);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.rTargets1[1].texture);
        gl.uniform1i(this.texProg1Chan0, 0);                                                                                                                                                                          

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.tex1);
        gl.uniform1i(this.texProg1Chan1, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        //gl.bindTexture(gl.TEXTURE_2D, this.cTarget1.texture);
        //gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, 1280, 720, 0);

        // SECOND FKIN RENDER -----------------------------------------------------------
        gl.useProgram(this.program2.program);     
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.rTargets2[0].fbo);
        gl.uniform1f(this.program2.positions.iTime, iTime);
        gl.uniform1i(this.program2.positions.iFrame, iFrame);
       
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,  this.rTargets1[0].texture);
        gl.uniform1i(this.texProg2Chan0, 0);

        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.rTargets2[1].texture);
        gl.uniform1i(this.texProg2Chan1, 1);

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

        if(this.drawAttribution) {
          gl.activeTexture(gl.TEXTURE1);
          gl.bindTexture(gl.TEXTURE_2D, this.attribItem.texture);
          gl.uniform1i(this.attribLoc, 1);
        }
       

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        this.rTargets1.reverse();
        this.rTargets2.reverse();
 

        this.frame++;
        this.lastTime  = time; 

        this.externalCtx.drawImage(this.internalCanvas, 0, 0, this.canvasMountRef.width, this.canvasMountRef.height);
    }
}