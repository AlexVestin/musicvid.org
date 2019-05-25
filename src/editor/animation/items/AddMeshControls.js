import {Vector3} from 'three';

function scaleMesh(mesh, s) {
    const { x, y, z } = mesh.__scale;
    mesh.scale.set(x*s, y*s, z*s);
}

export default function addPersMeshControls(parent, mesh, folder) {
    const maxPos = 100;
    const maxScale  = 30;
    if(parent.isMeshItem) {
        parent.addController(folder, parent, "newGeometryModal").name("Change geometry");
        parent.addController(folder, mesh, "visible");
    }
    const posOpts = {min: -maxPos, max: maxPos, path :"mesh-psoition"};
    parent.addController(folder, mesh.position, "x", posOpts);
    parent.addController(folder, mesh.position, "y", posOpts);
    parent.addController(folder, mesh.position, "z", posOpts);
    parent.addController(folder, mesh.rotation, "x", {path: "mesh-rotation"}).name("Rotation X");
    parent.addController(folder, mesh.rotation, "y", {path: "mesh-rotation"}).name("Rotation Y");
    parent.addController(folder, mesh.rotation, "z", {path: "mesh-rotation"}).name("Rotation Z");

    const scaleOpts = {min:  -maxScale, max: maxScale, path: "mesh-scale"};
    mesh.__scale = new Vector3(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    parent.addController(folder, mesh.scale, "x", scaleOpts).name("Scale x").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, mesh.scale, "y", scaleOpts).name("Scale y").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, mesh.scale, "z", scaleOpts).name("Scale Z").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, parent, "__scale").name("Scale").onChange(() => scaleMesh(mesh, parent.__scale));
    return folder;
}

export function addOrthoMeshControls(parent, mesh, folder) {
    const maxPos = 2;
    const maxScale  = 30;
    if(parent.isMeshItem) {
        parent.addController(folder, parent, "newGeometryModal").name("Change geometry");
        parent.addController(folder, mesh, "visible");
    }
    const posOpts = {min: -maxPos, max: maxPos, path :"mesh-psoition"};
    parent.addController(folder, mesh.position, "x", posOpts);
    parent.addController(folder, mesh.position, "y", posOpts);
    parent.addController(folder, mesh.position, "z", posOpts);
    parent.addController(folder, mesh.rotation, "x", {path: "mesh-rotation"}).name("Rotation X");
    parent.addController(folder, mesh.rotation, "y", {path: "mesh-rotation"}).name("Rotation Y");
    parent.addController(folder, mesh.rotation, "z", {path: "mesh-rotation"}).name("Rotation Z");

    const scaleOpts = {min:  -maxScale, max: maxScale, path: "mesh-scale"};
    mesh.__scale = new Vector3(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    parent.addController(folder, mesh.scale, "x", scaleOpts).name("Scale x").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, mesh.scale, "y", scaleOpts).name("Scale y").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, mesh.scale, "z", scaleOpts).name("Scale Z").onChange(() => mesh.__scale.copy(mesh.scale));
    parent.addController(folder, parent, "__scale").name("Scale").onChange(() => scaleMesh(mesh, parent.__scale));
    return folder;
}
