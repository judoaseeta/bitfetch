import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { interpolateRdYlGn } from 'd3-scale-chromatic';
import { quadtree } from 'd3-quadtree';
import DrawLoader from '../utils/mainCanvas/DrawLoader';
import Ball from "../utils/mainCanvas/Ball";
import MCI from '../utils/mainCanvas/mainCanvasImage';
import imageUrlList from '../utils/mainCanvas/imageList';

export type RenderProps = {
    width: number;
    height: number;
    onClick: React.MouseEventHandler<HTMLDivElement>;
    isImageLoaded: boolean;
}
type Props = {
    children:(rProps: RenderProps, ref: React.RefObject<HTMLCanvasElement>) => JSX.Element;
} & RouteComponentProps;
type State = {
    animFrameNumber: number;
    balls: Ball[],
    images: MCI[],
    containerRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    timer: number;
    isImageLoaded: boolean;
}
class MainCanvas extends React.Component<Props,State> {
    state: State = {
        animFrameNumber: 0,
        balls: [],
        containerRef: React.createRef<HTMLCanvasElement>(),
        width: 0,
        height: 0,
        timer:0,
        isImageLoaded:false,
        images: []
    };
    componentDidMount(): void {
       this.setState({
           timer:  window.setInterval(() => this.checkWidth(), 800)
       });
    }
    checkWidth() {
        if(this.state.containerRef.current!.getBoundingClientRect().width >= 1200) {
            this.setState({
                width: this.state.containerRef.current!.getBoundingClientRect().width,
                height: this.state.containerRef.current!.getBoundingClientRect().height,
            }, () => this.clearTimer())
        }
    }
    clearTimer() {
        window.clearInterval(this.state.timer);
    }
    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        const { width:prevWidth, isImageLoaded: prevIsImageLoaded } = prevState;
        const { width, isImageLoaded } = this.state;
        if( prevWidth !== width && width > 300) {
            console.log('get');
            this.renderLoader()
        }
        if( prevIsImageLoaded !== isImageLoaded && isImageLoaded) {
            const ctx = this.state.containerRef.current!.getContext('2d', { alpha: false});
            const { width, height, balls, images } = this.state;
            this.setState({
                animFrameNumber: this.drawLoader(balls,images,ctx!, width, height)
            })
        }
    }
    drawLoader = (balls: Ball[], images: MCI[],ctx: CanvasRenderingContext2D, width: number, height: number) => DrawLoader(balls, images, ctx!, width, height);
    renderLoader() {
        const { width, height } = this.state;
        this.setState({
            balls: Array.from({ length: 100})
                .map(() =>
                    new Ball({
                        color: interpolateRdYlGn(Math.random()),
                        x: Number((Math.random() * width).toFixed(2)),
                        y: Number((Math.random() * height).toFixed(2)),
                        dx: Number(((Math.random() -0.5) * 150).toFixed(2)),
                        dy: Number(((Math.random() -0.5) * 150).toFixed(2)),
                        radius: 15,
                    })
                ),
            images: imageUrlList.map( coin => new MCI({
                x: Number((Math.random() * width).toFixed(2)),
                y: Number((Math.random() * height).toFixed(2)),
                da: Number(((Math.random() -0.5) * 50).toFixed(2)),
                dx: Number(((Math.random() -0.5) * 150).toFixed(2)),
                dy: Number(((Math.random() -0.5) * 150).toFixed(2)),
                coinName: coin,
                radius:30,
            }))
        }, () => {
            this.loadImage();
        });
    }
    componentWillUnmount(): void {
        if(this.state.timer > 0) { this.clearTimer();}
        window.cancelAnimationFrame(this.state.animFrameNumber);
    }
    loadImage() {
        if(this.state.images) {
            Promise.all(this.state.images.map( img => img.load()))
                .then(( ) => this.setState({ isImageLoaded: true }))
        }
    }
    onClick = ({clientX, clientY}: React.MouseEvent<HTMLDivElement>) => {
        const { images, isImageLoaded } = this.state;
        if(isImageLoaded) {
            const tree = quadtree<MCI>()
                .x(d => d.x)
                .y(d => d.y)
                .addAll(images);
            const candidate = tree.find(clientX, clientY, 60);
           if(candidate) this.props.history.push(`/currencies/${candidate.name.toUpperCase()}?histo=LIVE`)
        }

    }
    render() {
        const { width, height, isImageLoaded} = this.state;
        return this.props.children({
           width: width,
           height: height,
            isImageLoaded: isImageLoaded,
            onClick: this.onClick
        }, this.state.containerRef);
    }
}
export default withRouter(MainCanvas);
