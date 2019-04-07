
const NOISES = [
    "noisy1.png",
    "noisy2.png",
    "noisy3.png",
    "noisy4.png",
    "noisy5.png",
    "noisy6.png",
    "noisy7.png",
    "noisy8.png",
]

export default function addNoise(gui, onTextureChange, def="noisy1.png") {
    const obj = {noise: def};
    gui.add(obj, "noise", NOISES).onChange(() => onTextureChange(obj.noise));
}