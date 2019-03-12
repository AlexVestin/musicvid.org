import SHADERS from './Standard'
import TEXSHADERS from './TextureShaders'

class RenderTarget {
    constructor(gl, width, height) {
        const targetTextureWidth = width;
        const targetTextureHeight = height;
        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        
    
        // define size and format of level 0
        this.level = 0;
        const internalFormat = gl.RGBA32F;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.FLOAT;
        const data = null;

        gl.texImage2D(gl.TEXTURE_2D, this.level, internalFormat, targetTextureWidth, targetTextureHeight, border, format, type, data);
        
        // set the filtering so we don't need mips
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
        this.width  = width;
        this.height = height;
        this.texture = targetTexture;
        this.fbo    = createFBO(gl, targetTexture, this.level);
    }
}




export function createFBO(gl, tex, level) {
    // Create and bind the framebuffer
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, level);
    return fb;
}

export function compileShader(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    
    if(typeof fragmentShader !== "object") {
      return fragmentShader;
    }

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    // If creating the shader program failed, alert
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
  
    return shaderProgram;
}

export function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = String(gl.getShaderInfoLog(shader));
      console.log(info, source);
      gl.deleteShader(shader);
      return info;
    }
  
    return shader;
}

export function initQuad(gl) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    return positionBuffer;   
}


export function createTexture(gl, width, height) {
    return new RenderTarget(gl, width, height);
}



export function setVertexAttrib(gl, vertexPosition) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadPosition.position);
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT,false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);
}

function addShaderToyUniforms(fs, inChannels) {
    const channels = [];
    for (var key in inChannels) {
        if(inChannels[key].type === "t") {
            channels.push("uniform sampler2D " + key + ";");
        }
    }
    return channels.join("\n") + "\n";
}

export function makeTextureProgram(gl) {
    return compileShader(gl, TEXSHADERS.vs, TEXSHADERS.fs);
}

export function makeProgram(gl, frag, w, h, inChannels, toScreen) {
    
    const channels = addShaderToyUniforms(SHADERS.fs, inChannels);    

    const shader =  SHADERS.fsStart + channels + frag +  (toScreen ? SHADERS.fsEnd1 : SHADERS.fsEnd2);
    const prog = compileShader(gl, SHADERS.vs, shader);
    const iResolution = gl.getUniformLocation(prog, 'iResolution');
    const iChannelResolution = gl.getUniformLocation(prog, 'iChannelResolution');
    gl.useProgram(prog);
    var resos = [ 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0, 0.0,0.0,0.0 ];
    
    for(var i = 0; i <  4; i++) {
        const channel = inChannels["iChannel" + i];
        
        if(channel) {
            resos[3*i+0] = channel.res.w;
            resos[3*i+1] = channel.res.h;
            resos[3*i+2] = 1;
        }else {
            resos[3*i+0] = 1;
            resos[3*i+1] = 1;
            resos[3*i+2] = 1;
        }   
    }

    

    gl.uniform3fv(iChannelResolution, new Float32Array( resos ))
    gl.uniform2f(iResolution, w, h);    
    
    return {
        program: prog, 
        quadBuffer: initQuad(gl),
        positions: { 
            iResolution,
            quad: gl.getAttribLocation(prog, 'aVertexPosition'),
            iTime: gl.getUniformLocation(prog, 'iTime'), 
            iFrame: gl.getUniformLocation(prog, 'iFrame'),
            iTimeDelta: gl.getUniformLocation(prog, 'iTimeDelta'),
            iChannelResolution: gl.getUniformLocation(prog, 'iChannelResolution'),
            iChannel0: gl.getUniformLocation(prog, 'iChannel0'),
            iChannel1: gl.getUniformLocation(prog, 'iChannel1'),
            iChannel2: gl.getUniformLocation(prog, 'iChannel2'),
            iChannel3: gl.getUniformLocation(prog, 'iChannel3') 
        } 
    }
}

export function prepareProgram(gl, pass) {
    {
        const numComponents = 2;  // pull out 2 values per iteration
        const type = gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next
                                  // 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from

        gl.bindBuffer(gl.ARRAY_BUFFER, pass.quadBuffer);
        gl.vertexAttribPointer(
            pass.positions.quad,
            numComponents,
            type,
            normalize,
            stride,
            offset
        );
        gl.enableVertexAttribArray(pass.positions.quad);
      }
}

export function loadTextureFromImage(gl, url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onerror  = (e) => console.log(e.message)
        img.onload = () => {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);

            // Upload the image into the texture.
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE );

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);

            // Set the parameters so we can render any size image.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR );
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            
            resolve(texture);
        } 
    })
    

}