
// perspective items
import Particles from './perspective/Particles'
import LineBed from './perspective/LineBed'
import ParticlesSideways  from './perspective/ParticlesSideways' 
import TextLines from './perspective/TextLines' 
import SphereMesh from './perspective/SphereMesh' 
import BasicMeshItem from './BasicMeshItem' 
import ParticleLines from './perspective/ParticleLines' 

// ortho items
import TimeRep from './ortho/TimeRep'
import AudioWave from './ortho/AudioWave'

import Background from './ortho/Background'
import StarField from './ortho/StarField'
import SpriteText from './ortho/SpriteText'
import Meme from './ortho/Meme'
import Line from './ortho/Line'
import OctaveMeatballs from './ortho/OctaveMeatballs'


import OldVideo from './ortho/OldVideo'


// canvas items
import Monstercat2D from './canvas/MonsterBars2D'
import Text2D from './canvas/TextString'
import TimeText from './canvas/TimeText'
import Image2D from './canvas/Image'
import Polartone2D from './canvas/Polartone2D'
import BeatCounter from './canvas/BeatCounter'
import JSNation2D from './canvas/JSNation'
import JSNation2D2 from './canvas/JSNation2'



// PIXI items
import JSNationPixi from './pixi/JSNation'

const perspectiveItems = {
    Particles: { authors: "@Caseif & @Incept", url:"https://github.com/caseif/js.nation", class: Particles, img: "img/items/Particles.png"},
    LineBed: { authors: "GamleGaz", class: LineBed, img: "img/items/LineBEd.png"},
    ParticlesSideways: {url:"https://github.com/caseif/vis.js", authors: "@Caseif & @Incept", class: ParticlesSideways, img: "img/items/ParticlesSideways.png"},
    TextLines: {class: TextLines, img: "img/items/TextLines.png"},
    SphereMesh: {class: SphereMesh},
    BasicMeshItem: {class: BasicMeshItem},
    ParticleLines: {class: ParticleLines},
    Line: {class: Line},
}

const canvasItems = {
    Monstercat2D: { url:"https://github.com/caseif/vis.js", authors: "@Caseif & @Incept", class: Monstercat2D,  img: "img/items/MonsterBars.png" },
    Text2D: {class: Text2D, img: "img/items/Text2D.png"},
    TimeText: {class: TimeText, img: "img/items/Text2D.png"},
    Image2D: {class: Image2D, img: "img/items/Image.png"},
    Polartone2D: {class: Polartone2D, img: "img/items/Polartone.png", url: "https://github.com/mattdesl/Polartone", authors: "Mattdesl"},
    BeatCounter: {class: BeatCounter},
    JSNation: {img: "img/items/JSNation.png", authors: "@Caseif & @Incept", class: JSNation2D},
    JSNation2: {img: "img/items/JSNation.png", authors: "@Caseif & @Incept", class: JSNation2D2},
    BasicMeshItem: {class: BasicMeshItem}
}


const orthoItems = {
    Background: { class: Background },
    StarField: {img: "img/items/StarNest.png", class: StarField },
    TimeRep: {authors: "GamleGaz", class: TimeRep, img: "img/items/AudioWaveItem.png"},
    SpriteText: {class: SpriteText, img: "img/items/SpriteText.png"},
    Meme: {class: Meme},
    OctaveMeatballs: {class: OctaveMeatballs},
    Video: {class: OldVideo},
    AudioWave: {class: AudioWave}
}

const pixiItems = {
    JSNationPixi: {class: JSNationPixi }
}


const licensed = true;
if(licensed) {
    const licensedOrthoItems = [
        {path: './ortho/Noise.js', img: "img/items/Noise.png", authors: "nmz (@Stormoid)", url: "https://www.shadertoy.com/view/ldlXRS", name: "Noise"},
        {path: './ortho/HexaGone.js',img: "img/items/HexaGone.png", url: "https://www.shadertoy.com/view/wsl3WB", authors: "BigWIngs", name: "HexaGone"},
        {path: './ortho/UniverseWithin.js', img: "img/items/UniverseWithin.png", url: "https://www.shadertoy.com/view/lscczl", authors: "BigWIngs", name: 'UniverseWithin'}
    ]

    licensedOrthoItems.forEach(item => {
        import(`${item.path}`).then(Class => {
            orthoItems[item.name] = {...item, class: Class.default};
        })
    });
}


const items = [canvasItems, orthoItems,perspectiveItems, ];
export { items };

export default function getItemClassFromText(type, name) {
  
    if(type === "ortho") {
        return orthoItems[name].class;
    }else if(type === "canvas") {
        return canvasItems[name].class;
    }else if(type === "perspective") {
        return perspectiveItems[name].class;
    }else if(type === "pixi") {
        return pixiItems[name].class;
    }else {
        console.log("WRONG type")
    }
}
