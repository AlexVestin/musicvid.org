const vs = `#version 300 es
in vec2 aVertexPosition;
out vec2 uv;
void main() {
  uv = aVertexPosition;
  gl_Position =  vec4(aVertexPosition, 0., 1.0);
}`;



const fs = `#version 300 es 
precision highp float;
in vec2 uv;
out vec4 fragColor;
uniform sampler2D tex1;
void main() {

    fragColor = texture(tex1, uv);  
}`

export default { vs, fs};