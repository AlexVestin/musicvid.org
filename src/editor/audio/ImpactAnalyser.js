import {
    average
} from "./analyse_functions";

export default function ImpactAnalyser(gui, parent = null, disable = false, disableLinking = false) {
    let addAttribute = (name, value, folder, configs = {}) => {
        this[name] = value;

        let c;
        if(folder && !parent) {
            c = folder.add(this, name, configs.min, configs.max);
        }else {
            c = parent.addController(folder, this, name, {min: configs.min, max: configs.max, path: "impact-analyser" });
        }

        if(disable) {
            c.disableAutomations();
        }

        if(disableLinking) {
            c.disableAll();
        }

        return c;
    };
    // ----
    let f1;
    if(gui)
     f1 = gui.addFolder("Audio Impact Analysis Settings");
    addAttribute("startBin", 0, f1, { min: 0 });
    addAttribute("endBin", 160, f1, { min: 0 });

    addAttribute("baseAmount", 1, f1, { min: 0 });
    addAttribute("enableImpactAnalysis", true, f1, { min: 0 });
    addAttribute("amplitude", 64, f1, { min: 0 });

    let f13 = f1.addFolder("Clamping");
    addAttribute("maxAmount", 280, f13, { min: 0 });
    addAttribute("minAmount", 0, f13, { min: 0 });
    addAttribute("minThreshold", 0, f13, { min: 0 });

    let f12 = f1.addFolder("Smoothing");
    addAttribute("useDeltaSmoothing", false, f12, { min: 0 });
    addAttribute("minDeltaNeededToTrigger", 3, f12, { min: 0 });
    addAttribute("deltaDecay", 0.25, f12, {min: 0});
    this.folder = f1;

   
    this.lastAmount = 0;
    this.analyse = (array) => {
        
        let newArr = array.slice();
        let amount = this.baseAmount;
        if(this.enableImpactAnalysis) amount = average(newArr, this);
        const amp = this.amplitude / 1024;
        amount = amount * amp;

        if(this.useDeltaSmoothing) {
            const delta = amount - this.lastAmount; 
            if(delta < this.minDeltaNeededToTrigger * amp ) {
                amount = this.lastAmount - (this.deltaDecay * amp);
            }
        }
        
        if(amount > this.maxAmount) 
            amount = this.maxAmount;
        
        if(amount < this.minAmount)
            amount = this.minAmount;
        
        if(amount < this.minThreshold)
            amount = 0;

        this.lastAmount = amount;
        return amount;
    }
}
