import {
    average
} from "./analyse_functions";

export default function ImpactAnalyser(gui, object) {
    this.object = object;

    let addAttribute = (name, value, folder, configs = {}) => {
        this[name] = value;
        folder.add(this, name, configs.min, configs.max);
    };

    // ----
    const f1 = gui.addFolder("Impact Analysis Settings");
    addAttribute("startBin", 0, f1, { min: 0 });
    addAttribute("endBin", 1000, f1, { min: 0 });

    addAttribute("baseAmount", 1, f1, { min: 0 });
    addAttribute("enableImpactAnalysis", true, f1, { min: 0 });
    addAttribute("amplitude", 64, f1, { min: 0 });
    addAttribute("maxAmount", 280, f1, { min: 0 });
    addAttribute("minAmount", 0, f1, { min: 0 });

    addAttribute("useDeltaSmoothing", true, f1, { min: 0 });
    addAttribute("minDeltaNeededToTrigger", 0.01, f1, { min: 0 });
    addAttribute("deltaDecay", 4, f1, {min: 0});
   
    this.lastAmount = 0;
    this.analyse = (array) => {
        let newArr = array.slice();
        let amount = this.baseAmount;
        if(this.enableImpactAnalysis) amount = average(newArr, this);

        if(this.useDeltaSmoothing) {
            if(amount - this.lastAmount < this.minDeltaNeededToTrigger) {
                amount = this.lastAmount - this.deltaDecay;
            }
        }

        amount = amount * this.amplitude / 64;
        if(amount > this.maxAmount) 
            amount = this.maxAmount;
        
        if(amount < this.minAmount)
            amount = this.minAmount;


        this.lastAmount = amount;

        return this.amplitude * amount / 64;
    }
}
