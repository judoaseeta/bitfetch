import * as React from 'react';
import  { axisBottom } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { select } from 'd3-selection';
import D3BlackBox from '../../utils/component/D3BlackBox';
import {AxisBottomPropType} from "./Axis";
//entity
import { HistoType } from '../../core/lib/entities/histoData';
const TFormat: {
    [k: string] : string;
} = {
    [HistoType.live]: "%p %I:%M",
    [HistoType.threeDay] :"%H:%M-%d-%b",
    [HistoType.oneMonth]:"%d %b '%y",
    [HistoType.threeMonth]:"%b %d '%y",
    [HistoType.sixMonth]:"%b %d '%y",
    [HistoType.oneYear]:"%b %d '%y",
};
const Tfilter:{
    [k: string] : (d:any, i: number) => boolean;
} = {
    [HistoType.live]: (d,i) => i % 1 === 0,
    [HistoType.threeDay]: (d,i) => i % 3 === 0 ,
    [HistoType.oneMonth]: (d,i) => i % 1 === 0,
    [HistoType.threeMonth]: (d,i) => i % 3 === 0,
    [HistoType.sixMonth]: (d,i) => i % 2 === 0,
    [HistoType.oneYear]: (d,i) => i % 3 === 0,
};
const AxisBottom = D3BlackBox<AxisBottomPropType>((props, state) => {
    const { histo,  xScale } = props;
    if(props.histo) {
        select(state!.ref.current!)
            .call(axisBottom(xScale)
                .tickSize(4)
                .tickValues(xScale.domain().filter(Tfilter[histo]))
                .tickFormat(timeFormat(TFormat[histo])
                )
            )
            .selectAll('text')
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
    }
});
export default AxisBottom;