import * as React from 'react';
/// REDUX
import { connect } from 'react-redux';
import {Action , bindActionCreators, Dispatch, Reducer} from 'redux';
import {catchError, mergeMap, switchMap, map, takeUntil, tap, startWith} from 'rxjs/operators';
import { from, of } from 'rxjs';
import {ActionsObservable, Epic, ofType} from 'redux-observable';
// REACT ROUTER
import {RouteComponentProps, withRouter} from 'react-router-dom';
import { parse } from 'query-string';

// D3 dependencies.
import {scaleLinear, scaleBand,scaleTime, ScaleTime, ScaleBand, ScaleLinear } from 'd3-scale';
import { extent ,min, max } from 'd3-array';
import { line, Line  } from 'd3-shape';
// rest of 3rd parties.
/// local dependencies.

import {createAction, ActionsUnion, ActionWithPayload} from '../utils/createAction';
import { createCurrentSubcription, generateUrlForCurrencyApi, createSocketCoin } from '../utils/api';
import { RootState } from './';
import { MappedHistoData, MappedHistoDataType, mappingResponse } from '../utils/histoDataMapper';
// @ts-ignore
import DecodeMessage from '../utils/decodeMessage';

export enum actionTypes {
    CATCH_ERROR = 'CATCH_ERROR',
    REQUEST_INITIAL_DATA = 'REQUEST_INITIAL_DATA',
    REQUEST_SUCCESS =  'REQUEST_SUCCESS',
    LISTEN_CURRENT =  'LISTEN_CURRENT',
    SUBSCRIPTION_TO_STATE = 'SUBSCRIPTION_TO_STATE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    CLEAR = 'CLEAR'
};
interface Input {
    fsym: string;
    tsym: string;
}
interface ApiRequestInput extends Input {
    histo: string;
}

export const dispatchers = {
    CATCH_ERROR: (e: Error) => createAction(actionTypes.CATCH_ERROR, e.message),
    REQUEST_INITIAL_DATA: (req: ApiRequestInput) => createAction(actionTypes.REQUEST_INITIAL_DATA, req),
    REQUEST_SUCCESS: (payload: MappedHistoData) => createAction(actionTypes.REQUEST_SUCCESS, payload),
    LISTEN_CURRENT: (payload: Input) => createAction(actionTypes.LISTEN_CURRENT, payload),
    SUBSCRIPTION_TO_STATE: (payload: any) => createAction(actionTypes.SUBSCRIPTION_TO_STATE, payload),
    UNSUBSCRIBE: () => createAction(actionTypes.UNSUBSCRIBE),
    CLEAR:() =>  createAction(actionTypes.CLEAR)
};

// type definitions for all actions.
type Actions = ActionsUnion<typeof dispatchers>;

const mappingCurrent = (sub: string) => {
    let decodedSub = DecodeMessage.CURRENT.unpack(sub);
    return {
        ...decodedSub,
        FLAGS: Number(decodedSub.FLAGS)
    }
};
const SubscribeSingleCurrentEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.LISTEN_CURRENT, Input>, actionTypes.LISTEN_CURRENT>(actionTypes.LISTEN_CURRENT),
    switchMap(ac =>{
        let { unsubscribe, observable} = createSocketCoin(createCurrentSubcription(ac.payload.fsym, ac.payload.tsym));
        return observable.pipe(
            map(sub => dispatchers.SUBSCRIPTION_TO_STATE(mappingCurrent(sub))),
            takeUntil(action$.pipe(
                ofType<Actions, Action<actionTypes.UNSUBSCRIBE>, actionTypes.UNSUBSCRIBE>(actionTypes.UNSUBSCRIBE),
                tap(() => unsubscribe()),
                map(()=> dispatchers.CLEAR())
            )),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    })
);
/*
map((data: CoinHistoDataResp) => ({ ...data, Data: mappingDate(data.Data), time: d.payload.time})),
            map(data => dispatchers.REQUEST_SUCCESS({ data, time: d.payload.tsym }))

 */

