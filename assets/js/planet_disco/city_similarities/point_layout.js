
export class PointsLayout {
    constructor(ctx) {
        this.ctx = ctx;
    }

    atScale = (currentK) => {
        this.currentK = currentK;
        return this
    }

    drawGlow = (visible) => {
        this.ctx.fillStyle = 'white';
        const radiusScale = 1.5;
        visible.forEach((d) => {
            if (d.highlight || d.selected)
                this.drawPoint(d, this.ctx, radiusScale)
        })
    }

    drawPoint = (d, context, radiusScale = 1) => {
        context.beginPath();
        context.arc(d.cx, d.cy, radiusScale * d.radius / this.currentK, 0, 2 * Math.PI);
        context.fill();
    }

    drawPoints = (visible) => {
        this.drawGlow(visible);
        let prevColor = null
        visible.sort((d) => d.color).forEach(d => {
            if (d.color != prevColor) { //sort by color to make few state updates to the canvas
                this.ctx.fillStyle = d.color;
                prevColor = d.color;
            }
            this.drawPoint(d, this.ctx)
        })
    }
}