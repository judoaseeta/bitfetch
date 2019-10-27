
export interface BallProps {
    color?: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    radius: number;
}
export interface BallUpdateProps {
    contextWidth: number;
    contextHeight: number;
    animateTimeDelta: number;
    willCollide?: boolean;
    target?: Ball;
}
class Ball {
    private props : BallProps;
    constructor(props: BallProps) {
        this.props = props;
    }
    get x() {
        return this.props.x;
    }
    get y() {
        return this.props.y;
    }
    get color() {
        return this.props.color;
    }
    get dx() {
        return this.props.dx;
    }
    get dy() {
        return this.props.dy;
    }
    get radius() {
        return this.props.radius;
    }
    set x(newX: number) {
        this.props.x = newX;
    }
    set y(newY: number) {
        this.props.y = newY;
    }
    set dx(newDx: number) {
        this.props.dx = newDx;
    }
    set dy(newDy: number) {
        this.props.dy = newDy;
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.fillStyle = this.color!;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
    update({ willCollide, target, contextHeight, contextWidth, animateTimeDelta }: BallUpdateProps) {
        if(!willCollide) {
            if(this.x + this.radius >= contextWidth || this.x - this.radius < 0) this.dx = -this.dx;
            if(this.y +  this.radius >= contextHeight || this.y - this.radius < 0) this.dy = -this.dy;
        } else {
            const [ proofX, proofY] = this.preventCollision(target!);
            this.dx = proofX;
            this.dy = proofY;
        }
        this.x = Number(( this.x + (this.dx * animateTimeDelta)).toFixed(2));
        this.y = Number((this.y + (this.dy * animateTimeDelta)).toFixed(2));
    }
    preventCollision(target: Ball) {
        const xDist = target.x - this.x;
        const yDist = target.y - this.y;
        return [ xDist > 0 ? -Math.abs(this.dx) : +Math.abs(this.dx)
            , yDist > 0 ? -Math.abs(this.dy) : +Math.abs(this.dy)];
    }
}

export default Ball;