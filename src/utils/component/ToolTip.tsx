import * as React from 'react';

import { bind } from 'classnames/bind';
import * as styles from './ToolTip.scss';
const cx = bind(styles);
type ToolTipFrom = 'up' | 'down' | 'left' | 'right';
type ToolTipTo = 'mid' | 'up' | 'down' | 'left' | 'right';

interface MarginObject {
    top?: string;
    right?: string;
    left?: string;
    bottom?: string;
}
interface ToolTipProps {
    toolTipFrom: ToolTipFrom;
    toolTipTo: ToolTipTo;
    tooltipContent: JSX.Element;
}
interface ToolTipState {
    bodyRef:  React.RefObject<HTMLDivElement>;
    contentRef: React.RefObject<HTMLDivElement>;
    margin: MarginObject;
}
class ToolTip extends React.Component<ToolTipProps,ToolTipState>{
    state = {
        bodyRef: React.createRef<HTMLDivElement>(),
        contentRef: React.createRef<HTMLDivElement>(),
        margin: {

        }
    };
    componentDidMount(): void {
        this.setState({
            margin: this.setMargin(),
        })
    }
    setMargin = () => {
        const { toolTipFrom,toolTipTo } = this.props;
        const { width: bodyWidth, height: bodyHeight } = this.state.bodyRef.current!.getBoundingClientRect();
        const { width, height } = this.state.contentRef.current!.getBoundingClientRect();
        const fromVertical = toolTipFrom === 'down' || toolTipFrom === 'up';
        const fromHorizontal =toolTipFrom === 'left' || toolTipFrom === 'right';
        if(fromVertical && toolTipTo === 'mid') {
            const calc = `-${(width / 2) - (bodyWidth / 2)}px`;
            console.log(calc);
            return {
                left: calc
            }
        } else if (fromVertical && toolTipTo === 'left') {
            return {
                left: '0.4em'
            }
        } else if (fromVertical && toolTipTo === 'right') {
            return {
                right:'0.4em'
            }
        } else if (fromHorizontal && toolTipTo === 'mid') {
            const calc = `-${(height / 2) - (bodyHeight /2)}px`;
            return {
                top: calc
            }
        } else if (fromHorizontal && toolTipTo === 'up') {
            return {
                top: '0.4em'
            }
        } else if (fromHorizontal && toolTipTo === 'down') {
            return {
                bottom: '0.4em'
            }
        }

        return {
        }
    };
    render() {
        const { children, tooltipContent, toolTipFrom } = this.props;
        const { bodyRef, contentRef, margin } = this.state;
        return (
            <>
                <div
                    className={cx('tooltipBody', {
                        fromUp: toolTipFrom === 'up',
                        fromDown: toolTipFrom === 'down',
                        fromLeft: toolTipFrom === 'left',
                        fromRight: toolTipFrom === 'right'
                    })}
                >
                    <div
                        ref={bodyRef}
                    >{children}</div>
                    <div
                        className={cx('toolTipContent', {
                            fromUp: toolTipFrom === 'up',
                            fromDown: toolTipFrom === 'down',
                            fromLeft: toolTipFrom === 'left',
                            fromRight: toolTipFrom === 'right'
                        })}
                        ref={contentRef}
                        style={margin}
                    >
                        {tooltipContent}
                    </div>
                </div>
            </>
        )
    }
}

export default ToolTip;