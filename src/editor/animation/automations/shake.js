

export default class ShakeAutomation {
    shake = (multiplier) => {
        let step = this.maxShakeIntensity * multiplier;
        this.waveFrameX += step * this.waveSpeedX;
    
        if (Math.abs(this.waveFrameX) > this.wave_DURATION) {
            this.waveFrameX = 0;
            this.waveAmplitudeX = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeX);
            this.waveSpeedX = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeX);
            this.trigX = Math.round(Math.random());
        }
        this.waveFrameY += step * this.waveSpeedY;
        if (Math.abs(this.waveFrameY) > this.wave_DURATION) {
            this.waveFrameY = 0;
    
            this.waveAmplitudeY = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeY);;
            this.waveSpeedY = this.random(this.minShakeScalar, this.maxShakeScalar) * this.direction(this.sumShakeY);
            this.trigY = Math.round(Math.random());
        }
    
        
        let trigFuncX = this.trigX === 0 ? Math.cos : Math.sin;
        let trigFuncY = this.trigY === 0 ? Math.cos : Math.sin;
    
        let dx = trigFuncX(this.waveFrameX) * this.maxShakeDisplacement * this.waveAmplitudeX * multiplier * this.movementAmount;
        let dy = trigFuncY(this.waveFrameY) * this.maxShakeDisplacement * this.waveAmplitudeY * multiplier * this.movementAmount;
    
        this.sumShakeX += dx;
        this.sumShakeY += dy;
    }
} 

