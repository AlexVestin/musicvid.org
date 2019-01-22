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
            newArr[lastArray.length - i - 1] =
                lastArray[lastArray.length - i - 1];
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
    const { spectrumSize, spectrumScale, spectrumStart, spectrumEnd } = object;
    var newArray = new Uint8Array(spectrumSize);
    for (var i = 0; i < spectrumSize; i++) {
        var bin =
            Math.pow(i / spectrumSize, spectrumScale) *
                (spectrumEnd - spectrumStart) +
            spectrumStart;
        newArray[i] =
            array[Math.floor(bin) + spectrumStart] * (bin % 1) +
            array[Math.floor(bin + 1) + spectrumStart] * (1 - (bin % 1));
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
    let t;
    for(var i = 0; i < array.length; i++) {
        if(array[i] > prevArr[i] || prevArr - dropoffAmount < 0) {
            newArr[i] = array[i];
        }else {
            t = prevArr[i] - dropoffAmount
            newArr[i] = t > 0 ? t : 0.001;
        }
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