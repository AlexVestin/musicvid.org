export default function() {
    const prefix = "./img/backgrounds/";
    const images = [
        "city.jpeg",
        "empty.jpg",
        "giraffes.jpeg",
        "lighthouse.jpeg",
        "ocean.jpeg",
        "ocean2.jpeg",
        "offroad.jpg",
        "purple.jpeg",
        "rocks.jpeg",
        "tree.jpeg",
        "clouds.jpeg",
        "space.jpeg",
        "valley.jpeg",
        "cave.jpeg",
        "solar.jpeg"
    ]
    const l = prefix + images[Math.floor(images.length*Math.random())];;
    return l;
}