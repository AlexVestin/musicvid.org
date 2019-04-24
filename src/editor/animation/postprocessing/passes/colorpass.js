import ShaderPass from "./shaderpass";

export default class ColorPass extends ShaderPass {

    constructor(shader, textureID, name) {
        super(name)
        const group = {
            title: "Settings",
            items: {
                amount: {value: 1, type: "Number"},
                baseAmount: {value: 10, type: "Number"},
            }
        }

        this.config.defaultConfig.push(group)
    }

    update = (time, frequencyBins) => {
        let avg = 0.0
        for(var i = 0; i < 4; i++) {
            avg += frequencyBins[i]
        }
        avg = avg / (4 * 128) || 1 

        this.uniforms.amount.value = avg
    }

    edit = (key, value) =>  {
        this.uniforms[key].value = value
    }

}