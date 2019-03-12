import license from 'editor/util/License'

export default class BaseItem {
    LICENSE = license;
    __attribution = {
        showAttribution: false,
        name:"",
        authors: [
        ],
        description: "",
        license: "",
        changeDisclaimer: true,
        imageUrl: ""
    }

    // handles all updates in the render-loop 
    update = (time, audioData) => {}

    // should handle all drawing, but not update ANY stuff
    render = (time) => {}

    stop = () => {}
    play = () => {}
    setUpGUI =  () => {}
}