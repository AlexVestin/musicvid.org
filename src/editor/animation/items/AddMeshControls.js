

function scaleMesh(mesh, s) {
    const { x, y, z } = mesh.scale;
    mesh.scale.set(x*s, y*s, z*s);
}


export default function addPersMeshControls(parent, mesh, folder) {
    const maxPos = 100;
    const maxScale  = 30;
    folder.add(parent, "newGeometryModal").name("Change geometry");
    folder.add(mesh, "visible");
    folder.add(mesh.position, "x", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "y", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "z", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.rotation, "x").name("Rotation X");
    folder.add(mesh.rotation, "y").name("Rotation Y");
    folder.add(mesh.rotation, "z").name("Rotation Z");
    folder.add(mesh.scale, "x", -maxScale, maxScale, 0.1).name("Scale x");
    folder.add(mesh.scale, "y", -maxScale, maxScale, 0.1).name("Scale y");
    folder.add(mesh.scale, "z", -maxScale, maxScale, 0.1).name("Scale Z");
    folder.add(parent, "__scale").name("Scale").onChange(() => scaleMesh(mesh, parent.__scale));
    return folder;
}

export function addOrthoMeshControls(parent, mesh, folder) {
    const maxPos = 2;
    const maxScale  = 30;
    folder.add(parent, "newGeometryModal").name("Change geometry");
    folder.add(mesh, "visible");
    folder.add(mesh.position, "x", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "y", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.position, "z", -maxPos, maxPos, maxPos / 50);
    folder.add(mesh.rotation, "x").name("Rotation X");
    folder.add(mesh.rotation, "y").name("Rotation Y");
    folder.add(mesh.rotation, "z").name("Rotation Z");
    folder.add(mesh.scale, "x", -maxScale, maxScale, 0.1).name("Scale x");
    folder.add(mesh.scale, "y", -maxScale, maxScale, 0.1).name("Scale y");
    folder.add(mesh.scale, "z", -maxScale, maxScale, 0.1).name("Scale Z");
    folder.add(parent, "__scale").name("Scale").onChange(() => scaleMesh(mesh, parent.__scale));
    return folder;
}
