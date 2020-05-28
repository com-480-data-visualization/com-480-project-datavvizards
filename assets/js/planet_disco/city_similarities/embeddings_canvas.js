import { TextUtils } from './text_layout'

const PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

const isChrome = !!window.chrome;

export default class EmbeddingsCanvas {
    constructor(d3Canvas) {
        this.canvas = d3Canvas.node()
        this.d3 = d3Canvas
        this.ctx = this.canvas.getContext("2d");
        this.setCtxProperties();
    }

    setCtxProperties = () => {
        this.d3.style.position = "absolute";
        this.ctx.font = TextUtils.getFont(TextUtils.baseFontSize);
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "left";
    }

    clear = () => {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    setDimensions = (width, height) => {
        this.width = width;
        this.height = height;

        let canvasNode = this.canvas;
        let ratio = isChrome ? Math.min(2, PIXEL_RATIO) : 1;

        canvasNode.width = width * ratio;
        canvasNode.height = height * ratio;

        canvasNode.style.width = width + "px";
        canvasNode.style.height = height + "px";
        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        return this;
    }

    rescaleContext = (transform) => {
        this.ctx.save();
        this.ctx.translate(transform.x, transform.y);
        this.ctx.scale(transform.k, transform.k);
    }

    doAtScale = (transform, f) => {
        this.rescaleContext(transform);
        f()
        this.ctx.restore();
    }
}