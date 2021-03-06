import * as React from 'react';
import {max, min} from 'd3-array';
// chart children components.
import AxisBottom from './AxisBottom';
import AxisRight from './AxisRight';
import Band from './Band';
import Candle from './Candle';
import Circle from './Circle';
import Current from './Current';
import CurrentSymbol from './currentSymbol';
import Disconnected from './Disconnected';
import Gradient from './Gradient';
import Indicators from './Indicators';
import Loading from '../../utils/puffLoader/Loading';
import Line from './Line';
import Menu from './Menu/Menu';
import Stick from './Stick';
import Symbols from './Symbols';
import Volume from './Volume';

import { ConfigButton } from './Menu/Buttons';
import IsTrue from '../../utils/component/isTrue';
import TimeParser from '../../utils/data/TimeParser';
import {ChartTypes, RenderProps} from '../../containers/CryptoChart';
import {bind} from 'classnames/bind';
import * as styles from './styles/CandleChart.scss';
import * as symbolStyles from './styles/Symbols.scss';
import * as axisStyles from './styles/Axis.scss';


const candleStyle = bind(styles);
const symbolStyle = bind(symbolStyles);
const CandleChart: React.FC<RenderProps> = (({
                                          bandwidth,
                                          chartBottomGap,
                                          changeChartType,
                                          current,
                                          data,
                                          fsym,
                                          height,
                                          loading,
                                          listenCurrent,
                                          line,
                                          isDisconnected,
                                          isMenuOn,
                                          marginLeft,
                                          marginRight,
                                          marginTop,
                                          minimum,
                                          maximum,
                                          selectedIndex,
                                          setSelectedIndex,
                                          setHisto,
                                          flag,
                                          histo,
                                          tsym,
                                          toggleMenu,
                                          type,
                                          width,
                                          volumeChartHeight,
                                          volumeChartMarginTop,
                                          volumeScale,
                                          xScale,
                                          yScale,
                                      }) => (
        <div
            className={styles.container}
        >
            <Loading
                strokeWidth={10}
                isLoading={loading}
            />
            <Disconnected
                isActive={isDisconnected}
                listenCurrent={listenCurrent}
            />
            <Menu
                chartType={type}
                changeChartType={changeChartType}
                isMenuOn={isMenuOn}
                histo={histo}
                setHisto={setHisto}
                toggleMenu={toggleMenu}
            />
            <ConfigButton
                active={!isMenuOn}
                onClick={toggleMenu}
            />
            <svg
                viewBox='0 0 700 400'
                width='100%'
                height='100%'
                onMouseLeave={setSelectedIndex(-1)}
            >
                <defs>
                    <Gradient
                        id="grad1"
                        rgb1='rgb(0, 168, 255)'
                        rgb2='rgb(0, 151, 230)'
                    />
                    <Gradient
                        id="grad2"
                        rgb1='rgb(25, 42, 86)'
                        rgb2='rgb(39, 60, 117)'
                    />
                    <Gradient
                        id="grad3"
                        rgb1='rgb(109, 33, 79)'
                        rgb2='rgb(179, 55, 113)'
                    />
                </defs>
                <Symbols
                    current={current}
                    data={data}
                    selectedIndex={selectedIndex}
                    timeParser={TimeParser(histo)}
                />
                <CurrentSymbol current={current} flag={flag}/>
                <text
                    className={styles.fsym}
                    x={40}
                    y={marginTop / 2}
                    textAnchor='middle'
                >
                    {fsym} - {type.toUpperCase()} - { histo }
                </text>
                <g
                    transform={`translate(0, ${marginTop})`}
                >
                    {
                        IsTrue(type === ChartTypes.candle, <>
                            {data && selectedIndex > -1 && <Band
                                selected={selectedIndex > -1}
                                x={xScale(data[selectedIndex].date)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                height={height}
                            />
                            }
                            {data && data.map((dt, index) => (<Stick
                                key={`${dt.close}${index}`}
                                open={dt.open}
                                close={dt.close}
                                selected={selectedIndex === index}
                                x={xScale(dt.date)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                y={yScale(dt.high)}
                                height={yScale(dt.low) - yScale(dt.high)}
                            />))}
                            {data && data.map((dt, index) => (<Candle
                                key={`${index}${dt.high}`}
                                open={dt.open}
                                close={dt.close}
                                selected={index === selectedIndex}
                                x={xScale(dt.date)! + Math.floor(bandwidth / 4)}
                                y={yScale(max([dt.open, dt.close])!)}
                                height={yScale(min([dt.open, dt.close])!) - yScale(max([dt.open, dt.close])!)}
                                width={bandwidth / 2}
                            />))}
                            }
                        </>)
                    }
                    {
                        IsTrue(type === ChartTypes.line, <>
                            {
                                data && <Line
                                    d={line(data)!}
                                />
                            }
                            {data && selectedIndex > -1 && <Band
                                selected={selectedIndex > -1}
                                x={xScale(data[selectedIndex].date)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                height={height}
                            />
                            }
                        </>)
                    }
                </g>
                <AxisBottom
                    x={0}
                    xScale={xScale}
                    y={height - volumeChartHeight - volumeChartMarginTop}
                    histo={histo}
                />
                <AxisRight
                    x={width -  marginRight}
                    y={marginTop}
                    yScale={yScale}
                    style={axisStyles.axis}
                />

                <g
                    transform={`translate(0, ${height - volumeChartHeight - chartBottomGap})`}
                >
                    {data && data.map((dt, index) =>
                        <Volume
                            key={`${dt.volumeto}${dt.close}`}
                            selected={index === selectedIndex}
                            x={xScale(dt.date)! + Math.floor(bandwidth * 0.15)}
                            y={volumeScale(dt.volumefrom)}
                            width={bandwidth * 0.7}
                            height={volumeScale(0) - volumeScale(dt.volumefrom)}
                        />
                    )}
                </g>
                <Indicators
                    bandwidth={bandwidth}
                    data={data}
                    translateY={height - volumeChartHeight - chartBottomGap}
                    maximum={maximum}
                    marginTop={marginTop}
                    selectedIndex={selectedIndex}
                    type={type}
                    volumeScale={volumeScale}
                    xScale={xScale}
                    yScale={yScale}
                />

                // component for drawing line when histoType is neither 'live' nor '3d'
                {IsTrue(histo !== 'LIVE' && histo !== '3DAY' , <line
                    stroke="white"
                    strokeWidth="1px"
                    x1={0}
                    x2={width- marginRight}
                    y1={height - volumeChartHeight - volumeChartMarginTop}
                    y2={height - volumeChartHeight - volumeChartMarginTop}
                />)}
                //
                <Current
                    current={current}
                    x={width - marginRight}
                    y={(yScale(current) - 12.5 + marginTop)}
                />
                //component for interact with mouse hovering
                <g
                    transform={`translate(0, ${marginTop})`}
                >
                    {data && data.map((dt, index) => (<Candle
                        key={`${dt.open}${dt.high}`}
                        open={dt.open}
                        close={dt.close}
                        x={xScale(dt.date)!}
                        y={0}
                        onMouseEnter={setSelectedIndex(index)}
                        height={height}
                        width={bandwidth}
                        unvisible={true}
                    />))}
                </g>
            </svg>
        </div>
    )
);

export default CandleChart;
