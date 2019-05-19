/*
New BSD License (BSD-new)

Copyright (c) 2015 Maxim Roncacé
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    - Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    - Neither the name of the copyright holder nor the names of its contributors
      may be used to endorse or promote products derived from this software
      without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

export function smooth(array, object) {
    const { smoothingPasses, smoothingPoints } = object;
    var lastArray = array;
    for (var pass = 0; pass < smoothingPasses; pass++) {
        var sidePoints = Math.floor(smoothingPoints / 2); // our window is centered so this is both nL and nR
        var cn = 1 / (2 * sidePoints + 1); // constant
        var newArr = [];
        var i;
        for (i = 0; i < sidePoints; i++) {
            newArr[i] = lastArray[i];
            newArr[lastArray.length - i - 1] = lastArray[lastArray.length - i - 1];
        }
        for (i = sidePoints; i < lastArray.length - sidePoints; i++) {
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

export function transformToVisualBins(array, object) {
    const { spectrumSize, spectrumScale, spectrumStart, spectrumEnd, mult } = object;
    if(spectrumStart >= spectrumEnd || spectrumStart < 0)     {
        return array;
    }
        
    const end = Math.min(array.length, spectrumEnd);    
    const start = Math.max(0, spectrumStart);

    let m = mult || 1.0;
    var newArray = new Uint8Array(spectrumSize);
    for (var i = 0; i < spectrumSize; i++) {
        var bin =
            Math.pow(i / spectrumSize, spectrumScale) *
                (end - start) + start;
        newArray[i] =
            array[Math.floor(bin) + start] * (bin % 1) +
            array[Math.floor(bin + 1) + start] * (1 - (bin % 1));
        
        newArray[i] *= m;
    }
    return newArray;
}

export function normalizeAmplitude(array, object) {
    const { spectrumSize, spectrumHeight } = object;
    var values = [];
    for (var i = 0; i < spectrumSize; i++) {
        values[i] = (array[i] / 255) * spectrumHeight;
    }
    return values;
}

export function averageTransform(array, object) {
    const { spectrumHeight, shouldCapHeight } = object;
    let values = [];
    let length = array.length;

    let prevValue, curValue, nextValue, value;
    var i;

    for (i = 0; i < length; i++) {
        value = 0;
        if (i === 0) {
            value = array[i];
        } else if (i === length - 1) {
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
        if(shouldCapHeight)
            value = Math.min(value + 1, spectrumHeight);

        values[i] = value;
    }

    var newValues = [];
    for (i = 0; i < length; i++) {
        value = 0;
        if (i === 0) {
            value = values[i];
        } else if (i === length - 1) {
            value = (values[i - 1] + values[i]) / 2;
        } else {
            prevValue = values[i - 1];
            curValue = values[i];
            nextValue = values[i + 1];

            if (curValue >= prevValue && curValue >= nextValue) {
                value = curValue;
            } else {
                value =
                    curValue / 2 +
                    Math.max(nextValue, prevValue) / 3 +
                    Math.min(nextValue, prevValue) / 6;
            }
        }
        if(shouldCapHeight)
            value = Math.min(value + 1, spectrumHeight);

        newValues[i] = value;
    }
    return newValues;
}

export function tailTransform(array, object) {
    const {
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
            value *=
                headMarginSlope * Math.pow(i + 1, marginDecay) +
                minMarginWeight;
        } else if (spectrumSize - i <= tailMargin) {
            value *=
                tailMarginSlope * Math.pow(spectrumSize - i, marginDecay) +
                minMarginWeight;
        }
        values[i] = value;
    }
    return values;
}

export function exponentialTransform(array, object) {
    const {
        spectrumMaxExponent,
        spectrumMinExponent,
        spectrumSize,
        spectrumHeight,
        spectrumExponentScale
    } = object;

    var newArr = [];
    for (var i = 0; i < array.length; i++) {
        var exp =
            (spectrumMaxExponent - spectrumMinExponent) * (1 - Math.pow(i / spectrumSize, spectrumExponentScale)) + spectrumMinExponent;

        newArr[i] = Math.max(
            Math.pow(array[i] / spectrumHeight, exp) * spectrumHeight,
            0.1
        );
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
            if (weight === 1) weight = resistance;
            sum += array[j] * weight;
            divisor += weight;
        }
        newArr[i] = sum / divisor;
    }
    return newArr;
}

export function smoothDropoff(array, object) {
    const { prevArr, dropoffAmount } = object;
    if(!prevArr) return array;

    var newArr = [];
    for(var i = 0; i < array.length; i++) {
        newArr[i] = (array[i] + (prevArr[i] * dropoffAmount)) / (1+dropoffAmount)
        if(newArr[i] <= 0) newArr[i] = 0.01
        /*
        if(array[i] > prevArr[i] || prevArr - dropoffAmount < 0) {
            newArr[i] = array[i];
        }else {
            t = prevArr[i] - dropoffAmount
            newArr[i] = t > 0 ? t : 0.001;
        }*/
    }

    return newArr;
}


