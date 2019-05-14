export default function() {
    const prefix = "./img/backgrounds/";
    const images = [
        "birds.jpeg",
        "city.jpeg",
        "city2.jpeg",
        "empty.jpeg",
        "giraffes.jpeg",
        "lighthouse.jpeg",
        "ocean.jpeg",
        "ocean2.jpeg",
        "offroad.jpeg",
        "path.jpeg",
        "purple.jpeg",
        "road.jpeg",
        "rocks.jpeg",
        "sunset.jpeg",
        "tree.jpeg",
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