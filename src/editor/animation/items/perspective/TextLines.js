
import * as THREE from "three";
import BaseItem from '../BaseItem'
import addMeshControls from 'editor/util/AddMeshControls'
import ImpactAnalyser from 'editor/audio/ImpactAnalyser'

 

const fragmentShader = [
    "uniform vec3 color;",
    "uniform float opacity;",
    "varying vec3 vColor;",
    "void main() {",
        "gl_FragColor = vec4( vColor * color, opacity );",
    "}"
].join("\n");

const vertexShader = [
    "uniform float amplitude;",
    "attribute vec3 displacement;",
    "attribute vec3 customColor;",
    "varying vec3 vColor;",
    "void main() {",
        "vec3 newPosition = position + amplitude * displacement;",
        "vColor = customColor;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );",
    "}"

].join("\n");




export default class Box extends BaseItem {
    constructor(info) {
        super(info);
        this.name = "Text Lines";
        
        var loader = new THREE.FontLoader();

        this.uniforms = {
            amplitude: { value: 5.0 },
            opacity: { value: 0.3 },
            color: { value: new THREE.Color( 0xffffff ) }
        };

        this.shaderMaterial = new THREE.ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader:fragmentShader, 
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        } );

		loader.load( 'fonts/helvetiker_bold.typeface.json', (font) => {
			this.fontLoaded( font );
        } );

        this.text = "Artist";
        this.scene = info.scene;
        this.loaded = false;
        this.mesh =  new THREE.Mesh(new THREE.Geometry(), this.shaderMaterial);
        this.scene.add( this.mesh );
        this.__setUpFolder();
        this.impactAnalyser = new ImpactAnalyser(this.folder); 
    }

    setUpGUI = (gui, name) => {
        const folder = gui.addFolder(name);
        folder.add(this, "text").onChange(this.init);
        addMeshControls(this, this.mesh, folder);
        return this.__addFolder(folder);
    }

    fontLoaded = (font) => {
        this.font = font;
        this.init()
    }


    init = () => {
       
        var geometry = new THREE.TextBufferGeometry( this.text, {
            font: this.font,
            size: 50,
            height: 15,
            curveSegments: 10,
            bevelThickness: 5,
            bevelSize: 1.5,
            bevelEnabled: true,
            bevelSegments: 10,
        } );
        geometry.center();
        var count = geometry.attributes.position.count;
        var displacement = new THREE.Float32BufferAttribute( count * 3, 3 );
        geometry.addAttribute( 'displacement', displacement );
        var customColor = new THREE.Float32BufferAttribute( count * 3, 3 );
        geometry.addAttribute( 'customColor', customColor );
        var color = new THREE.Color( 0xffffff );
        for ( var i = 0, l = customColor.count; i < l; i ++ ) {
            color.setHSL( i / l, 0.5, 0.5 );
            color.toArray( customColor.array, i * customColor.itemSize );
        }
       this.mesh.geometry = geometry;
        
        this.loaded = true;
    }


    update = (time, audioData) => {
            if(this.loaded) {
                const impact = this.impactAnalyser.analyse(audioData.frequencyData);

                this.mesh.rotation.y = 0.25 * time;
                this.uniforms.amplitude.value =  impact / 4  //*Math.sin( 0.5 * time );
                this.uniforms.color.value.offsetHSL( 0.0005, 0, 0 );
                var attributes = this.mesh.geometry.attributes;
                var array = attributes.displacement.array;
                for ( var i = 0, l = array.length; i < l; i += 3 ) {
                    array[ i ] += 0.3 * ( 0.5 - Math.random() );
                    array[ i + 1 ] += 0.3 * ( 0.5 - Math.random() );
                    array[ i + 2 ] += 0.3 * ( 0.5 - Math.random() );
                }
                attributes.displacement.needsUpdate = true;
            }
			
    };
}
