import {ScaleBand, ScaleLinear} from "d3-scale";
import { BlackBoxProps } from '../../utils/D3BlackBox';

interface AxisBottomPropType extends BlackBoxProps {
    xScale: ScaleBand<Date>;
    histo: string;
}

interface AxisRightPropType extends BlackBoxProps {
    yScale: ScaleLinear<number, number>;
}

