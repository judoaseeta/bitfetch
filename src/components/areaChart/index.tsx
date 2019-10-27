import * as React from 'react';
import { RenderProp } from '../../containers/subCharts/SubCharts';
import AreaChart from './areaChart';
import Loading from '../../utils/puffLoader/Loading';
import * as styles from './styles/index.scss';

const AreaChartCompo: React.FunctionComponent<RenderProp> = ({ currents,datas, isDataReady,flagObject, xScale, yScales, navigateTo, width, height }) => (
    <div
        className={styles.container}
    >
        <Loading
            strokeWidth={30}
            strokeColor={'#e84118'}
            isLoading={!isDataReady}
        />
        {
            Object.entries(datas).map(([coinName, data]) => (
                <AreaChart
                    key={coinName}
                    coinName={coinName}
                    current={currents[coinName]}
                    width={width}
                    height={height}
                    navigateTo={navigateTo}
                    data={data}
                    flag={flagObject[coinName]}
                    xScale={xScale}
                    yScale={yScales[coinName]}
                />
            ))
        }
    </div>
);

export default AreaChartCompo;