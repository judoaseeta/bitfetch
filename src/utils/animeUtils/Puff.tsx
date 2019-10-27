import * as React from 'react';
import * as bezierEasing from 'bezier-easing';

import loop, { Cancel } from '../animeUtils/loop';
type State = {
    radius: number,
    canceler: Cancel | null;
    c1r: number;
    c2r: number;
    c1StrokeOpacity: number;
    c2StrokeOpacity: number;
}
type Props = {
    className?: string;
    duration: number;
    strokeWidth: number;
    strokeColor?: string;
}
const spreadCurve = bezierEasing(0.165, 0.84, 0.44, 1);
const fadeCurve = bezierEasing(0.3, 0.61, 0.355, 1);

class Puff extends React.Component<Props,State> {
    state: State = {
        radius: 0,
        canceler: null,
        c1r:0,
        c2r: 0,
        c1StrokeOpacity: 0,
        c2StrokeOpacity:0,
    };
    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        return {
            radius:  50 - nextProps.strokeWidth / 2
        }
    }
    componentDidMount(): void {
        this.setState({
            canceler: this.setFrame(),
        })
    }
    componentWillUnmount(): void {
        if(this.state.canceler) this.state.canceler();
    }
    update = (t:number) => {
        const { radius } = this.state;
        const t2 = t >= 0.5 ? t - 0.5 : t + 0.5;
        this.setState({
            c1r: spreadCurve(t) * radius,
            c2r: spreadCurve(t2) * radius,
            c1StrokeOpacity: (1 - fadeCurve(t)),
            c2StrokeOpacity: (1 - fadeCurve(t2))
        })
    };
    setFrame = () => {
        const { duration } = this.props;
        return loop({ duration, update: this.update })
    };
    render() {
        const { c1r, c2r, c1StrokeOpacity, c2StrokeOpacity } = this.state;
        return (
            <div
                className={this.props.className}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100"
                >
                    <g
                        fill={'none'}
                        stroke={this.props.strokeColor}
                    >
                        <circle r={c1r}  strokeOpacity={c1StrokeOpacity}/>
                        <circle r={c2r}  strokeOpacity={c2StrokeOpacity}/>
                    </g>
                </svg>
            </div>
        );
    }
}

export default Puff;
