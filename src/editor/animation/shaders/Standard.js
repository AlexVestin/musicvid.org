const vs = `#version 300 es
in vec2 aVertexPosition;
out vec2 uv;
void main() {
  uv = aVertexPosition;
  gl_Position =  vec4(aVertexPosition, 0., 1.0);
}`;

const fsStart = `#version 300 es
#ifdef GL_ES
precision highp float;
precision highp int;
precision mediump sampler3D;
#endif
uniform vec3 iChannelResolution[4];
uniform float iTime;
uniform float iTimeDelta;
uniform float timeDelta;
uniform vec2 iResolution; 
uniform vec4 iMouse;
uniform int iFrame;
in vec2 uv;
out vec4 fColor;

`
const fsEnd1 = `void main() {
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  mainImage(color, gl_FragCoord.xy);
  color.w = 1.0;
  fColor = color;
}`

const fsEnd2 = `void main() {
  vec4 color = vec4(0.0,0.0,0.0,1.0);
  mainImage(color, gl_FragCoord.xy);
  fColor = color;
}`


export default { vs, fsStart, fsEnd1, fsEnd2 }
