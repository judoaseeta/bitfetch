import Ball, { BallProps, BallUpdateProps } from './Ball';
import urlFunc from './imageUrl';
interface MainCanvasImageProps extends BallProps{
    coinName: string; // image url;
    da: number; // velocity for rotate angle.
}
interface MainCanvasUpdateProps {
    ctx: CanvasRenderingContext2D; // canvas reference
    animateTimeDelta: number; //
    contextWidth: number; // canvas width;
    contextHeight: number; // canvas height;
}
class MainCanvasImage extends Ball{
    private img: HTMLImageElement | null = null;
    private angle: number = 0;
    private da: number;
    private src: string;
    private coinName: string;
    constructor(props: MainCanvasImageProps) {
        super(props);
        this.da = props.da;
        this.src = urlFunc(props.coinName);
        this.coinName = props.coinName
    }

    async load() {
        return new Promise((res, rej) => {
            this.img = new Image();
            this.img.src = this.src;
            this.img!.onload = res;
            this.img!.onerror = rej;
        })
    }
    get name() {
        return this.coinName;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.arc((this.x + this.radius / 2), (this.y + this.radius / 2), this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(this.img!, this.x, this.y, this.radius, this.radius);

        ctx.beginPath();
        ctx.arc(this.x, this.y, 25, 0, Math.PI * 2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();
    }
    update({willCollide, target, contextHeight, contextWidth, animateTimeDelta}: BallUpdateProps) {
        super.update({willCollide, target, contextHeight, contextWidth, animateTimeDelta});
        const angleParam = this.da * animateTimeDelta;
        if(this.angle + angleParam >= 360 || this.angle - angleParam <=0) this.da = -this.da;
        this.angle += Number(((Math.PI/ 180) *  this.da * animateTimeDelta).toFixed(2));
    }
}

export default MainCanvasImage;
