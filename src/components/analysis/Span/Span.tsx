import * as React from 'react';

// child components
import * as styles from './styles/Span.scss';

const DrawCanvas = React.forwardRef<HTMLCanvasElement, {
    className: string;
    width: number;
    height: number;
}>(({ className, width, height }, ref ) => (
    <canvas
        className={className}
        ref={ref}
        width={width}
        height={height}
    />
));
const HiddenCanvas = React.forwardRef<HTMLCanvasElement, {
    className: string;
    onMouseEnter:React.MouseEventHandler<HTMLCanvasElement>;
    onMouseLeave:React.MouseEventHandler<HTMLCanvasElement>;
    width: number;
    height: number;
}>(({ className, onMouseEnter,onMouseLeave, width, height }, ref) => (
    <canvas
        className={className}
        ref={ref}
        onMouseMove={onMouseEnter}
        onMouseLeave={onMouseLeave}
        width={width}
        height={height}
    />
));
const Span:React.FunctionComponent<{
    canvasRef: React.RefObject<HTMLCanvasElement>;
    interactRef: React.RefObject<HTMLCanvasElement>;
    width: number;
    height: number;
    onMouseEnter:React.MouseEventHandler<HTMLCanvasElement>;
    onMouseLeave: React.MouseEventHandler<HTMLCanvasElement>;
}> = ({ canvasRef, interactRef, width, height, onMouseEnter, onMouseLeave }) =>
    <div
        className={styles.container}
    >
        <HiddenCanvas
            className={styles.hiddenCanvas}
            ref={interactRef}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            width={width}
            height={height}
        />
        <DrawCanvas
            className={styles.drawCanvas}
            ref={canvasRef}
            width={width}
            height={height}
        />
    </div>;

export default Span;
