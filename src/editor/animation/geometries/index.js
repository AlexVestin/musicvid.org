


import Plane from './Plane'
import Sphere from './Sphere'



const geometries = {
    Plane: { class: Plane },
    Sphere: { class: Sphere },
};

export function loadGeometryFromText(text) {
    return geometries[text].class;
}

export { geometries };

