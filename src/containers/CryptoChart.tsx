import * as React from 'react';
/// REDUX
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch} from 'redux';

// REACT ROUTER
import {RouteComponentProps, withRouter} from 'react-router-dom';


// D3 dependencies.
import {scaleLinear, scaleBand, ScaleBand, ScaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { line, Line  } from 'd3-shape';
// rest of 3rd parties.
import { parse } from 'query-string';
/// local dependencies.

import { RootState } from './';
// domain

import { HistoData,HistoType } from '../core/lib/entities/histoData';
import { externalDispatchers } from '../core/lib/adapters/redux/mainChartDataEpics';

const mapStateToProps = (state: RootState) => {
    return {
        data: state.chart.data,
        isDisconnected: state.chart.isDisconnected,
        ...state.chart.currentPrice,
    }
};

const mapDisPatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(({
        ...externalDispatchers
    }), dispatch)
});
// D3 CHART RELATED STATIC VALUES.

//type definitions for Component
export enum ChartTypes {
    line = 'line',
    candle = 'candle'
}
export type RenderProps = State & {
    changeChartType: (chartType: ChartTypes) => () => void;
    current: number;
    setSelectedIndex: (num: number) => React.MouseEventHandler<SVGRectElement|SVGElement>;
    setHisto: (histo: string) => () => void;
    listenCurrent: React.MouseEventHandler<HTMLSpanElement>;
    toggleMenu: React.MouseEventHandler<HTMLDivElement|HTMLButtonElement>;
    isDisconnected: boolean;
    histo: HistoType;
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
        chartBottomGap: number;
        data: HistoData[];
        flag: number;
        loading: boolean;
        line: Line<HistoData>;
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
        chartBottomGap: 0,
        data: [],
        flag: -1,
        loading: true,
        line: line<HistoData>(),
        height: 0,
        isMenuOn: false,
        selectedIndex: -1,
        containerRef: React.createRef<HTMLDivElement>(),
        marginLeft: 0,
        marginTop: 33,
        marginRight: 20,
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
        let { marginRight, marginTop, line ,volumeScale,xScale, yScale, width: prevWidth} = prevState;
        const { data, height, width, flag, isDisconnected } = nextProps;
        if (prevWidth !== width || prevState.height !== height) {
            const volumeChartHeight = Math.floor(height / 6);
            const chartBottomGap = Math.floor(volumeChartHeight / 10);
            const volumeChartMarginTop = Math.floor(height / 10);
            const marginLeft = Math.floor(width * 1) / 5000;
            return {
                chartBottomGap,
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
                .domain(data.map(dat => dat.date));
            let bandwidth = xScale.bandwidth();
            yScale.range([height - prevState.volumeChartHeight - marginTop - prevState.volumeChartMarginTop - prevState.chartBottomGap, 0])
                .domain([minimum!, maximum!])
                .clamp(true)
                .nice();
            volumeScale.range([prevState.volumeChartHeight - prevState.chartBottomGap, 0])
                .domain([0, max(data, d => d.volumefrom)!])
                .nice();
            line.x((d) => xScale(d.date)! + bandwidth / 2)
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
                histo: this.props.location.search ? parse(this.props.location.search).histo as HistoType: HistoType.live,
                tsym: this.props.location.search ? parse(this.props.location.search).tsym as string : 'USD',
            });
        }
    }
    componentDidUpdate(prevP: Props, prevS: State) {
        const { fsym } = this.props.match.params;
        // when url path params 'fsym' is changed
        if(prevP.match.params.fsym !== fsym) {
            this.renewCurrencyData(true);
        }
        if(parse(prevP.location.search ).histo!== parse(this.props.location.search).histo) {
            this.renewCurrencyData();
        }
    }
    componentWillUnmount() {
        this.props.RESET();
    };
    changeChartType = (chartType: ChartTypes) => () => this.setState({ isMenuOn: false, type: chartType });
    shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
        const { fsym } = this.props.match.params;
        const { location} = this.props;
        const { current, location: nextLocation } = nextProps;
        const { data, selectedIndex, isMenuOn } =  this.state;
                return nextProps.match.params.fsym !== fsym
                    || data !== nextState.data
                    || current !== this.props.current
                    || selectedIndex !== nextState.selectedIndex
                    || isMenuOn !== nextState.isMenuOn
                    || location !== nextLocation;
    }

    listenCurrent= () => {
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
    setHisto = (histo: string) => () => this.setState({isMenuOn: false},() => this.props.history.push(`/currencies/${this.props.match.params.fsym}?histo=${histo}`));
    toggleMenu = (e: React.MouseEvent<HTMLDivElement>) => this.setState({ isMenuOn: !this.state.isMenuOn});
    renewCurrencyData(isFullyRenew? : boolean) {
        this.setState({
            loading: true
        }, () => {
            if(isFullyRenew) {
                this.props.RENEW({
                    fsym: this.props.match.params.fsym,
                    histo: this.props.location.search ? parse(this.props.location.search).histo as HistoType: HistoType.live,
                    tsym: this.props.location.search ? parse(this.props.location.search).tsym as string : 'USD',
                });
            } else {
                this.props.UPDATE_DATA({
                    fsym: this.props.match.params.fsym,
                    histo: this.props.location.search ? parse(this.props.location.search).histo as HistoType: HistoType.live,
                    tsym: this.props.location.search ? parse(this.props.location.search).tsym as string : 'USD',
                });
            }
        })
    }
    render() {
        return this.props.children({
            ...this.state,
            changeChartType: this.changeChartType,
            current: this.props.current,
            fsym: this.props.match.params.fsym,
            listenCurrent: this.listenCurrent,
            isDisconnected: this.props.isDisconnected,
            histo: parse(this.props.location.search).histo as HistoType,
            setSelectedIndex: this.setSelectedIndex,
            setHisto: this.setHisto,
            toggleMenu: this.toggleMenu,
            tsym:  parse(this.props.location.search).tsym as string
        });
    }
}

export default withRouter(connect(mapStateToProps, mapDisPatchToProps)(CryptoChart));

