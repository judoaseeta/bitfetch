import * as React from 'react';
import {RefObject} from "react";

type LazyImageProps = {
    alt?: string;
    className: string;
    previewSrc: string;
    src: string;
}
type LazyImageState = {
    src: string;
    reserve: string;
    imageRef: RefObject<HTMLImageElement>;
    observer: IntersectionObserver | null
}
class LazyImage extends React.Component<LazyImageProps, LazyImageState> {
    state: LazyImageState = {
        src: this.props.previewSrc,
        reserve: this.props.src,
        imageRef: React.createRef<HTMLImageElement>(),
        observer: null,
    }
    componentDidMount(): void {
        this.setState({
            observer: new IntersectionObserver((entries, observer) => {
                entries.forEach((entry => {
                    if(entry.isIntersecting) {
                        this.loadImage()
                    }
                }),{
                    threshold: 0.1,
                    rootMargin: '0px'
                });
            })
        }, () => this.state.observer!.observe(this.state.imageRef.current!))
    };
    componentDidUpdate(prevProps: Readonly<LazyImageProps>){
        const { src: prevSrc } = prevProps;
        const { src, previewSrc } =  this.props;
        if(prevSrc !== src) {
            this.setState({
                src: previewSrc,
                reserve: src
            }, () => this.loadImage())
        }
    }
    fetchImage() {
        return new Promise((res, rej) =>{
            const image = new Image();
            image.src = this.state.reserve;
            image.onload = res;
            image.onerror = rej;
        })
    };
    loadImage() {
        this.fetchImage().then(() => {
            this.setState({
                src: this.state.reserve
            },() => this.state.observer!.disconnect());
            // when Image promise is fulfilled, setState for changing URL in <img>Component to full-sized image url.
            // and disconnect observer with callback
        });
    };
    render() {
        return (
            <img
                alt={this.props.alt}
                className={this.props.className}
                src={this.state.src}
                ref={this.state.imageRef}
            />
        )
    };
}

export default LazyImage;
