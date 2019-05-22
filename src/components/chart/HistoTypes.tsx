import * as React from 'react';
import HistoType from './HistoType';
const histoTypes = ['live','3d','1m', '3m', '6m'];
const HistoTypes:React.SFC<{
    x: number;
    y: number;
}> = ({ x, y}) => (
    <>
        <symbol
            id="histotypes"
            viewBox="0 0 640 50"
        >
            {histoTypes.map((type, index) =>
                <HistoType
                    height={50}
                    x={index === 0 ? 0 : (index * 120 ) + 5}
                    y={0}
                    histoType={type}
                />
            )}
        </symbol>
        <use
            href='#histotypes'
            width={640}
            height={50}
            x={x}
            y={y}
        >
        </use>
    </>
);

export default HistoTypes;
