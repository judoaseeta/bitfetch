import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import {scaleBand, scaleLinear, ScaleLinear, ScaleBand} from 'd3-scale';
import { min, max } from 'd3-array';
// utils
import {createCurrentsSubscription, createSocketCoin, requestTopCoinsData} from '../utils/api';
import {MappedHistoDataType, mappingResponse} from '../utils/histoDataMapper';
import mappingCurrent from '../utils/mappingCurrent';
import mapDataWithCurrent from '../utils/mapDatawithCurrent';


type Size = {
    width: number;
    height: number;
}
export type RenderProp = State & Size;
export type Props = {
    children: (rp: RenderProp) => JSX.Element;
} & RouteComponentProps<{
    fsym: string
}> & Size;
export type HistoTypeObject = { [ coinName: string ]: MappedHistoDataType[] };
type YscaleObject = { [ coinName: string] : ScaleLinear<number,number>};
type CurrentObject = { [coinName: string] : number };
type FlagsObject = { [ coinName: string] : number};
export type State = {
    datas: HistoTypeObject;
    currents: CurrentObject;
    flagObject: FlagsObject;
    isListening: boolean;
    listeningSubject: ReturnType<typeof createSocketCoin> | null
    xScale: ScaleBand<Date>;
    yScales: YscaleObject;
};

class AreaChart extends React.Component<Props, State> {
    state: State = {
        currents: {},
        datas: {},
        flagObject: {},
        isListening: false,
        listeningSubject: null,
        xScale: scaleBand<Date>(),
        yScales: {}
    };
    mappingCurrent (sub: string) {
        return mappingCurrent(sub);
    };
    listenCurrents(subs: string[]) {
        this.setState({
            listeningSubject: createSocketCoin(subs),
            isListening: true
        }, () => {
           const { observable } = this.state.listeningSubject!;
            observable.subscribe(d => {
                const { FROMSYMBOL, PRICE, FLAGS } =  this.mappingCurrent(d);
                const { currents, datas, flagObject, yScales } = this.state;
                const newFlags = {...flagObject};
                if(PRICE) {
                    console.log(FLAGS, currents[FROMSYMBOL],PRICE);
                    const newDatas = {...datas};
                    const newYscales = {...yScales};
                    const newCurrents = {...currents};

                    newDatas[FROMSYMBOL] = mapDataWithCurrent(datas[FROMSYMBOL], PRICE);
                    newYscales[FROMSYMBOL] = this.updateYscale(yScales[FROMSYMBOL], datas[FROMSYMBOL]);
                    newCurrents[FROMSYMBOL] = PRICE;
                    newFlags[FROMSYMBOL] = FLAGS;
                    this.setState({
                        currents: newCurrents,
                        datas: newDatas,
                        flagObject: newFlags,
                        yScales: newYscales
                    })
                } else {
                    newFlags[FROMSYMBOL] = FLAGS;
                    this.setState({flagObject: newFlags})
                }
            });

        })
    }
    // generating Yscale for each currency when histo data of currency is fetched
    generateYscale(datas: { coin: string; data: MappedHistoDataType[]}[]): YscaleObject {
        const { height } = this.props;
        const newObject: YscaleObject = {};
        datas.forEach(({ coin, data }) => {
                const minimum = min(data, d => d.low);
                const maximum = max(data, d => d.high);
                newObject[coin] = scaleLinear()
                                    .domain([minimum!, maximum!])
                                    .range([height, 0])
        })
        return newObject;
    }
    updateYscale(oldYscale: ScaleLinear<number,number>, data: MappedHistoDataType[]): ScaleLinear<number,number>{
        const newMin = min(data, d => d.low);
        const newMax = max(data, d => d.high);
        return oldYscale.domain([newMin!, newMax!]);
    }
    async setDataToState( fsym: string) {
        const { width, height } = this.props;
        const datas = await requestTopCoinsData(this.props.match.params.fsym);
        const mappedDatas = datas.map( d => ({ coin: d.name, data: mappingResponse(d.resp).Data}));
        this.setState({
            datas: mappedDatas.reduce((acc, curr) => {
                acc[curr.coin] = curr.data;
                return acc
            }, {} as HistoTypeObject),
            xScale: this.state.xScale
                        .domain(mappedDatas[0].data.map( d => d.time ))
                            .range([10, width - 5]),
            yScales: this.generateYscale(mappedDatas)
        }, () =>{
            console.log(this.state);
            this.listenCurrents(createCurrentsSubscription(mappedDatas))
        });
    }
    async componentDidMount() {
        const { datas, isListening } = this.state;
        if(Object.keys(datas).length === 0) this.setDataToState(this.props.match.params.fsym);
    }
    componentWillUnmount(){
        const { isListening, listeningSubject } = this.state;
        if(isListening && listeningSubject) {
            listeningSubject!.unsubscribe();
        }
    }
    componentDidUpdate(prevProps: Props, prevState: State ){
        const { fsym } = this.props.match.params;
        const { fsym: prevFsym } = prevProps.match.params;
        if(fsym !== prevFsym) {
            this.setDataToState(fsym);
        }
        console.log('modified', this.state);
    }
    shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
        const { datas } = this.state;
        const { datas : nextDatas} = nextState;
        return (datas !== nextDatas);
    }
    render() {
        return this.props.children({
            ...this.state,
            width: this.props.width,
            height: this.props.height
        });
    }
};

export default withRouter(AreaChart);