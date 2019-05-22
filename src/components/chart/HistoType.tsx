import * as React from 'react';
import * as styles from './styles/HistoType.scss';
const HistoType: React.SFC<{
    height: number;
    x: number;
    y:number;
    histoType: string;
}> = ({ height, histoType, x, y, }) => (
    <>
        <symbol
            className={styles.histoType}
            id="histotype"
            viewBox='0 0 120 50'
        >
            <rect
                width={120}
                height={50}
                x={0}
                y={0}
            />
            <text
                x={4}
                y={4}
                fontSize="20px"
                fill="white"
            >{histoType}
            </text>
        </symbol>
        <use
            href="#histotype"
            width={120}
            height={height}
            x={x}
            y={y}
        >
        </use>
    </>
);

export default HistoType;

