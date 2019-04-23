


import ImageMaterial from './ImageMaterial'
import HexaGoneMaterial from './HexaGoneMaterial'
import UniverseWithin from './UniverseWithinMaterial'



const materials = {
    ImageMaterial: { class: ImageMaterial },
    HexaGone: {img: "img/items/HexaGone.png", class: HexaGoneMaterial },
    UniverseWithin: {img: "img/items/UniverseWithin.png", class: UniverseWithin },
};

export function loadMaterialFromText(text) {
    return materials[text].class;
}

export { materials };

