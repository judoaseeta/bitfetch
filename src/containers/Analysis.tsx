import * as React from 'react';
import { withRouter, RouteComponentProps  } from 'react-router-dom';
import {connect} from 'react-redux';
import * as moment from 'moment';
import { scaleLog, scaleBand, scaleLinear } from 'd3-scale';
import { min, max } from 'd3-array';
import { area, curveNatural } from 'd3-shape';
import { rgb } from 'd3-color';

import { RootState } from './';

// interactor
import CryptoApiInteractor from '../core/lib/useCases/cryptoApi/';

// entity
import HistoDataWithSpan from '../core/lib/entities/histoDataWithSpan';


const MapStateToProps = (state: RootState) => ({
    coinList: state.coinList
});
export enum AnalType {
    SPAN = 'SPAN',
    PAIR = 'PAIR',
    MAP = 'MAP'
}
export type RenderProps = Exclude<State, 'timer'> & {
    spanMouseHandler: React.MouseEventHandler<HTMLCanvasElement>;
    spanDisInterAct: React.MouseEventHandler<HTMLCanvasElement>;
    setType: (type: keyof typeof AnalType) => React.MouseEventHandler<HTMLLIElement>;
};
type Props = {
    children: (rProps: RenderProps) => JSX.Element;
} & ReturnType<typeof MapStateToProps> & RouteComponentProps<{ fsym: string; }>;
type State = {
    analType: AnalType;
    histoDataWithSpan: HistoDataWithSpan[];
    canvasRef: React.RefObject<HTMLCanvasElement>;
    interactRef: React.RefObject<HTMLCanvasElement>;
    timer: number;
    width: number;
    height: number;
    isSpanInteractReady: boolean;
}
class Analysis extends React.Component<Props,State> {
    state: State = {
        analType: AnalType.SPAN,
        histoDataWithSpan: [],
        canvasRef: React.createRef<HTMLCanvasElement>(),
        interactRef: React.createRef<HTMLCanvasElement>(),
        timer: 0,
        width: 0,
        height: 0,
        isSpanInteractReady: false,
    };
    async componentDidMount() {
        const { histoDataWithSpan } = this.state;
        if(histoDataWithSpan.length === 0) {
            await this.requestSpanData();
        }
    }
    async requestSpanData () {
        const { fsym } = this.props.match.params;
        const spannedData = await CryptoApiInteractor.getSpannedHistoData().requestWithMapping({ fsym });

        this.setState({
            histoDataWithSpan: spannedData,
            timer: window.setInterval(() => this.checkWidth(), 800),
        });
    }
    componentDidUpdate(prevProps: Props, prevState: State, snapshot?: any) {
        const { width: prevWidth, analType: prevAnal } = prevState;
        const { histoDataWithSpan, analType } = this.state;
        const { match: { params : { fsym : prevFsym }}} = prevProps;
        const { match: { params : { fsym } }} = this.props;
        if(this.state.canvasRef.current && analType === AnalType.SPAN && histoDataWithSpan.length > 0 ) {
            const { width } = this.state;
            if(width > 1000)  {
                this.drawSpanPanel();
            }
        }
        if(prevFsym !== fsym) {

        }
    }
    componentWillUnmount(): void {
        if(this.state.timer > 0) { this.clearTimer();}
    }
    clearTimer() {
        window.clearInterval(this.state.timer);
    }
    checkWidth() {
        const { width, height  } = this.state.canvasRef.current!.getBoundingClientRect();
        if(width >= 1000) {
            this.setState({
                width: width,
                height: height,
            }, () =>this.clearTimer())
        }
    }
    drawSpanPanel = () => {
        const { histoDataWithSpan } = this.state;
        const { width, height } =  this.state.canvasRef.current!.getBoundingClientRect();
        const ctx = this.state.canvasRef.current!.getContext('2d');
        const canvasWidth = Math.floor(width);

        if(histoDataWithSpan.length > 0 && canvasWidth > 1000) {
            const colorScale = scaleLog<string,string>()
                                .domain([ min(histoDataWithSpan, d =>d.span)!, max(histoDataWithSpan, d => d.span)!])
                                .range([rgb('#f5f6fa').toString(), rgb('#EA2027').toString()]);
            // hori * i + j;
            const { marginTop, numRows, padLeft, cellSize ,cellPad ,horizontalCells} = this.getSpec();
            for(let i = 0; i <= numRows; i++) {
                for(let j = 0; j < horizontalCells; j++) {
                    if(!histoDataWithSpan[0 + (i * horizontalCells) + j]) break;
                    ctx!.beginPath();
                    ctx!.rect(padLeft + (cellSize * j), marginTop + (cellSize * i) ,cellSize - cellPad, cellSize - cellPad);
                    ctx!.fillStyle = colorScale(histoDataWithSpan[0 + (i * horizontalCells) + j].span);
                    ctx!.fill();
                    ctx!.closePath();
                }
            }
        }
    };
    clearSpanInterAct = () => {
        const { width, height } = this.state;
        const ctx = this.state.interactRef.current!.getContext('2d');
        ctx!.clearRect(0, 0, width, height);
    };
    spanInterAct = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const { width } = this.state;
        if(width > 600) {
            const { nativeEvent : { offsetX: x, offsetY: y} } = e;
            const { histoDataWithSpan } = this.state;
            const { marginTop, padLeft , cellSize ,horizontalCells} = this.getSpec();
            const row =  Math.floor((y - marginTop ) / cellSize);
            const col = Math.floor(( x - padLeft) /  cellSize );
            const cellNum = (row * horizontalCells) + col;
            // if mouse pointer is below marginTop => start to draw a span lines and chart
            if( y > marginTop && x > padLeft && cellNum < histoDataWithSpan.length) {
                this.drawInteract(row, col, cellNum);
            }
        }
    };
    spanDisInterAct = () => {
        this.clearSpanInterAct();
    };
    drawInteract = (row: number, col: number, cellNum: number) => {
        const { width, height, histoDataWithSpan } = this.state;
        const { marginTop, padLeft, cellSize ,cellPad ,horizontalCells} = this.getSpec();
        const ctx = this.state.interactRef.current!.getContext('2d');
        const span = histoDataWithSpan[cellNum].span;
        const start = (cellNum + 1) - span;
        const startRow = Math.floor(start / horizontalCells);
        const startCol = Math.floor(start % horizontalCells);
        const endCol  = Math.floor(cellNum % horizontalCells);
        ctx!.clearRect(0, 0, width, height);
        for(let i = startRow; i <= row; i++) {
            if(i === startRow) {
                for(let j = startCol; j < horizontalCells; j++) {
                    if(horizontalCells * i + j === cellNum ) {
                        ctx!.beginPath();
                        ctx!.strokeStyle = 'black';
                        ctx!.lineWidth = 3;
                        ctx!.strokeRect(padLeft + (cellSize * j), marginTop + (cellSize * i) ,cellSize - cellPad, cellSize - cellPad);
                        ctx!.closePath();
                        break;
                    }
                    if(horizontalCells * i + j > cellNum ) break;
                    ctx!.beginPath();
                    ctx!.strokeStyle = '#576574';
                    ctx!.lineWidth = 2;
                    ctx!.strokeRect(padLeft + (cellSize * j), marginTop + (cellSize * i) ,cellSize - cellPad, cellSize - cellPad);
                    ctx!.closePath();
                }
            } else {
                for(let j = 0; j < horizontalCells; j++) {
                    if(horizontalCells * i + j === cellNum ) {
                        ctx!.beginPath();
                        ctx!.strokeStyle = 'black';
                        ctx!.lineWidth = 3;
                        ctx!.strokeRect(padLeft + (cellSize * j), marginTop + (cellSize * i) ,cellSize - cellPad, cellSize - cellPad);
                        ctx!.closePath();
                        break;
                    }
                    if(horizontalCells * i + j > cellNum ) break;
                    ctx!.beginPath();
                    ctx!.strokeStyle = '#576574';
                    ctx!.lineWidth = 2;
                    ctx!.strokeRect(padLeft + (cellSize * j), marginTop + (cellSize * i) ,cellSize - cellPad, cellSize - cellPad);
                    ctx!.closePath();
                }
            }
        }
        this.drawChartContainer(start, cellNum);
    };
    setType = (type: keyof typeof AnalType) => () => this.setState({ analType: AnalType[type]});
    // Function for generating fundamental number for drawing spans and a chart.
    getSpec = () => {
        const { width, histoDataWithSpan } = this.state;
        if(width > 1000) {
            const padLeft = 10;
            const padRight = 10;
            const marginTop = histoDataWithSpan.length > 1000 ? 10: 100;
            const horizontalCells = 50;
            const cellSize = (width - padLeft -padRight) / horizontalCells;
            const cellPad = Math.floor(cellSize / 10);
            const numRows = Math.round(histoDataWithSpan.length / horizontalCells);
            return {
                padLeft,
                padRight,
                marginTop,
                horizontalCells,
                cellSize,
                cellPad,
                numRows
            }
        } else {
            const padLeft = 10;
            const padRight = 10;
            const marginTop = 10;
            const horizontalCells = 50;
            const cellSize = (width - padLeft -padRight) / horizontalCells;
            const cellPad = Math.floor(cellSize / 10);
            const numRows = Math.round(histoDataWithSpan.length / horizontalCells);
            return {
                padLeft,
                padRight,
                marginTop,
                horizontalCells,
                cellSize,
                cellPad,
                numRows
            }
        }
    };
    // params: startIndex:
    drawChartContainer = (startIndex:number , endIndex: number) => {
        const { width } = this.state;
        const { padLeft, padRight, horizontalCells, cellSize, numRows, cellPad } = this.getSpec();
        const chartWidth = cellSize * 25;
        const chartHeight = cellSize * 12;
        const centerY = Math.floor(numRows / 2);
        const startCol = Math.floor(startIndex % horizontalCells);
        const endRow = Math.floor(endIndex / horizontalCells);
        const endCol =  Math.floor(endIndex % horizontalCells);
        const { x: targetX, y: targetY } = this.getCoord(startIndex);
        const { y } = this.getCoord(endIndex);
        // check if posY is bigger than center of y Axis.
        if(endRow > centerY) {
            // check if PosX of column of start index is bigger than 24 which is half of number of cells per row
            if(startCol > 24) {
                this.drawChartLayer(targetX - chartWidth, targetY + cellSize - chartHeight - cellPad, chartWidth, chartHeight,endIndex);
            } else {
                this.drawChartLayer(padLeft   , targetY - chartHeight, chartWidth, chartHeight, endIndex);
            }
        } else {
            // check if PosX of column of end index is bigger than 24 which is half of number of cells per row
            if(endCol > 24) {
                this.drawChartLayer(width - chartWidth - padRight, y + cellSize, chartWidth, chartHeight, endIndex);
            } else {
                this.drawChartLayer(padLeft   , y + cellSize, chartWidth, chartHeight, endIndex);
            }
        }
    };
    drawChartLayer = (x: number,y: number, width: number, height: number, index: number) => {
        const { histoDataWithSpan, interactRef } = this.state;
        const ctx = this.state.interactRef.current!.getContext('2d');

        // step1 get spans from data;
        let startIndex:number;
        let endIndex:number;
        if(index < 60) startIndex = 0;
        else {
            startIndex = index - 60;
            /*
            if(spanData[targetIndex] > 60 && targetIndex - spanData[targetIndex] + 1 >= 0) {
                startIndex = targetIndex - spanData[targetIndex] + 1;
            } else {

            }
            */
        }
        if(index + 30 > histoDataWithSpan.length - 1) endIndex = histoDataWithSpan.length - 1;
        else endIndex = index + 30;
        // const dataForChart = mapDataWithSpan(histoData, spans, index);
        const dataForChart = histoDataWithSpan.slice(startIndex, endIndex);
        // step2 make scale and area generator
        const minY = min(dataForChart, d => d.close)!;
        const maxY = max(dataForChart, d => d.close)!;
        const marginTop = 80;
        const chartHeight = height - marginTop;
        const marginLeft = 30;
        const yScale = scaleLinear<number, number>()
                                  .domain([minY, maxY])
            .range([chartHeight, 0])
            .nice();
        const xScale = scaleBand<number>()
            .domain(dataForChart.map( d => d.time))
            .range([marginLeft, width - marginLeft]);
        const Area = area<HistoDataWithSpan>()
            .x(d => xScale(d.time)!)
            .y0(chartHeight)
            .y1(d => yScale(d.close))
            .context(ctx!)
            .curve(curveNatural);

        // step3 draw a chart container
        ctx!.save();
        ctx!.globalAlpha = 0.85;
        ctx!.beginPath();
        ctx!.rect(x, y, width, height);
        ctx!.fillStyle = 'black';
        ctx!.fill();
        ctx!.restore();
        ctx!.closePath();

        // step4 draw a volume scale legend
        const spanColors = scaleLog<string>()
            .domain([ min(dataForChart, d => d.volumefrom)!, max(dataForChart, d => d.volumefrom)!])
            .range([rgb('#218c74').toString(), rgb('#ff793f').toString()]);
        const target = histoDataWithSpan[index].time;
        const targetSpan = histoDataWithSpan[index].span;
        const targetIndex = dataForChart.findIndex( d => d.time === target);
        const fromIndex = (targetIndex - targetSpan) + 1< 0 ? 0 : (targetIndex - targetSpan + 1);
        const fromX = xScale(dataForChart[fromIndex].time)!;
        const targetX = xScale(dataForChart[targetIndex].time)!;
        const maxYPos = yScale(maxY);
        const minYPos = yScale(minY);

        //step5 draw a left axis
            // price tick lines on left.
        const yTicks = yScale.ticks(10);

        ctx!.beginPath();
        ctx!.translate(x , y + marginTop);
        ctx!.moveTo(10, yScale(yTicks[yTicks.length - 1]) - 10);
        ctx!.lineTo(10, yScale(yTicks[0]));
        ctx!.strokeStyle = 'white';
        ctx!.lineWidth = 1;
        ctx!.stroke();
        ctx!.setTransform(1,0,0,1,0,0);
        ctx!.closePath();
        // draw a line per price tick.
        yTicks.forEach( tick => {
            ctx!.beginPath();
            ctx!.translate(x, y + marginTop);
            ctx!.moveTo(10, yScale(tick));
            ctx!.lineTo(18, yScale(tick));
            ctx!.strokeStyle = 'white';
            ctx!.lineWidth = 1;
            ctx!.stroke();
            ctx!.setTransform(1,0,0,1,0,0);
            ctx!.closePath();

        });
            // price ticks on left.
        yTicks.forEach( tick => {
            ctx!.beginPath();
            ctx!.translate(x, y + marginTop);
            ctx!.fillStyle = 'white';
            ctx!.font      = "normal 9px Verdana";
            ctx!.textAlign = 'left';
            ctx!.textBaseline = 'bottom';
            ctx!.fillText(`${tick}`,20, yScale(tick));
            ctx!.setTransform(1,0,0,1,0,0);
            ctx!.closePath();

        });

        ctx!.beginPath();
        ctx!.translate(x + marginLeft + 20, y + marginTop);
        ctx!.fillStyle = 'white';
        ctx!.font      = "normal 8px Verdana";
        ctx!.textAlign = 'right';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(`${spanColors.ticks()[0]}`,marginLeft - 2, maxYPos - 55);

        ctx!.rect(marginLeft, maxYPos - 65, 2, 20);
        ctx!.fill();
        ctx!.setTransform(1,0,0,1,0,0);
        ctx!.closePath();


        const colorLegendUnitLength = Math.floor(100 / spanColors.ticks().length);
        spanColors.ticks(10).forEach( (d, i) => {
            ctx!.beginPath();
            ctx!.translate(x + marginLeft + 20, y + marginTop);
            ctx!.rect(marginLeft + 2 + (colorLegendUnitLength * i), maxYPos - 65, colorLegendUnitLength, 20);
            ctx!.fillStyle = spanColors(d);
            ctx!.fill();
            ctx!.setTransform(1,0,0,1,0,0);
            ctx!.closePath();
        });

        const maxColorScaleLength = colorLegendUnitLength * spanColors.ticks().length;
        ctx!.beginPath();
        ctx!.translate(x + marginLeft + 20, y + marginTop);
        ctx!.rect(marginLeft + maxColorScaleLength, maxYPos - 65, 2, 20);
        ctx!.fillStyle = 'white';
        ctx!.font      = "normal 8px Verdana";
        ctx!.textAlign = 'left';
        ctx!.textBaseline = 'middle';
        ctx!.fillText(
            `${spanColors.ticks()[spanColors.ticks().length - 1]}`,
            marginLeft + maxColorScaleLength + 4,
            maxYPos - 55
        );

        ctx!.fill();
        ctx!.setTransform(1,0,0,1,0,0);
        ctx!.closePath();

        ctx!.beginPath();
        ctx!.save();
        ctx!.globalAlpha = 0.9;
        ctx!.translate(x + marginLeft, y + marginTop);
        // span length
        ctx!.fillStyle = 'white';
        ctx!.font      = "normal 16px Verdana";
        ctx!.textAlign = 'center';

        // draw a length of span of current selected time
        const barwidth = fromX - targetX;
        ctx!.fillText(dataForChart[targetIndex].span > 60 ? `60+(${dataForChart[targetIndex].span.toString()})` : dataForChart[targetIndex].span.toString(), xScale(dataForChart[fromIndex].time)! - (barwidth / 2),maxYPos - 18 );
        ctx!.moveTo(fromX,maxYPos - 35 );
        ctx!.lineTo(targetX, maxYPos - 35 );
        ctx!.lineWidth = 5;
        ctx!.strokeStyle = 'red';
        ctx!.stroke();
        ctx!.restore();
        ctx!.closePath();

        const startDate = moment(dataForChart[fromIndex].date ).format("MMM Do YY");
        const endDate = moment(dataForChart[targetIndex].date ).format("MMM Do YY");
        ctx!.beginPath();
        ctx!.translate(x, y + marginTop);
        ctx!.fillStyle = 'white';
        ctx!.font      = "normal 10px Verdana";
        ctx!.textAlign = 'right';
        ctx!.textBaseline = 'middle';
        ctx!.fillText('Source: cryptocompare.com', width - 10, maxYPos - 55);
        ctx!.font      = "bold 12px Verdana";
        ctx!.fillText(`Period: ${startDate} - ${endDate}`,width - 10,maxYPos - 70);
        ctx!.setTransform(1,0,0,1,0,0);
        ctx!.closePath();

        ctx!.beginPath();
        ctx!.save();
        ctx!.translate(x + marginLeft, y + marginTop);
        if(targetIndex === fromIndex ) {
            ctx!.moveTo(targetX, minYPos);
            ctx!.lineTo(targetX, maxYPos - 15);
        } else {
            ctx!.moveTo(fromX, minYPos);
            ctx!.lineTo(fromX, maxYPos - 35);
            ctx!.moveTo(targetX, minYPos);
            ctx!.lineTo(targetX, maxYPos - 35);
        }
        ctx!.strokeStyle = 'white';
        ctx!.lineWidth = .6;
        ctx!.stroke();
        ctx!.restore();
        ctx!.closePath();

        dataForChart.forEach( d => {
            ctx!.beginPath();
            ctx!.save();
            ctx!.globalAlpha = 0.9;
            ctx!.translate(x + marginLeft, y + marginTop);
            ctx!.moveTo(xScale(d.time)!, minYPos);
            ctx!.lineTo(xScale(d.time)!, yScale(d.close) - 15);
            ctx!.lineWidth = 4;
            ctx!.strokeStyle = spanColors(d.volumefrom!);
            ctx!.stroke();
            ctx!.restore();
            ctx!.closePath();
        });



    //final draw a chart on all above.
        ctx!.beginPath();
        ctx!.save();
        ctx!.translate(x + marginLeft, y + marginTop);
        Area(dataForChart);
        ctx!.fillStyle = '#ffda79';
        ctx!.fill();
        ctx!.restore();
        ctx!.closePath();

    };
    getCoord = (index: number): { x: number; y: number; } => {
        const { marginTop, padLeft, cellSize ,horizontalCells } = this.getSpec();
        const row = Math.floor(index / horizontalCells);
        const col = Math.floor(index % horizontalCells);
        return {
            y: (row * cellSize) +marginTop,
            x: (col * cellSize) + padLeft,
        }
    };
    render() {
        const { match : {  params : { fsym }}} =  this.props;
        return this.props.children({
            ...this.state,
            spanMouseHandler: this.spanInterAct,
            spanDisInterAct: this.spanDisInterAct,
            setType: this.setType
        })
    }
}
export default withRouter(connect(MapStateToProps)(Analysis));
