import * as React from 'react';
import {ScaleBand, ScaleLinear} from "d3-scale";
import {ChartTypes} from '../../containers/CryptoChart';
import { HistoData } from '../../core/lib/entities/histoData';

const Indicators:React.FunctionComponent<{
    bandwidth: number;
    data: HistoData[];
    selectedIndex: number;
    maximum: number;
    marginTop: number;
    translateY: number;
    type: ChartTypes;
    volumeScale: ScaleLinear<number, number>;
    xScale: ScaleBand<Date>;
    yScale: ScaleLinear<number,number>;
}> = ({ bandwidth, data, selectedIndex, maximum, marginTop, volumeScale, translateY, xScale, yScale, type, }) => {
    if(selectedIndex > -1 && selectedIndex <= Math.floor(data.length / 2)) {
        return <>
            <use
                href='#indi1'
                x={xScale(data[selectedIndex].date)! + Math.round(bandwidth / 2) + 3}
                y={(yScale(data[selectedIndex].close) + marginTop - 25)}
                width={220}
                height={50}
            />
            <g
                transform={`translate(0, ${translateY})`}
            >
                <use
                    href='#indi3'
                    x={xScale(data[selectedIndex].date)! + Math.floor(bandwidth / 2) + 3}
                    y={volumeScale(data[selectedIndex].volumefrom) - 25}
                    width={220}
                    height={50}
                />
            </g>
        </>
    } else if (selectedIndex > -1 && selectedIndex > Math.floor(data.length / 2)) {
        return <>
            <use
                href='#indi2'
                x={xScale(data[selectedIndex].date)! - 220 + (Math.round(bandwidth / 2) - 3)}
                y={yScale(data[selectedIndex].close) + marginTop - 25}
                width={220}
                height={50}
            />
            <g
                transform={`translate(0, ${translateY})`}
            >
                <use
                    href='#indi4'
                    x={xScale(data[selectedIndex].date)! - 220 +(Math.round(bandwidth / 2) - 3)}
                    y={volumeScale(data[selectedIndex].volumefrom) - 25}
                    width={220}
                    height={50}
                />
            </g>
        </>
    }
    return null;
};

export default Indicators;