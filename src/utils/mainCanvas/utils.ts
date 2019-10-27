export function getDistance(fromX:number, fromY: number, toX: number, toY: number) {
    return Math.hypot(toX - fromX, fromY - toY );
}