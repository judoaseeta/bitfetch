import * as React from 'react';
import  { axisBottom } from 'd3-axis';
import { timeFormat } from 'd3-time-format';
import { select } from 'd3-selection';
import D3BlackBox from '../../utils/D3BlackBox';
import {AxisBottomPropType} from "./Axis";
const TFormat: {
    [k: string] : string;
} = {
    live: "%p %I:%M",
    '3d' :"%I:%M ,%d ",
    '1m':"%d %b '%y",
    '3m':"%b %d '%y",
    '6m':"%b %d '%y",
};
const Tfilter:{
    [k: string] : (d:any, i: number) => boolean;
} = {
    live: (d,i) => i % 2 === 0,
    '3d': (d,i) => i % 4 === 0 ,
    '1m': (d,i) => i % 2 === 0,
    '3m': (d,i) => i % 2 === 0,
    '6m': (d,i) => i % 2 === 0,
};
const AxisBottom = D3BlackBox<AxisBottomPropType>((props, state) => {
    const { histo,  xScale } = props;
    if(props.histo) {
        select(state!.ref.current!)
            .call(axisBottom(xScale)
                .tickValues(xScale.domain().filter(Tfilter[histo]))
                .tickFormat(timeFormat(TFormat[histo]))
            )
        ;
    }
});
export default AxisBottom;