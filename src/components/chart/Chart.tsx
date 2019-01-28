import * as React from 'react';
import {max, min} from 'd3-array';
// helmet
import Helmet from '../../utils/HelmetCompo';
// chart children components.
import AxisBottom from './AxisBottom';
import AxisRight from './AxisRight';
import Band from './Band';
import Candle from './Candle';
import Circle from './Circle';
import Current from './Current';
import Disconnected from './Disconnected';
import Gradient from './Gradient';
import HistoType from './HistoType';
// import Indicator from './Indicator';
import Indicators from './Indicators';
import Loading from './Loading';
import Line from './Line';
import Portal from '../../utils/Portal';
import Stick from './Stick';
import Symbols from './Symbols';
import Volume from './Volume';

import IsTrue from '../../utils/isTrue';
import TimeParser from '../../utils/TimeParser';
import {ChartTypes, RenderProps} from '../../containers/CryptoChart';
import {bind} from 'classnames/bind';
import * as styles from './styles/CandleChart.scss';
import * as symbolStyles from './styles/Symbols.scss';
import * as axisStyles from './styles/Axis.scss';

const symbolStyle = bind(symbolStyles);
const CandleChart = React.forwardRef<HTMLDivElement, RenderProps>(({
                                          bandwidth,
                                          current,
                                          data,
                                          fsym,
                                          height,
                                          loading,
                                          listenCurrent,
                                          line,
                                          isDisconnected,
                                          marginRight,
                                          marginTop,
                                          minimum,
                                          maximum,
                                          selectedIndex,
                                          setSelectedIndex,
                                          flag,
                                          histo,
                                          tsym,
                                          type,
                                          width,
                                          volumeChartHeight,
                                          volumeChartMarginTop,
                                          volumeScale,
                                          xScale,
                                          yScale,
                                      }, ref) => (
        <div
            className={styles.container}
            ref={ref}
        >
            <Disconnected
                isActive={isDisconnected}
                listenCurrent={listenCurrent}
            />
            <Helmet
                title={`Virtual trading ${fsym} with Bitfetch`}
                metas={[
                    {
                        name: 'keywords',
                        content:`${fsym}, virtual, trading, crypto-currency, crypto currencies,bitcoin, live candle chart, historic price`
                    }
                ]}
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
                <symbol
                    className={symbolStyle('current', {
                        up: flag === 1,
                        down: flag === 2,
                        same: flag === 4
                    })}
                    id="current"
                    viewBox="0 0 50 25"
                >
                    <rect
                        x={4}
                        y={4}
                        rx={5}
                        ry={5}
                        width={46}
                        height={19}
                    />
                    <text
                        x={10}
                        y={14}
                        fontSize="9px"
                        fill="white"
                    >{current}</text>.
                </symbol>
                <text
                    className={styles.fsym}
                    x={40}
                    y={marginTop / 2}
                    textAnchor='middle'
                >
                    {fsym} - {tsym}
                </text>
                <HistoType
                    height={marginTop / 2}
                    y={marginTop / 2}
                />
                <g
                    transform={`translate(0, ${marginTop})`}
                >
                    {
                        IsTrue(type === ChartTypes.candle, <>
                            {data && selectedIndex > -1 && <Band
                                selected={selectedIndex > -1}
                                x={xScale(data[selectedIndex].time)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                height={height}
                            />
                            }
                            {data && data.map((dt, index) => (<Candle
                                key={`${dt.open}${index}`}
                                open={dt.open}
                                close={dt.close}
                                x={xScale(dt.time)!}
                                y={0}
                                onMouseEnter={setSelectedIndex(index)}
                                height={height}
                                width={bandwidth}
                                unvisible={true}
                            />))}
                            {data && data.map((dt, index) => (<Stick
                                key={`${dt.close}${index}`}
                                open={dt.open}
                                close={dt.close}
                                selected={selectedIndex === index}
                                x={xScale(dt.time)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                y={yScale(dt.high)}
                                height={yScale(dt.low) - yScale(dt.high)}
                            />))}
                            {data && data.map((dt, index) => (<Candle
                                key={`${index}${dt.high}`}
                                open={dt.open}
                                close={dt.close}
                                selected={index === selectedIndex}
                                x={xScale(dt.time)! + Math.floor(bandwidth / 4)}
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
                            {data && data.map((dt, index) => (<Candle
                                key={`${dt.open}${index}`}
                                open={dt.open}
                                close={dt.close}
                                x={xScale(dt.time)!}
                                y={0}
                                onMouseEnter={setSelectedIndex(index)}
                                height={height}
                                width={bandwidth}
                                unvisible={true}
                            />))}
                            {data && selectedIndex > -1 && <Band
                                selected={selectedIndex > -1}
                                x={xScale(data[selectedIndex].time)! + Math.floor(bandwidth / 4) + (bandwidth / 4) - 1}
                                height={height}
                            />
                            }
                            {
                                data && data.map((dt, index) => (
                                    <Circle
                                        key={`${dt.time}${dt.close}`}
                                        cx={xScale(dt.time)! + bandwidth / 2}
                                        cy={yScale(dt.close)}
                                        r={3}
                                        selected={selectedIndex === index}
                                        onMouseEnter={setSelectedIndex(index)}
                                    />
                                ))
                            }
                        </>)
                    }
                </g>
                <Indicators
                    bandwidth={bandwidth}
                    data={data}
                    height={height}
                    maximum={maximum}
                    selectedIndex={selectedIndex}
                    type={type}
                    volumeChartHeight={volumeChartHeight}
                    volumeChartMarginTop={volumeChartMarginTop}
                    xScale={xScale}
                    yScale={yScale}
                />
                <AxisRight
                    x={width -  marginRight}
                    y={marginTop}
                    yScale={yScale}
                    style={axisStyles.axis}
                />
                <g
                    transform={`translate(0, ${height - volumeChartHeight})`}
                >
                    {data && data.map((dt, index) =>
                        <Volume
                            key={`${dt.volumeto}${dt.volumefrom}`}
                            selected={index === selectedIndex}
                            x={xScale(dt.time)! + Math.floor(bandwidth * 0.15)}
                            y={volumeScale(dt.volumefrom)}
                            width={bandwidth * 0.7}
                            height={volumeScale(0) - volumeScale(dt.volumefrom)}
                        />
                    )}
                </g>
                {IsTrue(histo === 'live' || histo === '3d', <AxisBottom
                    x={0}
                    xScale={xScale}
                    y={height - volumeChartHeight - volumeChartMarginTop}
                    histo={histo}
                />)}
                {IsTrue(histo !== 'live' && histo !== '3d' , <line
                    stroke="white"
                    strokeWidth="1px"
                    x1={0}
                    x2={width- marginRight}
                    y1={height - volumeChartHeight - volumeChartMarginTop}
                    y2={height - volumeChartHeight - volumeChartMarginTop}
                />)}
                <Current
                    current={current}
                    x={width - marginRight}
                    y={yScale(current) - 12.5 + marginTop}
                />
                {IsTrue(loading, <Loading
                    width={width}
                    height={height}
                />)}
            </svg>
        </div>
    )
);

export default CandleChart;
