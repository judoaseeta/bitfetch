import { Quadtree } from 'd3-quadtree';
import Ball from './Ball';

export default function findCandidate<T extends Ball>(tree: Quadtree<T>, newBalls: Ball[],width: number, height: number, animateTimeDelta: number) {
    return function(currentBall: T) {
        const node = currentBall;
        // remove current select node to find candidate not itself.
        tree.remove(node);
        const candidate = tree.find(node!.x, node!.y, node!.radius * 2);
        if(candidate) {
            node.update({
                animateTimeDelta: animateTimeDelta,
                contextHeight: height,
                contextWidth: width,
                willCollide: true,
                target: candidate
            });
            newBalls.push(node);
            // add node to tree again.
            tree.add(node);
        } else {
            node.update({
                animateTimeDelta: animateTimeDelta,
                contextHeight: height,
                contextWidth: width,
            });
            newBalls.push(node);
            // add node to tree again.
            tree.add(node);
        }
    }
}