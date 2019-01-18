import React, { PureComponent } from 'react'
import * as THREE from 'three';

import RenderPass from './postprocessing/passes/renderpass'
import UnrealBloomPass from './postprocessing/passes/unrealbloompass'
import EffectComposer from './postprocessing/effectcomposer'
import OrbitControls from './controls/orbitcontrols'
import SimplifyModifier from './modifiers/SimplifyModifier' 

import TextSprite from 'three.textsprite';


function fractionate(val, minVal, maxVal) {
    return (val - minVal)/(maxVal - minVal);
}
function modulate(val, minVal, maxVal, outMin, outMax) {
    var fr = fractionate(val, minVal, maxVal);
    var delta = outMax - outMin;
    return outMin + (fr * delta);
}

export default class Index extends PureComponent {
    
    constructor() {
        super();

        this.width = 1280;
        this.height = 720;
        this.mountRef = React.createRef();


        this.moveMult = 10;
    }

    makeRoughGround(mesh, distortionFr) {
        /*
        mesh.geometry.vertices.forEach(function (vertex, i) {
            var amp = 2;
            var time = Date.now();
            var distance = (noise.noise2D(vertex.x + time * 0.0003, vertex.y + time * 0.0001) + 0) * distortionFr * amp;
            vertex.z = distance;
        });
        mesh.geometry.verticesNeedUpdate = true;
        mesh.geometry.normalsNeedUpdate = true;
        mesh.geometry.computeVertexNormals();
        mesh.geometry.computeFaceNormals();
        */
    }

    createLight = () => {
        var spotLight = new THREE.SpotLight(0xffffff);
        spotLight.intensity = 0.9;
        spotLight.position.set(-10, 40, 20);
        spotLight.lookAt(this.textMesh);
        spotLight.castShadow = true;
        this.scene.add(spotLight);
    }

    createGrid = () => {
        var planeGeometry = new THREE.PlaneGeometry(800, 800, 20, 20);
        var planeMaterial = new THREE.MeshLambertMaterial({
            color: 0x6904ce,
            side: THREE.DoubleSide,
            wireframe: true
        });
        
        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 30, 0);
        //group.add(plane);
    }

    createGridHelper = () => {
        const size = 1000;
        this.camera.position.z = size * 2.7;
        let color = 0x00ff00
        this.gridHelper = new THREE.GridHelper(size * 2, size * 6, new THREE.Color(color), new THREE.Color(color));
        this.gridHelper.position.z = 0;
        this.scene.add(this.gridHelper);
        this.gridHelper.rotation.x = Math.PI;
        this.gridHelper.position.y -= 0.25
    }

    createEffectComposer = () => {
        const renderScene = new RenderPass(this.scene, this.camera);
        this.bloomPass = new UnrealBloomPass(1, 0.87, 0, new THREE.Vector2(this.width, this.height));
        this.composer = new EffectComposer(this.renderer);
        this.composer.setSize(this.width, this.height);
        this.composer.addPass(renderScene);
        this.bloomPass.renderToScreen = true;
        this.composer.addPass(this.bloomPass);
    }

    createTextSprite = () => {
        let sprite = new TextSprite({
            material: {
              color: 0xffbbff,
              fog: true,
            },
            redrawInterval: 250,
            textSize: 1,
            texture: {
              text: 'Carpe Diem',
              fontFamily: 'Arial, Helvetica, sans-serif',
            },  
          });
        this.scene.add(sprite);
    }

    create3DText = () => {
        var loader = new THREE.FontLoader();

        loader.load( 'fonts/gentilis_regular.typeface.json',  ( font ) => {
            this.font = font;
            var geometry = new THREE.TextGeometry( 'Krosia - Azur', {
                font: font,
                size: 0.6,
                height: 0.1,
                curveSegments: 2,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.01,
                bevelSegments: 2
            });

            this.textMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: new THREE.Color(0xff00ff), wireframe: true, transparent: true}));
            this.textMesh.position.x -= 2;
            
            var modifier = new SimplifyModifier();
            var count = Math.floor( geometry.vertices.length * 0.955 ); // number of vertices to remove
            this.textMesh.geometry = modifier.modify( geometry, count );
            
            this.scene.add(this.textMesh);
            this.textMesh.material.opacity = 0.9;


            this.initialColor = new THREE.Vector3(0,0, 255);
            this.colorVec = new THREE.Vector3(0,0, 255);
        });
    }

    updateColor = () => {

        
        if(this.initialColor) {
            const colorVec =  this.textMesh.material.color.clone();
            if(Math.random() > 0.8){
                this.initialColor.x += 1;
                colorVec.r =   (this.initialColor.x % 255) / 255;
            }
            
            if(Math.random() > 0.8){
                this.initialColor.y += 1;
                colorVec.g  =    (this.initialColor.y % 255) / 255;
            }
            if(Math.random() > 0.8){
                this.initialColor.z += 1;
                colorVec.b =  (this.initialColor.z % 255) / 255;
            }

            this.textMesh.material.color = colorVec;
        }
       
        
    }

    componentDidMount() {

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setClearColor('#000000');
        this.renderer.setSize(this.width, this.height);
        this.mountRef.current.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 0.001, 25);

        const fogColor = new THREE.Color(0x000000);
 
        this.scene.fog = new THREE.Fog(fogColor, 0.0025, 13);

        this.camera.updateProjectionMatrix();
        this.camera.position.z = 5;
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.createGridHelper();
        this.createEffectComposer();
        //this.createTextSprite();
        this.create3DText();
       
        this.initialDirection = this.camera.getWorldDirection();
        requestAnimationFrame(this.renderScene);




        const loader = new THREE.TextureLoader();
        const s = "https://images.pexels.com/photos/1205301/pexels-photo-1205301.jpeg"
        //const t = "img/starsalpha2.png"
        loader.load(s, (texture) => {
            const background = new THREE.Mesh(new THREE.PlaneGeometry(20, 5, 32), new THREE.MeshBasicMaterial({map: texture, transparent: true}));
            background.position.z = -5;
            background.position.y = 2.25;
            this.scene.add(background);  
        });
    }

    moveCamera = () => {
        const t = performance.now()
        this.camera.position.z =  5 + Math.sin(t / 5000) / this.moveMult 
        this.camera.position.x =   Math.sin(t / 2500) / this.moveMult * 1.2 
        this.camera.position.y =   Math.sin(t / 1500) / this.moveMult * 1.8

        const dt = t / 2500;
        const lookAtX = this.initialDirection.x +  4 / this.moveMult * Math.sin(dt);
        const lookAtY = this.initialDirection.y +  4 / this.moveMult * Math.sin(dt);
        const lookAtZ = this.initialDirection.z +  4 / this.moveMult * Math.sin(dt);
        this.camera.lookAt(new THREE.Vector3(lookAtX, lookAtY, lookAtZ));
    }

    renderScene = () => {
        this.moveCamera();
        //this.composer.render();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.renderScene);

        console.log(this.gridHelper.geometry)

        this.bloomPass.strength =  Math.sin(performance.now() / 1000) ;
        this.gridHelper.position.z += 0.02;
        //this.updateColor();
    }
  
    render() {
        return (
            <div>
                <div ref={this.mountRef}> </div>
                <button> Load audio</button>
            </div>
        )
  }



}
