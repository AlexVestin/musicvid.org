
export default function addNoise(parent, mesh, gui) {
    const folder = gui.addFolder("Mesh Settings");
    const obj = {
        visible: true,
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 0,
        rotationZ: 0,
        scaleX: 1.0,
        scaleY: 1.0,
        scaleZ: 1.0,
        scale: 1.0


    }

    const maxPos = 100;
    folder.add(mesh, "visible");
    folder.add(mesh.material, "wireframe");
    folder.add(mesh.position, "x", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "y", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "z", -maxPos, maxPos, maxPos / 50);
    folder.add(obj, "rotationX", -2, 2, 0.01).onChange(() => mesh.rotation.x = obj.rotationX);
    folder.add(obj, "rotationY", -2, 2, 0.01).onChange(() => mesh.rotation.y = obj.rotationY);
    folder.add(obj, "rotationZ", -2, 2, 0.01).onChange(() => mesh.rotation.z = obj.rotationZ);
    folder.add(obj, "scale", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleX", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleY", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    folder.add(obj, "scaleZ", -10.0, 10.0, 0.1).onChange(() => mesh.scale.set(obj.scaleX * obj.scale, obj.scaleY * obj.scale, obj.scaleZ * obj.scale));
    return folder;
}