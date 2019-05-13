import * as THREE from 'three';


export default class ImageMaterial extends THREE.MeshBasicMaterial{

    constructor(item) {
        super();
        this.transparent = true;
        this.video = document.createElement('video'); 
        this.tex = new THREE.VideoTexture(this.video)
        this.map = this.tex;
        this.path = "material";
        this.fps = 60;
        this.parent = item;
        this.frame = 0;

        this.parent.__isEncoding =  true;
    }

    setResolve = (resolve, reject) => {
        this.seekResolve = resolve;
    }

    updateMaterial = async (time, audioData) => {
       
        
        if(this.parent.__isEncoding) {
            this.video.currentTime = this.frame++ / this.fps;
            this.tex.needsUpdate = true;this.tex.needsUpdate = true;
            await new Promise(this.setResolve);

        }
    }

    play = (t) => {
        this.video.currentTime = t;
        if(!this.parent.__isEncoding) {
            this.video.play();
        }
    }

    stop = () => {
        this.video.pause();
        this.video.currentTime = 0;
    }

    seekTime = (t) => {
        this.video.currentTime = t;
    }

    loadVideoFile() {
        this.folder.getRoot().modalRef.toggleModal(20).then(selected => {
            if(selected) {
                this.loadVideo(selected)
            }
        })
    }

    loadVideo = async (file) => {
        this.video.src = URL.createObjectURL(file); 
        this.tex.minFilter = THREE.LinearFilter;
        this.tex.magFilter = THREE.LinearFilter;
        this.tex.format = THREE.RGBFormat;
        document.body.appendChild(this.video);
        this.video.muted = true;


        this.seekResolve  = () => console.log("seek resolve");
        this.video.addEventListener('seeked', async () => {
            this.seekResolve();
        });

        
        while((this.video.duration === Infinity || isNaN(this.video.duration)) && this.video.readyState < 2) {
            await new Promise(r => setTimeout(r, 1000));
            this.video.currentTime = 10000000*Math.random();
        }
    }
    

    
    __setUpGUI = (f) => {
        const folder = f; 
        const i = this.parent;
        i.addController(folder, this, "loadVideoFile");
        i.addController(folder, this, "fps", {min: 1, max: 100});
        this.folder = f;
    }
}