


import ImageMaterial from './ImageMaterial'
import HexaGoneMaterial from './HexaGoneMaterial'
import UniverseWithin from './UniverseWithinMaterial'
import MeshBasicMaterial from './MeshBasicMaterial'
import NoiseMaterial from './NoiseMaterial'
import StarNestMaterial from './StarNestMaterial'



const materials = {
    ImageMaterial: { class: ImageMaterial },
    HexaGone: {img: "img/items/HexaGone.png", class: HexaGoneMaterial },
    UniverseWithin: {img: "img/items/UniverseWithin.png", class: UniverseWithin },
    MeshBasicMaterial: {img: "img/items/UniverseWithin.png", class: MeshBasicMaterial },
    Noise: {img: "img/items/Noise.png", class: NoiseMaterial },
    StarNest: {img: 'img/items/StarNest.js', class: StarNestMaterial}
};

export function loadMaterialFromText(text) {
    return materials[text].class;
}

export { materials };

