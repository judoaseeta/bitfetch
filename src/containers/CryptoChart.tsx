import * as React from 'react';
/// REDUX
import { connect } from 'react-redux';
import {Action , bindActionCreators, Dispatch, Reducer} from 'redux';

// Rxjs
import {catchError ,mergeMap, switchMap, map, takeUntil, tap, startWith} from 'rxjs/operators';
import { from, of } from 'rxjs';
import {ActionsObservable, Epic, ofType} from 'redux-observable';
// REACT ROUTER
import {RouteComponentProps, withRouter} from 'react-router-dom';
import { parse } from 'query-string';

// D3 dependencies.
import {scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { line, Line  } from 'd3-shape';
// rest of 3rd parties.
/// local dependencies.

import {createAction, ActionsUnion, ActionWithPayload} from '../utils/createAction';
import { createCurrentSubcription, createSocketCoin, requestCurrencyData } from '../utils/api';
import mappingCurrent from '../utils/mappingCurrent';
import { RootState } from './';
import { MappedHistoData, MappedHistoDataType, mappingResponse } from '../utils/histoDataMapper';
import mapDataWithCurrent from '../utils/mapDatawithCurrent';
// @ts-ignore
import DecodeMessage from '../utils/decodeMessage.js';

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

//// Epic for listening current price via websocket.

const SubscribeSingleCurrentEpic: Epic<Actions> = (action$: ActionsObservable<Actions>) => action$.pipe(
    ofType<Actions, ActionWithPayload<actionTypes.LISTEN_CURRENT, Input>, actionTypes.LISTEN_CURRENT>(actionTypes.LISTEN_CURRENT),
    switchMap(ac =>{
        let { unsubscribe, observable} = createSocketCoin(createCurrentSubcription(ac.payload.fsym, ac.payload.tsym));
        return observable.pipe(
            map(sub => dispatchers.SUBSCRIPTION_TO_STATE(mappingCurrent(sub))),
            takeUntil(action$.pipe(
                ofType<Actions, Action<actionTypes.UNSUBSCRIBE>, actionTypes.UNSUBSCRIBE>(actionTypes.UNSUBSCRIBE),
                tap(() => unsubscribe()),
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
        from(requestCurrencyData(action.payload)).pipe(
            map((data: any) => mappingResponse(data)),
            map((data: MappedHistoData) => dispatchers.REQUEST_SUCCESS(data)),
            startWith(dispatchers.LISTEN_CURRENT(action.payload)),
            catchError(e => of(dispatchers.CATCH_ERROR(e))),
        )
    ),
);

export const epics = [ DataEpic, SubscribeSingleCurrentEpic ];

// Reducer.




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
                    listening: true,
                    isDisconnected: false
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
                if(!state.chartData.listening) {
                    console.log('yes!');
                    return state;
                }
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
export type RenderProps = State & {
    current: number;
    setSelectedIndex: (num: number) => React.MouseEventHandler<SVGRectElement|SVGElement>;
    setHisto: (histo: string) => React.MouseEventHandler<HTMLButtonElement>;
    listenCurrent: React.MouseEventHandler<HTMLSpanElement>;
    toggleMenu: React.MouseEventHandler<HTMLButtonElement>;
    isDisconnected: boolean;
    histo: string;
    fsym: string;
    tsym: string;
};

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
    /*
    *   bandwidth: width of each band of xScale
    *   current: current price of the currency
    *   data: historical price data of the currency
    *   flag: flag of changing price per each websocket message 1: up 2: down 4: same
    *   loading: boolean value of whether data is loaded or not
    *   line: D3 Line(html path d element value) with 'data'
    *   height: height of SVG element. default 0;
    *   histo: period of the historical data such as 'live' 'daily'
    *   isDisconnected: boolean value for checking websocket is connected
    *   selectedIndex: index of historical data which user interacts with
     */
    export interface State {
        bandwidth: number;
        data: MappedHistoDataType[];
        flag: number;
        loading: boolean;
        line: Line<MappedHistoDataType>;
        height: number;
        isMenuOn: boolean;
        selectedIndex: number;
        containerRef: React.RefObject<HTMLDivElement>;
        marginTop: number;
        marginLeft: number;
        marginRight: number;
        maximum: number;
        minimum: number;
        type: ChartTypes;
        volumeChartHeight: number;
        volumeChartMarginTop: number;
        width: number;
        xScale: ScaleBand<Date>;
        yScale: ScaleLinear<number,number>;
        volumeScale: ScaleLinear<number, number>;
    }
class CryptoChart extends React.Component<Props, State> {
    static defaultProps = {
        width: 600,
        height: 600
    };
    state: State = {
        bandwidth: 0,
        data: [],
        flag: -1,
        loading: true,
        line: line<MappedHistoDataType>(),
        height: 0,
        isMenuOn: false,
        selectedIndex: -1,
        containerRef: React.createRef<HTMLDivElement>(),
        marginLeft: 0,
        marginTop: 33,
        marginRight: 70,
        maximum: 0,
        minimum: 0,
        type: ChartTypes.candle,
        volumeChartHeight: 0,
        volumeChartMarginTop: 0,
        width: 0,
        xScale: scaleBand<Date>(),
        yScale: scaleLinear(),
        volumeScale: scaleLinear()
    };
    static getDerivedStateFromProps(nextProps: Props, prevState: State) {
        let { marginRight, marginTop, line ,volumeScale,xScale, yScale} = prevState;
        const { data, height, width, flag, isDisconnected } = nextProps;
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

        if (data.length && data !== prevState.data) {
            // add some cache for preventing redundant calculation.
            let maximum = max(data, d => d.high);
            let minimum =  min(data, d => d.low);

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
                histo: this.props.location.search ? parse(this.props.location.search).histo as string: 'live',
                tsym: this.props.location.search ? parse(this.props.location.search).tsym as string : 'USD',
            });
        }
    }
    componentDidUpdate(prevP: Props, prevS: State) {
        const { fsym } = this.props.match.params;
        // when url path params 'fsym' is changed
        if(prevP.match.params.fsym !== fsym) {
            this.renewCurrencyData();
        }
        if(prevP.location.search !== this.props.location.search) {
            this.props.UNSUBSCRIBE();
            this.props.REQUEST_INITIAL_DATA({
                fsym: fsym,
                histo: parse(this.props.location.search).histo as string,
                tsym: parse(this.props.location.search).tsym as string
            });
        }
    }
    componentWillUnmount() {
        console.log('unmounted');
        this.props.UNSUBSCRIBE();
        this.props.CLEAR();
    };
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        const { fsym } = this.props.match.params;
        const { current } = nextProps;
        const { data, selectedIndex, isMenuOn } =  this.state;
                return nextProps.match.params.fsym !== fsym || data !== nextState.data || current !== this.props.current || selectedIndex !== nextState.selectedIndex || isMenuOn !== nextState.isMenuOn;
    }

    listenCurrent= () => {
        console.log('donka')
        this.props.LISTEN_CURRENT({
            fsym: this.props.match.params.fsym,
            tsym: this.props.location.search ? parse(this.props.location.search).tsym as string : 'USD',
        });
    };
    toggleLoading = (callback?: any) => this.setState({ loading: this.state.loading }, () => callback());
    // setHeightandWidth = (height, width) => this.setState({ width: width, height: height });
    setSelectedIndex = (num: number) => (e: React.MouseEvent<SVGRectElement>) =>{
        e.stopPropagation();
        this.setState({ selectedIndex: num });
    };
    setHisto = (histo: string) => (e: React.MouseEvent<HTMLButtonElement>) => this.props.history.push(`/currencies/BTC?histo=${histo}`);
    toggleMenu = (e: React.MouseEvent<HTMLButtonElement>) => this.setState({ isMenuOn: !this.state.isMenuOn});
    renewCurrencyData() {
        this.setState({
            loading: true
        }, () => {
            this.props.CLEAR();
            this.props.UNSUBSCRIBE();
            this.props.REQUEST_INITIAL_DATA({
                fsym:this.props.match.params.fsym,
                histo: parse(this.props.location.search).histo as string,
                tsym: parse(this.props.location.search).tsym as string
            });
        })
    }
    render() {
        return this.props.children({
            ...this.state,
            current: this.props.current,
            fsym: this.props.match.params.fsym,
            listenCurrent: this.listenCurrent,
            isDisconnected: this.props.isDisconnected,
            histo: parse(this.props.location.search).histo as string,
            setSelectedIndex: this.setSelectedIndex,
            setHisto: this.setHisto,
            toggleMenu: this.toggleMenu,
            tsym:  parse(this.props.location.search).tsym as string
        });
    }
}

export default withRouter(connect(mapStateToProps, mapDisPatchToProps)(CryptoChart));

