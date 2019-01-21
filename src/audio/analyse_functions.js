

export function smooth(array, object) {
    const  { smoothingPasses, smoothingPoints } = object;
    var lastArray = array;
    for (var pass = 0; pass < smoothingPasses; pass++) {
        var sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
        var cn = 1 / (2 * sidePoints + 1); // constant
        var newArr = [];
        for (var i = 0; i < sidePoints; i++) {
            newArr[i] = lastArray[i];
            newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (var i = sidePoints; i < lastArray.length - sidePoints; i++) {
            var sum = 0;
            for (var n = -sidePoints; n <= sidePoints; n++) {
                sum += cn * lastArray[i + n] + n;
            }
            newArr[i] = sum;
        }
        lastArray = newArr;
    }
    return newArr;
}

export function transformToVisualBins(array, spectrumSize, spectrumScale, spectrumStart, spectrumEnd) {
    var newArray = new Uint8Array(spectrumSize);
    for (var i = 0; i < spectrumSize; i++) {
        var bin = Math.pow(i / spectrumSize, spectrumScale) * (spectrumEnd - spectrumStart) + spectrumStart;
        newArray[i] = array[Math.floor(bin) + spectrumStart] * (bin % 1)
                + array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1))
    }
    return newArray;
}

export function normalizeAmplitude(array, object) {
    const {  spectrumSize, spectrumHeight } = object;
    var values = [];
    for (var i = 0; i < spectrumSize; i++) {
        values[i] = array[i] / 255 * spectrumHeight;
  
    }
    return values;
}

export function averageTransform(array, object) {
    const { spectrumHeight } = object;
    let values = [];
    let length = array.length;

    let prevValue, curValue, nextValue, value;

    for (var i = 0; i < length; i++) {
        value = 0;
        if (i == 0) {
            value = array[i];
        } else if (i == length - 1) {
            value = (array[i - 1] + array[i]) / 2;
        } else {
            prevValue = array[i - 1];
            curValue = array[i];
            nextValue = array[i + 1];

            if (curValue >= prevValue && curValue >= nextValue) {
              value = curValue;
            } else {
              value = (curValue + Math.max(nextValue, prevValue)) / 2;
            }
        }
        //value = Math.min(value + 1, spectrumHeight);

        values[i] = value;
    }

    var newValues = [];
    for (var i = 0; i < length; i++) {
        value = 0;
        if (i == 0) {
            value = values[i];
        } else if (i == length - 1) {
            value = (values[i - 1] + values[i]) / 2;
        } else {
            prevValue = values[i - 1];
            curValue = values[i];
            nextValue = values[i + 1];

            if (curValue >= prevValue && curValue >= nextValue) {
              value = curValue;
            } else {
              value = ((curValue / 2) + (Math.max(nextValue, prevValue) / 3) + (Math.min(nextValue, prevValue) / 6));
            }
        }
        //value = Math.min(value + 1, spectrumHeight);

        newValues[i] = value;
    }
    return newValues;
}

export function tailTransform(array, object) {
    const  { 
        spectrumSize,
        headMargin,
        headMarginSlope,
        marginDecay,
        tailMargin,
        minMarginWeight,
        tailMarginSlope 
    } = object;
    
    var values = [];
    for (var i = 0; i < spectrumSize; i++) {
        var value = array[i];
        if (i < headMargin) {
            value *= headMarginSlope * Math.pow(i + 1, marginDecay) + minMarginWeight;
        } else if (spectrumSize - i <= tailMargin) {
            value *= tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) + minMarginWeight;
        }
        values[i] = value;
    }
    return values;
}


export function exponentialTransform(array, object) {
    const {  spectrumMaxExponent,
        spectrumMinExponent,
        spectrumSize,
        spectrumHeight,
        spectrumExponentScale} = object;
    
    var newArr = [];
    for (var i = 0; i < array.length; i++) {
        var exp = (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;
        newArr[i] = Math.max(Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight, 1);
    }
    return newArr;
}

// top secret bleeding-edge shit in here
export function experimentalTransform(array) {
    var resistance = 3; // magic constant
    var newArr = [];
    for (var i = 0; i < array.length; i++) {
        var sum = 0;
        var divisor = 0;
        for (var j = 0; j < array.length; j++) {
            var dist = Math.abs(i - j);
            var weight = 1 / Math.pow(2, dist);
            if (weight == 1) weight = resistance;
            sum += array[j] * weight;
            divisor += weight;
        }
        newArr[i] = sum / divisor;
    }
    return newArr;
}