import {
    normalizeAmplitude,
    averageTransform,
    tailTransform,
    smooth,
    exponentialTransform,
    transformToVisualBins,
    smoothDropoff,
    logTransform,
    toWebAudioForm, 
    getByteSpectrum
} from "./analyse_functions";

export default function SpectrumAnalyser(gui, object) {
    this.object = object;

    let addAttribute = (name, value, folder, configs = {}) => {
        this[name] = value;
        folder.add(this, name, configs.min, configs.max);
    };

    // ----
    const f1 = gui.addFolder("General settings");
    addAttribute("spectrumSize", 64, f1, { min: 0 });
    addAttribute("shouldCapHeight", false, f1, { min: 0 });

    addAttribute("spectrumHeight", 280, f1, { min: 0 });
    addAttribute("spectrumStart", 4, f1, { min: 0 });
    addAttribute("spectrumEnd", 1200, f1, { min: 0 });
    addAttribute("spectrumScale", 2.5, f1, { min: 0 });

    const f2 = gui.addFolder("Transformations");
    addAttribute("enableToWebAudioForm", true, f2);
    addAttribute("enableLogTransform", true, f2);
    addAttribute("enableCombineBins", true, f2);
    addAttribute("enableNormalizeTransform", true, f2);
    addAttribute("enableAverageTransform", true, f2);
    addAttribute("enableTailTransform", true, f2);
    addAttribute("enableExponentialTransform", true, f2);
    addAttribute("enableSmoothingTransform", true, f2);
    addAttribute("enableDropoffSmoothingTransform", true, f2);
    

    const f6 = gui.addFolder("Web Audio Conversion");
    addAttribute("smoothingTimeConstant", 0.8, f6, { min: 0, max: 1.0 });
    addAttribute("minDecibel", -100, f6, { min: -100, max: 0 });
    addAttribute("maxDecibel", -10, f6, { min: -100, max: 0 });


    // ---
    const f3 = gui.addFolder("Exponential settings");
    addAttribute("spectrumMaxExponent", 6, f3, { min: 0 });
    addAttribute("spectrumMinExponent", 3, f3, { min: 0 });
    addAttribute("spectrumExponentScale", 2, f3, { min: 0 });

    // ---
    const f4 = gui.addFolder("Smoothing");
    addAttribute("smoothingPoints", 3, f4, { min: 0 });
    addAttribute("smoothingPasses", 1, f4, { min: 0 });
    addAttribute("headMargin", 7, f4, { min: 0 });
    addAttribute("tailMargin", 0, f4, { min: 0 });
    addAttribute("minMarginWeight", 0.7, f4, { min: 0 });
    addAttribute("marginDecay", 1.6, f4, { min: 0 });
    addAttribute("headMarginSlope", 0.013334120966221101, f4, { min: 0 });
    addAttribute("tailMarginSlope", 1, f4, { min: 0 });

    const f5 = gui.addFolder("Dropoff Smoothing");
    addAttribute("dropoffAmount", 0.2, f5, { min: 0 });

    this.prevOrigArray = [];


    this.analyse = (array) => {
        let newArr = array.slice();
        if(this.enableToWebAudioForm) {
            newArr = toWebAudioForm(newArr, this.prevOrigArray, this.smoothingTimeConstant);
            this.prevOrigArray = newArr.slice();
            newArr = getByteSpectrum(newArr, this.minDecibel, this.maxDecibel);
        }

        if(this.enableCombineBins) newArr = transformToVisualBins(newArr, this);
        //if(this.enableLogTransform) newArr = logTransform(newArr, this);
        if(this.enableNormalizeTransform) newArr = normalizeAmplitude(newArr, this);
        if(this.enableAverageTransform) newArr = averageTransform(newArr, this);
        if(this.enableTailTransform) newArr = tailTransform(newArr, this);
        if(this.enableSmoothingTransform) newArr = smooth(newArr, this);
        if(this.enableExponentialTransform) newArr = exponentialTransform(newArr, this);
        if(this.enableDropoffSmoothingTransform) newArr = smoothDropoff(newArr, this);
        this.prevArr = newArr;
        return newArr;
    }
}
