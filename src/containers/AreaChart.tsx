import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, Reducer} from 'redux';
import { Epic,  ofType } from 'redux-observable';
import { mergeMap, tap , map } from 'rxjs/operators';
import {scaleLinear, ScaleLinear, scaleTime, ScaleTime} from 'd3-scale';

import { requestTopCoinData } from '../utils/api';
import {createAction, ActionsUnion, ActionWithPayload} from '../utils/createAction';
import { RootState } from './';
import {from} from "rxjs";
enum actionTypes {
    REQUEST_TOP_LIST = 'REQUEST_TOP_LIST',
    LISTEN_TOP_LIST_COINS = 'LISTEN_TOP_LIST_COINS '
}
interface TopListCoinReq {
    currentCoinSymbol: string;
    histo: string;
    tsym?: string;
}
const dispatchers = {
    REQUEST_TOP_LIST: (payload: TopListCoinReq) => createAction(actionTypes.REQUEST_TOP_LIST, payload),
    LISTEN_TOP_LIST_COINS: (payload: MultiCoinResp[]) => createAction(actionTypes.LISTEN_TOP_LIST_COINS, payload),
};
type Actions = ActionsUnion<typeof dispatchers>;
const RequestTopListEpic: Epic<Actions> = (action$) => action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.REQUEST_TOP_LIST, TopListCoinReq>>(actionTypes.REQUEST_TOP_LIST),
    mergeMap(d =>
        from(requestTopCoinData(d.payload.currentCoinSymbol, d.payload.histo, d.payload.tsym)).pipe(
            tap(d => console.log(d)),
            map(d => dispatchers.LISTEN_TOP_LIST_COINS(d))
        )
    )
);
export const epics = [ RequestTopListEpic ];
type RState = {
    coinDatas: {
        name: string;
        data: CoinHistoData[]
    }[] | null;
}
const initialState = {
    coinDatas : null
};
export const reducer: Reducer<RState, Actions> = (state = initialState, action) => {
    return state;
};
const mapStateToProps = (state: RootState) => {
    return {
        data: state.area.coinDatas
    }
};
const mapDispatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators({...dispatchers}, dispatch)
});

export type RenderProp = State;
export type Props = {
    children: (rp: RenderProp) => JSX.Element;
    currentCoinSymbol: string;
    histo: string;
    tsym?: string;
} & ReturnType<typeof mapDispatchToProps>
& ReturnType<typeof mapStateToProps>
& RouteComponentProps<{}>;
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
        const { REQUEST_TOP_LIST,  histo, currentCoinSymbol , tsym} =  this.props;
        if(!this.props.data) {
            REQUEST_TOP_LIST({ currentCoinSymbol, histo, tsym});
        }
    }
    render() {
        return this.props.children({
            ...this.state
        });
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AreaChart));