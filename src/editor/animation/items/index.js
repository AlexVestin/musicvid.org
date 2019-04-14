
// perspective items
import Particles from './perspective/Particles'
import LineBed from './perspective/LineBed'
import ParticlesSideways  from './perspective/ParticlesSideways' 
import TextLines from './perspective/TextLines' 

// ortho items
import TimeRep from './ortho/TimeRep'
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
import BeatCounter from './canvas/BeatCounter'
import JSNation2D from './canvas/JSNation'



const perspectiveItems = {
    Particles: { authors: "@Caseif & @Incept", url:"https://github.com/caseif/js.nation", class: Particles, img: "img/items/Particles.png"},
    
    LineBed: { authors: "GamleGaz", class: LineBed, img: "img/items/LineBEd.png"},
    ParticlesSideways: {url:"https://github.com/caseif/vis.js", authors: "@Caseif & @Incept", class: ParticlesSideways, img: "img/items/ParticlesSideways.png"},
    TextLines: {class: TextLines, img: "img/items/TextLines.png"}
}

const canvasItems = {
    Monstercat2D: { url:"https://github.com/caseif/vis.js", authors: "@Caseif & @Incept", class: Monstercat2D,  img: "img/items/MonsterBars.png" },
    Text2D: {class: Text2D, img: "img/items/Text2D.png"} ,
    Image2D: {class: Image2D, img: "img/items/Image.png"},
    Polartone2D: {class: Polartone2D, img: "img/items/Polartone.png", url: "https://github.com/mattdesl/Polartone", authors: "Mattdesl"},
    BeatCounter: {class: BeatCounter},
    JSNation: {img: "img/items/JSNation.png", authors: "@Caseif & @Incept", class: JSNation2D}
}


const orthoItems = {
    Background: { class: Background },
    StarField: {img: "img/items/StarNest.png", class: StarField },
    TimeRep: {authors: "GamleGaz", class: TimeRep, img: "img/items/AudioWaveItem.png"},
    Noise: {img: "img/items/Noise.png", authors: "nmz (@Stormoid)", url: "https://www.shadertoy.com/view/ldlXRS", class: Noise},
    //SimplicityGalaxy: {img: "img/items/SimplicityGalaxy.png", url: "https://www.shadertoy.com/view/MslGWN", authors: "CBS", class: SimplicityGalaxy},
    HexaGone: {img: "img/items/HexaGone.png", url: "https://www.shadertoy.com/view/wsl3WB", authors: "BigWIngs", class: HexaGone},
    UniverseWithin: {img: "img/items/UniverseWithin.png", url: "https://www.shadertoy.com/view/lscczl", authors: "BigWIngs", class: UniverseWithin},
    Image: {class: Image},
    SpriteTextMask: {class: SpriteTextMask, img: "img/items/StarField.png"},
    SpriteText: {class: SpriteText, img: "img/items/SpriteText.png"}
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
