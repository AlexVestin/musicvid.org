import createCamera from "perspective-camera";
import lerp from "lerp";
import * as THREE from "three";

const vertexShader = [
    "varying vec2 vUv;",
    "void main() {",
        "vUv = uv;",
        "gl_Position =   projectionMatrix * modelViewMatrix * vec4(position,1.0);",
    "}",
].join("\n");

const fragmentShader = [
    "uniform sampler2D texture1;",
    "varying vec2 vUv;",

    "void main() {",
        "vec2 pos  = vUv;",
        "float c =  texture2D(texture1, pos);",
        "if(length(c) < 0.01)",
            "gl_FragColor = c;",
        "else",
            "gl_FragColor = vec4(c.rgb, 0.);",
    "}"
].join("\n");

export default class Polartone {
    constructor(info) {
        // Cant clear the canvas so create internal canvas for this item
        this.internalCanvas = document.createElement("canvas");
        this.internalCanvas.width = 1024;
        this.internalCanvas.height = 1024;
        this.internalCtx = this.internalCanvas.getContext("2d");

        const shape = [1024 , 1024];
        this.camera = createCamera({
            fov: Math.PI / 4,
            near: 0.01,
            far: 100,
            viewport: [0, 0, ...shape]
        });

        this.positions = [];
        this.cursor = [0, 0, 0];
        this.dpr = window.devicePixelRatio;
        this.songDuration = 180;
        this.cameraX = 0;
        this.cameraY = -3.5;
        this.cameraZ = 0;
        this.amplitude = 128.0;
        this.extent = 0.65;
        this.scale = 1.0;
        this.capacity = 900;
        this.distance = 0.35;
        this.clearAlpha = 0.1;
        this.baseStrokeAlpha = 0.25;
        this.internalCtx.globalAlpha = this.baseStrokeAlpha 

        this.positionX  = 0;
        this.positionY  = 0;
        this.textureScale = 1.0;

        this.geo = new THREE.PlaneGeometry(2 * (info.height / info.width), 2);
        
        this.tex = new THREE.CanvasTexture(this.internalCanvas);
        this.mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true });
        this.mat.alphaTest = 0.1;
        this.mesh = new THREE.Mesh(this.geo, this.mat);
        info.scene.add(this.mesh);
        this.internalCtx.strokeStyle = 'rgb(255,255,255)'

        this.camera.identity();
        this.camera.translate([this.cameraX, this.cameraY, this.cameraZ]);
        this.camera.lookAt([0, 0, 0]);
        this.camera.update();
        this.folder = this.setUpGUI(info.gui, "Polartone");

    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "songDuration");
        folder.add(this, "cameraX");
        folder.add(this, "cameraY");
        folder.add(this, "cameraZ");
        folder.add(this, "amplitude");
        folder.add(this, "extent");
        folder.add(this, "capacity");
        folder.add(this, "distance");
        folder.addColor(this.internalCtx, "strokeStyle")
        folder.add(this, "baseStrokeAlpha").onChange(() => this.internalCtx.globalAlpha = this.baseStrokeAlpha);
        folder.add(this, "clearAlpha", 0, 1, 0.001);
        folder.add(this, "positionX", -2, 2, 0.01).onChange(() => this.mesh.position.x = this.positionX);
        folder.add(this, "positionY", -2, 2, 0.01).onChange(() => this.mesh.position.y = this.positionY);
        folder.add(this, "textureScale", -2, 2, 0.01).onChange(() => this.mesh.scale.set(this.textureScale, this.textureScale, this.textureScale) );


        return folder;
    };

    update = (time, data) => {
        const audioData = data.timeData;
        const dur = time / this.songDuration;
        const bufferLength = audioData.length;

        // set up our this.camera
        // with WebGL (persistent lines) could be
        // interesting to fly through it in 3d
       

        this.internalCtx.save();
        this.internalCtx.scale(this.dpr, this.dpr);

        // for a motion trail effect
        // const [width, height] = shape
        this.internalCtx.fillStyle = 'rgb(0,0,0,'+this.clearAlpha+')'
        this.internalCtx.fillRect(0,0, 1024, 1024)

        let radius = 1 - dur;
        const startAngle = time;

        this.internalCtx.beginPath();

        for (let i = this.positions.length - 1; i >= 0; i--) {
            var pos = this.positions[i];
            this.internalCtx.lineTo(pos[0], pos[1]);
        }
        this.internalCtx.stroke();
        this.internalCtx.restore();

        for (let i = 0; i < bufferLength; i++) {
            const lAlpha = i / (bufferLength - 1);
            const angle = lerp(
                startAngle + this.distance,
                startAngle,
                lAlpha
            );
            this.cursor[0] = Math.cos(angle) * radius;
            this.cursor[2] = Math.sin(angle) * radius;

            const amplitude = (audioData[i] / 128.0) * this.amplitude;
            const waveY = (amplitude * this.extent) / 2;

            const adjusted = [
                this.cursor[0],
                this.cursor[1] + waveY,
                this.cursor[2]
            ];
            const [x, y] = this.camera.project(adjusted);

            if (this.positions.length > this.capacity) {
                this.positions.shift();
            }

            this.positions.push([
                this.cameraX + x * this.scale,
                this.cameraY + y * this.scale
            ]);
        }

        this.mat.map.needsUpdate = true;
    };
}
