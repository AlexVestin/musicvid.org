

export default function addFolder(object, folder) {
    const { material } = object;
    const fold = folder.addFolder("Material settings");

    const t = {changeMaterial : () => {
        console.log("pls")
    }}
    fold.add(t, "changeMaterial");
    material.setUpGUI(fold);
}