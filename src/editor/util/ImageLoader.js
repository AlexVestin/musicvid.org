import { TextureLoader, Texture } from "three";

export function loadImageFromChoice(selected, callback) {
    if (typeof selected === "string") {
        const img = new Image();
        img.src = selected;
        img.onload = () => callback(img);
        img.onerror = console.log;
    } else if (selected) {
        const reader = new FileReader();
        const image = document.createElement("img");
        reader.onload = e => {
            image.src = e.target.result;
            image.onload = () => {
                callback(image);
            };
        };
        reader.readAsDataURL(selected);
    }
}

export function loadImageTextureFromChoice(selected, callback) {
    if (typeof selected === "string") {
        const textureLoader = new TextureLoader();
        textureLoader.crossOrigin = "";
        textureLoader.load(selected, callback);
    } else if (selected) {
        const reader = new FileReader();
        const image = document.createElement("img");
        const texture = new Texture();
        texture.image = image;
        reader.onload = e => {
            image.src = e.target.result;
            image.onload = () => {
                texture.needsUpdate = true;
                callback(texture);
            };
        };
        reader.readAsDataURL(selected);
    }
}

export async function loadImage(ref, callback) {
    return new Promise(async (resolve, reject) => {
        if (ref.currentPromise && !ref.currentPromise.done) {
            await ref.currentPromise;
        }
        ref.toggleModal(3).then(selected => {
            loadImageFromChoice(selected, callback);
            resolve(selected);
        });
    });
}

export async function loadImageTexture(ref, callback) {
    return new Promise(async (resolve, reject) => {
        if (ref.currentPromise && !ref.currentPromise.done) {
            await ref.currentPromise;
        }
        ref.toggleModal(3).then(selected => {
            loadImageTextureFromChoice(selected, callback);
            resolve(selected);
        });
    });
}
