import BaseItem from "./BaseItem";
import { loadMaterialFromText } from "../materials/index";
import { loadGeometryFromText } from "../geometries/index";

import addPersControls, { addOrthoMeshControls } from './AddMeshControls'

import * as THREE from 'three';
export default class MeshItem extends BaseItem {

    constructor(info) {
        super(info);
        this.type = info.type;
        this.mesh = new THREE.Mesh();
        info.scene.add(this.mesh);
    }

    updateGeometry = (configs) => {
        const  { GeomClass } = this;
        this.geometry = new GeomClass(this, configs);
        this.mesh.geometry = this.geometry;
    }

    changeGeometry(text) {
  
        let before = undefined;
        if(this.geometry) {
            this.folder.removeFolder(this._geoFol);
            before = this.removeButton.__li;
        }
    
        const GeometryClass = loadGeometryFromText(text);
        this.geometry = new GeometryClass(this, {});
        this.GeomClass = GeometryClass;
        this._geoFol  = this.folder.addFolder("Geometry Settings", true, false, before);
        this.geometry.__setUpGUI(this._geoFol);
        
        this.mesh.geometry = this.geometry;

        if(this.type === "ortho") { 
            addOrthoMeshControls(this, this.mesh, this._geoFol);
        } else {
            addPersControls(this, this.mesh, this._geoFol);
        }
    }

    onImageChange = () => {};

    play = (t) => {
        if(this.material.play)
            this.material.play(t)
    }

    stop = () => {
        if(this.material.stop)
            this.material.stop()
    }

    seekTime = (t) => {
        if(this.material.seekTime)
            this.material.seekTime(t)
    }

    update = (time, audioData) => {
        if(this.material)
            this.material.updateMaterial(time, audioData);
    }

    newGeometryModal() {
        const ref = this.folder.getRoot().modalRef;
        ref.toggleModal(14).then(text => {
            if(text)
                this.changeGeometry(text);
        });
    }

    newMaterialmodal() {
        const ref = this.folder.getRoot().modalRef;
        ref.toggleModal(9).then(text => {
            if(text)
                this.changeMaterial(text);
        });
    }

    changeMaterial(text) {
        let before = undefined;
        if(this.material) {
            this.folder.removeFolder(this._matFol);
            before = this.removeButton.__li;
        }
    
        const MaterialClass = loadMaterialFromText(text);
        this.material = new MaterialClass(this);
        this._matFol  = this.folder.addFolder("Material Settings", true, false, before);
        this.material.__setUpGUI(this._matFol);
        this._matFol.add(this, "newMaterialmodal").name("Change material");
        this.mesh.material = this.material;
    }
}
