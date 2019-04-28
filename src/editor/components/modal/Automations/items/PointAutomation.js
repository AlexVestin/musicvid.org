import Automation from "./Automation";

export default class PointAutomation extends Automation {
    constructor(gui) {
        super(gui);
        this.type = "point";
        this.name = "Point Thing";
        this.__objectsToSerialize = ["points"];
        this.points = [];
    }

    lerp = (time, t0, v0, t1, v1) => {
        const amt = (time - t0) / (t1 - t0);
        return (1 - amt) * v0 + amt * v1;
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
                return this.lerp(
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
