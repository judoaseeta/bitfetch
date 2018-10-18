import * as React from 'react';
import {ScaleBand, ScaleLinear} from "d3-scale";
import {ChartTypes} from '../../containers/CryptoChart';

const Indicators:React.SFC<{
    bandwidth: number;
    data: any;
    height: number;
    selectedIndex: number;
    maximum: number;
    type: ChartTypes;
    volumeChartHeight: number;
    volumeChartMarginTop: number;
    xScale: ScaleBand<Date>;
    yScale: ScaleLinear<number,number>;
}> = ({ bandwidth, data, height, selectedIndex, maximum, volumeChartHeight,volumeChartMarginTop, xScale, yScale, type, }) => {
    if(selectedIndex > -1 && selectedIndex <= Math.floor(data.length / 2)) {
        return <>
            <use
                href='#indi1'
                x={xScale(data[selectedIndex].time)! + Math.round(bandwidth / 2) + 3}
                y={type === ChartTypes.candle ? yScale(maximum) - 10: yScale(data[selectedIndex].close)}
                width={220}
                height={50}
            />
            <use
                href='#indi3'
                x={xScale(data[selectedIndex].time)! + Math.floor(bandwidth / 2) + 3}
                y={height - volumeChartHeight - volumeChartMarginTop + 5 }
                width={220}
                height={50}
            />
        </>
    } else if (selectedIndex > -1 && selectedIndex > Math.floor(data.length / 2)) {
        return <>
            <use
                href='#indi2'
                x={xScale(data[selectedIndex].time)! - 210}
                y={type === ChartTypes.candle ? yScale(maximum) - 10: yScale(data[selectedIndex].close)}
                width={220}
                height={50}
            />
            <use
                href='#indi4'
                x={xScale(data[selectedIndex].time)! - 210}
                y={height - volumeChartHeight - volumeChartMarginTop + 5 }
                width={220}
                height={50}
            />
        </>
    }
    return null;
};

export default Indicators;