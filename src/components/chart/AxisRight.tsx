import * as React from 'react';
import  { axisRight } from 'd3-axis';
import { select } from 'd3-selection';
import D3BlackBox from '../../utils/component/D3BlackBox';
import {AxisRightPropType} from "./Axis";

const AxisBottom = D3BlackBox<AxisRightPropType>((props, state) => {
    const { yScale } = props;
    select(state!.ref.current!)
        .call(axisRight(yScale));
});
export default AxisBottom;