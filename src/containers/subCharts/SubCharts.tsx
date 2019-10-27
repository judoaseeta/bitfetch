import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {scaleBand, scaleLinear, ScaleLinear, ScaleBand} from 'd3-scale';
import { min, max } from 'd3-array';
// utils
import { parse } from 'query-string';

// domains
import CurrencyLiveData from '../../core/lib/entities/currencyLiveData';
import { HistoData, HistoType  } from '../../core/lib/entities/histoData';
import TopCoin, { RawTopCoinResp } from '../../core/lib/entities/topCoin';
import { mapDataWithCurrent } from '../../core/lib/adapters/redux/mainChartDataReducer';
import { Input  } from '../../core/lib/useCases/cryptoApi/type';
import CryptoApiInteractor from '../../core/lib/useCases/cryptoApi/index';
import CryptoWebSocket, { createCurrentsSubscription } from '../../core/lib/services/cryptoApi/cryptoWebSocket';

// helpers
import generateYscales from './generateYscales';
import updateYscale from './updateYscale';
import CryptoApiInterActors from "../../core/lib/useCases/cryptoApi/index";


type Size = {
    width: number;
    height: number;
}
export type NavigateCurrency = (fsym: string) => React.MouseEventHandler<SVGTextElement>;
export type RenderProp = State & Size & {
    navigateTo: NavigateCurrency;
};
export type Props = {
    children: (rp: RenderProp) => JSX.Element;
} & RouteComponentProps<{
    fsym: string
}> & Size;
export type HistoTypeObject = { [ coinName: string ]: HistoData[] };
export type YscaleObject = { [ coinName: string] : ScaleLinear<number,number>};
type CurrentObject = { [coinName: string] : number };
type FlagsObject = { [ coinName: string] : number};
export type State = {
    datas: HistoTypeObject;
    currents: CurrentObject;
    flagObject: FlagsObject;
    isListening: boolean;
    isDataReady: boolean;
    listeningSubject: CryptoWebSocket<Input[]> | null
    xScale: ScaleBand<number>;
    yScales: YscaleObject;
};

class SubCharts extends React.Component<Props, State> {
    state: State = {
        currents: {},
        datas: {},
        flagObject: {},
        isListening: false,
        isDataReady: false,
        listeningSubject: null,
        xScale: scaleBand<number>(),
        yScales: {}
    };
    listenCurrents(data: { coin: string, data: HistoData[]}[]) {
        if(this.state.listeningSubject) this.state.listeningSubject.unsubscribe();
        this.setState({
            listeningSubject: new CryptoWebSocket<Input[]>(createCurrentsSubscription),
            isListening: true
        }, () => {
          this.state.listeningSubject!.subscribe(data.map( d => ({ fsym: d.coin, tsym: 'USD'}))).subscribe(sub => {
                const { fromSymbol, price, flag } =  new CurrencyLiveData(sub);
                const { currents, datas, flagObject, yScales } = this.state;
                const newFlags = {...flagObject};
                if(price && datas ) {
                    const newDatas = {...datas};
                    const newYscales = {...yScales};
                    const newCurrents = {...currents};
                    if(newDatas[fromSymbol].length > 1 )newDatas[fromSymbol] = mapDataWithCurrent(datas[fromSymbol], price);
                    newYscales[fromSymbol] = updateYscale(yScales[fromSymbol], datas[fromSymbol]);
                    newCurrents[fromSymbol] = price;
                    newFlags[fromSymbol] = flag;
                    this.setState({
                        currents: newCurrents,
                        datas: newDatas,
                        flagObject: newFlags,
                        yScales: newYscales
                    })
                } else {
                    newFlags[fromSymbol] = flag;
                    this.setState({flagObject: newFlags})
                }
            });

        })
    }

    private async data( fsym: string) {
        const { width, height } = this.props;
        const topCoins = await CryptoApiInterActors.getTopCoins().requestWithMapping({});
        const filteredTopCoins = topCoins.filter( coin => coin.name !== this.props.match.params.fsym);
        const mappedDatas = await CryptoApiInterActors.getHistoDatas().request(filteredTopCoins);
        this.setState({
            datas: mappedDatas.reduce((acc, curr) => {
                acc[curr.coin] = curr.data;
                return acc
            }, {} as HistoTypeObject),
            xScale: this.state.xScale
                        .domain(mappedDatas[0].data.map( d => d.time ))
                            .range([10, width - 5]),
            yScales: generateYscales(mappedDatas,height),
            isDataReady: true,
        }, () =>{
            this.listenCurrents(mappedDatas);
        });
    }
    async componentDidMount() {
        const { datas, isListening } = this.state;
       if(Object.keys(datas).length === 0) this.data(this.props.match.params.fsym);
    }
    componentWillUnmount(){
        const { isListening, listeningSubject } = this.state;
        if(isListening && listeningSubject) {
            listeningSubject.unsubscribe();
        }
    }
    componentDidUpdate(prevProps: Props, prevState: State ){
        const { fsym } = this.props.match.params;
        const { fsym: prevFsym } = prevProps.match.params;
        if(fsym !== prevFsym) {
            if(this.state.listeningSubject) this.state.listeningSubject.unsubscribe();
            this.data(fsym);
        }
    }
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        const { datas } = this.state;
        const { datas : nextDatas} = nextState;
        const { match: { params: { fsym }}} = this.props;
        const { match: { params: { fsym : nextFsym }}} = nextProps;
        return (datas !== nextDatas) || (fsym !== nextFsym);
    }
    navigateTo = (fsym: string) => () => this.props.history.replace(`/currencies/${fsym}?histo=${parse(this.props.location.search).histo as HistoType}`);
    render() {
        return this.props.children({
            ...this.state,
            width: this.props.width,
            height: this.props.height,
            navigateTo: this.navigateTo
        });
    }
};

export default withRouter(SubCharts);