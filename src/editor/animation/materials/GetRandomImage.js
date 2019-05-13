export default function() {
    const prefix = "./img/backgrounds/";
    const images = [
        "clouds.jpeg",
        "space.jpeg",
        "valley.jpeg",
        "cave.jpeg",
        "solar.jpeg"
    ]
    const l = prefix + images[Math.floor(images.length*Math.random())];;
    console.log(l);
    return l;
}