export function logTransform(array, object) {
    var newArr = [];
    for(var i = 0; i < array.length; i++) {
        if(array[i] === 0) {
            newArr[i] = 0;
        }else {
            newArr[i] = 20*Math.log(array[i]*array[i]);
        }
    }

    return newArr;
}

// https://github.com/WebKit/webkit/blob/89c28d471fae35f1788a0f857067896a10af8974/Source/WebCore/platform/audio/AudioUtilities.cpp
function linearToDecibel(linear) {
    if(!linear)
        return -1000;
    
    return 20 * Math.log10(linear);
}

// https://github.com/WebKit/webkit/blob/master/Source/WebCore/Modules/webaudio/RealtimeAnalyser.cpp
export function getByteSpectrum(magnitudeBuffer, minDec=-100, maxDec=-10) {
    const UCHAR_MAX = 255;
    const sourceLength = magnitudeBuffer.length;
    const rangeScaleFactor = (minDec === maxDec) ? 1 : 1 / (maxDec - minDec);
    let newArr = new Uint8Array(sourceLength);
    for(var i = 0; i < sourceLength; i++) {
        const linearValue = magnitudeBuffer[i];
        const dbMag = !linearValue ? minDec : linearToDecibel(linearValue);
        let scaledValue =  UCHAR_MAX * (dbMag - minDec) * rangeScaleFactor;
    
        if(scaledValue < 0)
            scaledValue = 0;
        if(scaledValue > UCHAR_MAX)
            scaledValue = UCHAR_MAX;
        
        newArr[i] = scaledValue;
    }

    return newArr;
}

// https://github.com/WebKit/webkit/blob/master/Source/WebCore/Modules/webaudio/RealtimeAnalyser.cpp
// https://stackoverflow.com/questions/14169317/interpreting-web-audio-api-fft-results
export function toWebAudioForm(arr, prevArr, smoothingTimeConstant, arrSize = null) {
    let newArr = [];
    const magnitudeScale = 1.0 / (arrSize ? arrSize*2 : arr.length*2);
    let k = smoothingTimeConstant;
    k = Math.max(0.0, k);
    k = Math.min(1.0, k);
    for(var i = 0; i < arr.length; ++i) {
        const scalarMagnitude = arr[i] * magnitudeScale;
        const p = prevArr[i] ? prevArr[i] * k : 0; 
        newArr[i] = p + (1 - k) * scalarMagnitude;
    }

    return newArr;
}

export function average(array, object) {
    const { startBin, endBin }= object;
    let avg = 0.0;

    const len = Math.min(array.length, endBin);
    if(startBin > len)
        return 0;
    
    if(endBin <= startBin)
        return 0;

    for(var i = startBin; i < len; i++) {
        avg += array[i];
    }

    return avg / (len - startBin);
}

export function interpolateArray(data, fitCount, mult) {

    var linearInterpolate = function (before, after, atPoint) {
        return before + (after - before) * atPoint;
    };

    var newData = [];
    var springFactor = Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for ( var i = 1; i < fitCount - 1; i++) {
        var tmp = i * springFactor;
        var before = Number(Math.floor(tmp)).toFixed();
        var after = Number(Math.ceil(tmp)).toFixed();
        var atPoint = tmp - before;
        newData[i] = linearInterpolate(data[before], data[after], atPoint) * mult / 30;
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
    return newData;
};