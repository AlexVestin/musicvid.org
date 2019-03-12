
// perspective items
import Particles from './perspective/Particles'
import TimeRep from './perspective/TimeRep'
import LineBed from './perspective/LineBed'
import ParticlesSideways  from './perspective/ParticlesSideways' 
import TextLines from './perspective/TextLines' 

// ortho items
import JSNation from './ortho/JSNation'
import Plane from './ortho/Plane'
import Background from './ortho/Background'
import StarField from './ortho/StarField'
import SideLobes from './ortho/SideLobes'
import Noise from './ortho/Noise'
import SimplicityGalaxy from './ortho/SimplicityGalaxy'
import HexaGone from './ortho/HexaGone'
import OverTheMoon from './ortho/OverTheMoon'
import UniverseWithin from './ortho/UniverseWithin'
import Image from './ortho/Image'
import SpriteTextMask from './ortho/SpriteTextMask'
import SpriteText from './ortho/SpriteText'

// canvas items
import Monstercat2D from './canvas/MonsterBars2D'
import Text2D from './canvas/Text'
import Image2D from './canvas/Image'
import Polartone2D from './canvas/Polartone2D'


const perspectiveItems = {
    Particles: {class: Particles},
    TimeRep: {class: TimeRep},
    LineBed: {class: LineBed},
    ParticlesSideways: {class: ParticlesSideways},
    TextLines: {class: TextLines}
}

const canvasItems = {
    Monstercat2D: {class: Monstercat2D},
    Text2D: {class: Text2D},
    Image2D: {class: Image2D},
    Polartone2D: {class: Polartone2D},
}


const orthoItems = {
    JSNation: {img: "img/items/JSnation.png", authors: "@Caseif & @Incept", url:"https://github.com/caseif/js.nation", class: JSNation},
    Plane: { class: Plane },
    Background: { class: Background },
    StarField: {img: "img/items/StarField.png", class: StarField },
    SideLobes: { class: SideLobes },
    Noise: {img: "img/items/Noise.png", authors: "nmz (@Stormoid)", url: "https://www.shadertoy.com/view/ldlXRS", class: Noise},
    SimplicityGalaxy: {img: "img/items/SimplicityGalaxy.png", url: "https://www.shadertoy.com/view/MslGWN", authors: "CBS", class: SimplicityGalaxy},
    HexaGone: {img: "img/items/HexaGone.png", url: "https://www.shadertoy.com/view/wsl3WB", authors: "BigWIngs", class: HexaGone},
    OverTheMoon: {img: "img/items/OverTheMoon.png", url: "https://www.shadertoy.com/view/4s33zf", authors: "BigWIngs", class: OverTheMoon},
    UniverseWithin: {img: "img/items/UniverseWithing.png", url: "https://www.shadertoy.com/view/lscczl", authors: "BigWIngs", class: UniverseWithin},
    Image: {class: Image},
    SpriteTextMask: {class: SpriteTextMask},
    SpriteText: {class: SpriteText}
}


const items = [canvasItems, orthoItems,perspectiveItems];
export { items };

export default function getItemClassFromText(type, name) {
  
    if(type === "ortho") {
        return orthoItems[name].class;
    }else if(type === "canvas") {
        return canvasItems[name].class;
    }else if(type === "perspective") {
        return perspectiveItems[name].class;
    }else {
        console.log("WRONG TYPE")
    }
}
