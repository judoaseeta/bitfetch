import * as React from 'react';
import { area, Area } from 'd3-shape';
import { ScaleBand, ScaleLinear } from 'd3-scale';

import { bind } from 'classnames/bind';
import { NavigateCurrency } from '../../containers/subCharts/SubCharts';
import { HistoData  } from '../../core/lib/entities/histoData';
import * as styles from './styles/areaChart.scss';

const cx = bind(styles);
const AreaChart: React.FunctionComponent<{
    coinName: string;
    current: number;
    flag: number;
    width: number;
    height: number;
    navigateTo: NavigateCurrency
    data: HistoData[];
    xScale: ScaleBand<number>;
    yScale: ScaleLinear<number, number>
}> = ({ coinName, current, data, flag, width, height, navigateTo, xScale, yScale }) => {
    const pathArea: Area<HistoData> = area<HistoData>()
                            .x(d => xScale(d.time)!)
                            .y0(yScale(0))
                            .y1(d => yScale(d.close));
    return <svg
            className={styles.chart}
            viewBox={`0 0 ${width} ${height}`}
        >

            <path
                className={styles.area}
                d={pathArea(data)!}
            />
            <text
                className={styles.coinName}
                x={5}
                y={5}
                onClick={navigateTo(coinName)}
            >{coinName}
            </text>
        {
            current
                ?<text
                    className={cx('price', {
                        rise: flag === 1,
                        fall: flag === 2,
                        same: flag === 4
                    })}
                    x={width * 2.5 /4}
                    y={5}
                >{flag === 1 ? '▲' : flag === 2 ? '▼' : ''}{current}
                </text>
                :<text
                    className={styles.price}
                    x={width * 2.5 /4}
                    y={5}
                >{data[data.length - 1].close}
                </text>
        }
        {
            current
                ?<circle
                    className={cx('current', {
                        rise: flag === 1,
                        fall: flag === 2,
                        same: flag === 4
                    })}
                    cx={xScale(data[data.length - 1].time)}
                    cy={yScale(current)}
                    r={2}
                />
                :<circle
                    className={cx('current')}
                    cx={xScale(data[data.length - 1].time)}
                    cy={yScale(data[data.length - 1].close)}
                    r={2}
                />
        }
        </svg>
};

export default AreaChart;
