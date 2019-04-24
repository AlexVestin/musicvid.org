


import Plane from './Plane'
import Sphere from './Sphere'
import Cone from './Cone'

const geometries = {
    Plane: { class: Plane },
    Sphere: { class: Sphere },
    Cone: { class: Cone }
};

export function loadGeometryFromText(text) {
    return geometries[text].class;
}

export { geometries };

