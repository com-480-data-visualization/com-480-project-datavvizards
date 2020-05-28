
const labelOffsetY = -8;

export class TextUtils {
    static baseFontSize = 15;

    constructor(ctx, transform) {
        this.ctx = ctx;
        this.transform = transform;
    }

    withTransform = (transform) => {
        this.currentK = transform.k;
        this.transform = transform;
        return this;
    }

    drawLabel = (layout) => {
        let d = layout.data;
        this.ctx.fillText(d.city, layout.topLeft.x, layout.bottomRight.y);
        if (d.highlight) {
            this.ctx.fillRect(layout.topLeft.x,
                layout.bottomRight.y + 2 / this.currentK,
                (layout.bottomRight.x - layout.topLeft.x),
                1 / this.currentK)
        }
    }

    drawSurrondingBox = (layout) => {
        this.ctx.fillRect(layout.topLeft.x,
            layout.topLeft.y + 3 / this.currentK,
            (layout.bottomRight.x - layout.topLeft.x),
            (layout.bottomRight.y - layout.topLeft.y))
    }

    drawLabels = () => {
        // this.ctx.fillStyle = 'rgba(10, 19, 32, 0.8)';
        this.ctx.fillStyle = "#010219"
        this.layout.forEach(this.drawSurrondingBox)
        this.ctx.fillStyle = "white";
        this.layout.forEach(this.drawLabel)
    }


    static getFont = (fontSize) => {
        return `600 ${fontSize}px Helvetica Neue, sans-serif`
    }

    static labelsOverlap = (a, b) => {
        if (a.topLeft.x >= b.bottomRight.x || b.topLeft.x >= a.bottomRight.x)
            return false

        if (a.topLeft.y >= b.bottomRight.y || b.topLeft.y >= a.bottomRight.y)
            return false

        return true
    }

    static labelXOffset = (textMeasure) => {
        let x = - textMeasure / 2;
        return x;
    }

    labelLayout = (d, textMeasure) => {
        const xOffset = TextUtils.labelXOffset(textMeasure);
        const height = this.fontSize;
        let width = textMeasure;
        let y = d.cy + labelOffsetY / this.currentK;
        let x = d.cx + xOffset;
        return {
            xOffset: xOffset,
            topLeft: { x: x, y: y - height },
            bottomRight: { x: x + width, y: y },
            data: d
        }
    }

    static partitionByExistingTextVisibility(a) {
        const viz = [];
        const non_viz = [];
        a.forEach(a => {
            if (a.textVisible)
                viz.push(a)
            else
                non_viz.push(a);
        })
        return [viz, non_viz]
    }

    layOut = (toLayout, textLayout) => {
        toLayout.forEach((d) => {
            const textMeasure = this.ctx.measureText(d.city).width;
            const labelLayout = this.labelLayout(d, textMeasure)

            for (let i = 0; i < textLayout.length; i++) {
                const other = textLayout[i];
                if (TextUtils.labelsOverlap(labelLayout, other)) {
                    d.textVisible = false;
                    return;
                }
            }
            labelLayout.data.textVisible = true;
            textLayout.push(labelLayout);
        })

        return textLayout;
    }

    /*
      Show more cities as the user zooms in
      The lower the population the closer the zoom that is required
      Always show top 10 cities
    */
    labelShouldBeVisible = (d) => {
        return (d.rank < 11 || d.scale <= this.currentK)
    }

    /*
        Calculate which labels don't overlap with each other
        and create objects that will contain the information
        about the current position of the labels as well as their bounding boxes
    */
    calculateTextLayout = (visibleDots) => {
        this.fontSize = Math.max(12 / this.currentK, TextUtils.baseFontSize / (Math.pow(this.currentK, 1.8)));
        this.ctx.font = TextUtils.getFont(this.fontSize);

        /*
           Try to first layout the cities that are already visible in order to avoid flickering
           then layout the rest with larger cities taking priority
        */
        const [laidOut, toLayout] = TextUtils.partitionByExistingTextVisibility(
            visibleDots.filter((d) => this.labelShouldBeVisible(d))
                .sort((a, b) => a.rank - b.rank))

        const textLayout = this.layOut(laidOut, []);
        this.layout = this.layOut(toLayout, textLayout)
    }

    insideTextRectangle = (point, textLayout) => {
        return (point.x > textLayout.topLeft.x && point.x < textLayout.bottomRight.x) &&
            (point.y > textLayout.topLeft.y && point.y < textLayout.bottomRight.y)
    }

    findUnderMouseId = (e) => {
        //Figure out where the mouse click occurred.
        const mouseX = (e.layerX - this.transform.x) / this.currentK;
        const mouseY = (e.layerY - this.transform.y) / this.currentK
        const point = { x: mouseX, y: mouseY }

        if (!this.layout)
            return null;

        const found = this.layout.find(t => this.insideTextRectangle(point, t))
        if (found)
            return found.data.id;

        return null;
    }
}