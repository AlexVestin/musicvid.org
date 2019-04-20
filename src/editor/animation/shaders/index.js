
try {
    module.exports.OutrunTheRain = require('./licensed/OutrunTheRain');
    module.exports.Noise = require('./licensed/Noise');
    module.exports.Filaments = require('./licensed/Filaments');
    module.exports.SimplicityGalaxy = require('./licensed/SimplicityGalaxy');
    module.exports.UniverseWithin = require('./licensed/UniverseWithin');
    module.exports.HexaGone = require('./licensed/HexaGone');
    module.exports.Sinuous = require('./licensed/Sinuous');


} catch (ex) {
    module.exports.OutrunTheRain = {};
    module.exports.Noise = {};
    module.exports.Filaments = {};
    module.exports.SimplicityGalaxy = {};
    module.exports.UniverseWithin = {};
    module.exports.HexaGone = {};
    module.exports.Sinuous = {};
    alert("Shader is licensed and not implemented in this version.")
}