const DataEpic: Epic<Actions> = (action$: ActionsObservable<Actions>, _)=> action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.REQUEST_INITIAL_DATA, ApiRequestInput>, actionTypes.REQUEST_INITIAL_DATA>(actionTypes.REQUEST_INITIAL_DATA),
    mergeMap(action =>
        from<MappedHistoData>(fetch(generateUrlForCurrencyApi(action.payload)).then((res: any) => res.json())).pipe(
            map((data: any) => mappingResponse(data)),
            map((data: MappedHistoData) => dispatchers.REQUEST_SUCCESS(data)),
            startWith(dispatchers.LISTEN_CURRENT(action.payload)),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    ),
);

export const epics = [ DataEpic, SubscribeSingleCurrentEpic ];

// Reducer.



const mapDataWithCurrent = (data: MappedHistoDataType[], price: number) => {
    let { high, close, open, low, ...rest } = data[data.length - 1];
    if(high < price){
        high = price;
    } else if (low > price) {
        low = price;
    }
    close = price;
    return [...data.slice(0, data.length - 1), { high, close, open, low, ...rest}];
};
interface ChartReducer {
    chartData: {
        data: MappedHistoDataType[],
        currentPrice: {
            current: number,
            flag: number
        },
        listening: boolean,
        isDisconnected: boolean,
    }
}
const initialState = {
    chartData: {
        data: [],
        currentPrice : {
            current: 0,
            flag: 0,
        },
        listening: false,
        isDisconnected: false
    }
};
export const reducer: Reducer<ChartReducer, Actions> = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.REQUEST_SUCCESS:
            return {
                ...state,
                chartData : {
                    ...state.chartData,
                    data: action.payload.Data,
                }
            };
        case actionTypes.SUBSCRIPTION_TO_STATE:
            return {
                ...state,
                chartData: {
                    ...state.chartData,
                    data: state.chartData.data.length > 1? mapDataWithCurrent(state.chartData.data, action.payload.PRICE || state.chartData.currentPrice.current ) : state.chartData.data,
                    currentPrice: {
                        current: action.payload.PRICE ? action.payload.PRICE : state.chartData.currentPrice.current,
                        flag: action.payload.FLAGS,
                    },
                    listening: true
                }
            };
        case actionTypes.CLEAR:
            return {
                ...state,
                chartData: {
                    ...state.chartData,
                    data: [],
                    currentPrice: {
                        current: 0,
                        flag: -1
                    },
                    listening: false
                }
            };
        case actionTypes.CATCH_ERROR:
            if(action.payload === 'disconnected') {
                return {
                    ...state,
                    chartData: {
                        ...state.chartData,
                        isDisconnected: true
                    }
                };
            }
            return state;
        default: return state;
    }
};

const mapStateToProps = (state: RootState) => {
    return {
        data: state.chart.chartData.data,
        isDisconnected: state.chart.chartData.isDisconnected,
        ...state.chart.chartData.currentPrice,
    }
};

const mapDisPatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(({
        ...dispatchers
    }), dispatch)
});
// D3 CHART RELATED STATIC VALUES.

//type definitions for Component
export enum ChartTypes {
    line = 'line',
    candle = 'candle'
}
export type RenderProps = CryptoChart.State & {
    setSelectedIndex: (num: number) => React.MouseEventHandler<SVGRectElement|SVGElement>;
};
declare namespace CryptoChart {

