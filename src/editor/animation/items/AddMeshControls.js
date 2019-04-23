
export default function addPersMeshControls(parent, mesh, folder) {
    const obj = {
        visible: true,
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
        rotationX: mesh.rotation.x,
        rotationY: mesh.rotation.y,
        rotationZ: mesh.rotation.z,
        scaleX: mesh.scale.x,
        scaleY: mesh.scale.y,
        scaleZ: mesh.scale.z,
        scale: 1.0
    }

    const maxPos = 100;
    folder.add(parent, "newGeometryModal").name("Change geometry");
    folder.add(mesh, "visible");
    folder.add(mesh.material, "wireframe");
    folder.add(mesh.position, "x", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "y", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "z", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.rotation, "x", -2, 2, 0.01).name("Rotation X");
    folder.add(mesh.rotation, "y", -2, 2, 0.01).name("Rotation Y");
    folder.add(mesh.rotation, "z", -2, 2, 0.01).name("Rotation Z");

    folder.add(obj, "scale", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(mesh.scale, "x", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(mesh.scale, "y", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(mesh.scale, "z", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    return folder;
}

export function addOrthoMeshControls(parent, mesh, folder) {
    const obj = {
        visible: true,
        x: mesh.position.x,
        y: mesh.position.y,
        z: mesh.position.z,
        rotationX: mesh.rotation.x,
        rotationY: mesh.rotation.y,
        rotationZ: mesh.rotation.z,
        scaleX: mesh.scale.x,
        scaleY: mesh.scale.y,
        scaleZ: mesh.scale.z,
        scale: 1.0
    }

    const maxPos = 2;
    const maxScale = 2.5;
    folder.add(parent, "newGeometryModal").name("Change geometry");
    folder.add(mesh, "visible");
    folder.add(mesh.position, "x", -maxPos, maxPos, maxPos / 100);
    folder.add(mesh.position, "y", -maxPos, maxPos, maxPos / 100);
    folder.add(mesh.position, "z", -maxPos, maxPos, maxPos / 100);
    folder.add(obj, "rotationX", -2, 2, 0.01).onChange(() => mesh.rotation.x = obj.rotationX);
    folder.add(obj, "rotationY", -2, 2, 0.01).onChange(() => mesh.rotation.y = obj.rotationY);
    folder.add(obj, "rotationZ", -2, 2, 0.01).onChange(() => mesh.rotation.z = obj.rotationZ);
    folder.add(obj, "scale", -10.0, 10.0, 0.01).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleX", -maxScale, maxScale, 0.001).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleY", -maxScale, maxScale, 0.001).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleZ", -maxScale, maxScale, 0.001).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    return folder;
}
