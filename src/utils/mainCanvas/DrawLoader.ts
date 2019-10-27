import { quadtree } from 'd3-quadtree';
import Ball from './Ball';
import MCI from './mainCanvasImage';
import findCandidate from './findCandidate';
import * as React from "react";
function DrawLoader(balls: Ball[], images: MCI[], ctx: CanvasRenderingContext2D, width: number, height: number, lastAnimTime = 0): number {
    const currentAnimTime = Date.now();
    const animTimeDelta = lastAnimTime === 0 ? 1 : (currentAnimTime - lastAnimTime) / 800;
    // clear canvas.
    ctx.clearRect(0,0, width, height);
    ctx.fillStyle = '#192a56';
    ctx.fillRect(0,0, width,height);
    const newBalls: Ball[] = [];
    const tree = quadtree<Ball>()
                    .x(d => d.x)
                    .y(d => d.y)
                    .addAll(balls);
    const updater = findCandidate<Ball>(tree, newBalls, width, height, animTimeDelta);
    balls.forEach((val ,index) => updater(val));
    newBalls.forEach(ball => ball.draw(ctx));
    const imageTree = quadtree<MCI>()
        .x(d => d.x)
        .y(d => d.y)
        .addAll(images);
    const newImages: MCI[] = [];
    const imageUpdater = findCandidate<MCI>(imageTree, newImages, width, height, animTimeDelta);
    images.forEach((val, index) => imageUpdater(val));
    newImages.forEach( img => img.draw(ctx));
    ctx.fillStyle = 'white';
    ctx.font = '150px serif';
    ctx.textBaseline = 'hanging';
    ctx.fillText( 'Bitfetch',Math.floor(width/3), Math.floor(height/3));
    ctx.font = '151px serif';
    ctx.strokeStyle = 'black';
    ctx.strokeText( 'Bitfetch',Math.floor(width/3), Math.floor(height/3));

    return requestAnimationFrame(() => DrawLoader(newBalls, newImages,ctx,width, height, currentAnimTime));
}

export default DrawLoader;