    // type ChartTypes = 'line' | 'candle';
    export type Props = {
        width: number,
        height: number;
        children: (props: RenderProps) => JSX.Element;
    } & RouteComponentProps<{
        fsym: string;
    }>
        & ReturnType<typeof mapStateToProps>
        & ReturnType<typeof mapDisPatchToProps>
    export interface State {
        bandwidth: number;
        current: number;
        data: null | MappedHistoDataType[];
        flag: number;
        fsym: string;
        loading: boolean;
        line: Line<MappedHistoDataType>;
        height: number;
        histo: string;
        isDisconnected: boolean;
        selectedIndex: number;
        containerRef: React.RefObject<HTMLDivElement>;
        marginTop: number;
        marginLeft: number;
        marginRight: number;
        maximum: number;
        minimum: number;
        tsym: string;
        type: ChartTypes;
        volumeChartHeight: number;
        volumeChartMarginTop: number;
        width: number;
        xScale: ScaleBand<Date>;
        yScale: ScaleLinear<number,number>;
        volumeScale: ScaleLinear<number, number>;
    }
}
class CryptoChart extends React.Component<CryptoChart.Props, CryptoChart.State> {
    static defaultProps = {
        width: 600,
        height: 600
    };
    state = {
        bandwidth: 0,
        current: 0,
        data: null,
        flag: -1,
        fsym: this.props.match.params.fsym,
        loading: true,
        line: line<MappedHistoDataType>(),
        height: 0,
        histo: parse(this.props.location.search).histo || 'live',
        isDisconnected: false,
        selectedIndex: -1,
        containerRef: React.createRef<HTMLDivElement>(),
        marginLeft: 0,
        marginTop: 33,
        marginRight: 70,
        maximum: 0,
        minimum: 0,
        tsym: parse(this.props.location.search).tsym || 'USD',
        type: ChartTypes.line,
        volumeChartHeight: 0,
        volumeChartMarginTop: 0,
        width: 0,
        xScale: scaleBand<Date>(),
        yScale: scaleLinear(),
        volumeScale: scaleLinear()
    };
    static getDerivedStateFromProps(nextProps: CryptoChart.Props, prevState: CryptoChart.State) {
        let {fsym, marginRight, marginTop, histo, line ,volumeScale,xScale, yScale} = prevState;
        const {current, data, height, width, flag, isDisconnected } = nextProps;
        // constants;

        fsym = nextProps.match.params.fsym;
        histo = parse(nextProps.location.search).histo;
        if (prevState.width !== width || prevState.height !== height) {
            const volumeChartHeight = Math.floor(height / 6);
            const volumeChartMarginTop = Math.floor(height / 10);
            const marginLeft = Math.floor(width * 0.03);
            return {
                width,
                height,
                marginLeft,
                volumeChartHeight,
                volumeChartMarginTop,
            }
        }
        if (prevState.fsym !== fsym) {
            return {
                fsym
            };
        }
        if(prevState.isDisconnected !== isDisconnected) {
            return {
                isDisconnected
            }
        }
        if(prevState.histo !== histo) {
            return {
                histo
            };
        }
        if (data.length && data !== prevState.data) {
            let maximum = max(data, d => d.high);
            let minimum = min(data, d => d.low);

            xScale
                .range([prevState.marginLeft, width - marginRight])
                .domain(data.map(dat => dat.time));
            let bandwidth = xScale.bandwidth();
            yScale.range([height - prevState.volumeChartHeight - marginTop - prevState.volumeChartMarginTop, 0])
                .domain([minimum!, maximum!])
                .clamp(true)
                .nice();
            volumeScale.range([prevState.volumeChartHeight, 0])
                .domain([min(data!, d => d.volumefrom)!, max(data, d => d.volumefrom)!])
                .nice();
            line.x((d) => xScale(d.time)! + bandwidth / 2)
                .y((d) => yScale(d.close));
            return {
                bandwidth,
                current,
                data,
                flag,
                loading: false,
                line,
                maximum,
                minimum,
                volumeScale,
                xScale,
                yScale,
                width,
                height
            }
        } else if (data && flag !== prevState.flag) {
            if(flag === 4) {
                return {
                    flag
                };
            }
            return null;
        }
        return null;
    }
    componentDidMount() {
        if(!this.props.data.length) {
            this.props.REQUEST_INITIAL_DATA({
                fsym: this.props.match.params.fsym,
                histo: this.props.location.search ? parse(this.props.location.search).histo : 'live',
                tsym: this.props.location.search ? parse(this.props.location.search).tsym : 'USD',
            });
        }
    }
    componentDidUpdate(prevP: CryptoChart.Props, prevS: CryptoChart.State) {
        if(prevS.fsym !== this.state.fsym) {
            this.props.UNSUBSCRIBE();
            this.props.REQUEST_INITIAL_DATA({
                fsym: this.state.fsym,
                histo: this.state.histo,
                tsym: this.state.tsym
            });
        }
    }
    componentWillUnmount() {
        console.log('unmounted');
        this.props.UNSUBSCRIBE();
    }
    toggleLoading = (callback?: any) => this.setState({ loading: this.state.loading }, () => callback());
    // setHeightandWidth = (height, width) => this.setState({ width: width, height: height });
    setSelectedIndex = (num: number) => (e: React.MouseEvent<SVGRectElement>) => this.setState({ selectedIndex: num });
    render() {
        return this.props.children({
            ...this.state,
            setSelectedIndex: this.setSelectedIndex
        });
    }
}

export default withRouter(connect(mapStateToProps, mapDisPatchToProps)(CryptoChart));

