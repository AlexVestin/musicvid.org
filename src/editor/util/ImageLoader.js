
import { TextureLoader, Texture } from 'three';

export default function loadImage(selected, callback) {
    if(typeof selected === "string") {
        const textureLoader = new TextureLoader();
        textureLoader.crossOrigin = "";
        textureLoader.load(selected, callback);
    }else if (selected) {
        const reader  = new FileReader();
        const image = document.createElement("img");
        const texture = new Texture();
        texture.image = image;
        reader.onload = (e) => {
            image.src = e.target.result;
            image.onload = () =>  {
                texture.needsUpdate = true;
                callback(texture);
            }
        }
        reader.readAsDataURL(selected);
    
    }
}
