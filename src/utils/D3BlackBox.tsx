import * as React from 'react';
export interface BlackBoxProps  {
    x: number;
    y: number;
    style?: string;
}
interface BlackBoxState {
    ref: React.RefObject<SVGGElement>;
}
function D3BlackBox<P extends BlackBoxProps>(func: (p: P, s?: BlackBoxState) => void) {
    return class extends React.Component<P, BlackBoxState> {
        state = {
            ref: React.createRef<SVGGElement>()
        };
        componentDidMount() {
            func(this.props, this.state);
        }
        componentDidUpdate() {
            func(this.props, this.state);
        }
        render() {
            const { x, y, style } = this.props;
            return (
                <g
                    className={style!}
                    ref={this.state.ref}
                    transform={`translate(${x}, ${y})`}
                >
                </g>
            )
        }
    }
}

export default D3BlackBox;