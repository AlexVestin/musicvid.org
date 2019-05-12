import Automation from "./Automation";
import EasingFunctions from './EasingFunctions';
import  { serializeObject } from '../Serialize'


function lerp(x, v0, v1){
    return (1 - x) * v0 + x * v1;
}

export default class PointAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "point";
        this.name = "Point Thing";
        this.points = [];
        this.interpolation = "linear";
    }

    __serialize = () => {
        const obj = serializeObject(this); 
        obj.points = this.points;
        return obj;
    } 

    interpolate = (time, t0, v0, t1, v1) => {
        const x = (time - t0) / (t1 - t0);
        let amt = EasingFunctions[this.interpolation](x);
        return lerp(amt, v0, v1);
    };

    getValue = (sortedPoints, time) => {
        if (sortedPoints.length === 0) {
            return 0;
        } 

        if (time < sortedPoints[0].time) {
            return (time / sortedPoints[0].time) * sortedPoints[0].value;
        } else if (time >= sortedPoints[sortedPoints.length - 1].time) {
            return sortedPoints[sortedPoints.length - 1].value;
        }

        for (var i = 1; i < sortedPoints.length; i++) {
            let p = sortedPoints[i];
            if (p.time >= time) {
                const lastPoint = sortedPoints[i - 1];
                return this.interpolate(
                    time,
                    lastPoint.time,
                    lastPoint.value,
                    p.time,
                    p.value
                );
            }
        }
    };

    update = (time, audioData) => {
        const sortedPoints = this.points.sort((a, b) => a.time - b.time);
        this.value = this.getValue(sortedPoints, time);
    };
}
