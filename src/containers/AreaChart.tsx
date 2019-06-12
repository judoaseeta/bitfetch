import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import {scaleLinear, ScaleLinear, scaleTime, ScaleTime} from 'd3-scale';

import {createCurrentSubcription, createSocketCoin, requestTopCoinData} from '../utils/api';
import {createAction, ActionsUnion, ActionWithPayload} from '../utils/createAction';
import { RootState } from './';


export type RenderProp = State;
export type Props = {
    children: (rp: RenderProp) => JSX.Element;
    currentCoinSymbol: string;
    histo: string;
    tsym?: string;
} & RouteComponentProps<{}>;
export type State = {
    xScale: ScaleTime<Date, number>;
    yScale: ScaleLinear<number, number>;
};

class AreaChart extends React.Component<Props, State> {
    state = {
        xScale: scaleTime<Date, number>(),
        yScale: scaleLinear()
    };
    componentDidMount() {

    }
    render() {
        return this.props.children({
            ...this.state
        });
    }
};

export default withRouter(AreaChart);