type CurveProps = {
    x: number;
    y: number;
    dx: number;
    dy: number;
}
class Curve {
    private x: number;
    private y: number;
    private dx: number;
    private dy: number;
    constructor({ x, y, dx, dy}: CurveProps) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
    }
    update(ctx: CanvasRenderingContext2D) {

    }
}