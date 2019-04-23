export const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

export const fragmentShader = [
    "uniform sampler2D texture1;",
    "uniform sampler2D texture2;",
    "varying vec2 vUv;",

    "void main() {",
        "vec4 c = texture2D(texture1, vUv);",
        "float alpha = 0.;",
        "if(length(c.rgb) < 0.5)",
            "alpha = 1.0 - length(c.rgb) * 2.;",
            
        "gl_FragColor = vec4(texture2D(texture2, vUv).rgb, alpha);",
    "}"
].join("\n");