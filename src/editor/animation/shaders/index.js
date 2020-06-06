try {
    module.exports = {
        //Noise: require('./licensed/Noise'),
        Filaments: require("./licensed/Filaments"),
        SimplicityGalaxy: require("./licensed/SimplicityGalaxy"),
        UniverseWithin: require("./licensed/UniverseWithin"),
        HexaGone: require("./licensed/HexaGone"),
        Sinuous: require("./licensed/Sinuous")
    };
} catch (ex) {
    module.exports.OutrunTheRain = {};
    module.exports.Noise = {};
    module.exports.Filaments = {};
    module.exports.SimplicityGalaxy = {};
    module.exports.UniverseWithin = {};
    module.exports.HexaGone = {};
    module.exports.Sinuous = {};
    alert(
        "Shader is licensed and not implemented in this version.",
        ex.message
    );
    console.log(ex);
}
