import * as React from 'react';
import { RenderProp } from '../../containers/AreaChart';
import AreaChart from './areaChart';

import * as styles from './styles/index.scss';

const AreaChartCompo: React.FunctionComponent<RenderProp> = ({ currents,datas, flagObject, xScale, yScales, width, height }) => (
    <div
        className={styles.container}
    >
        {
            Object.entries(datas).map(([coinName, data]) => (
                <AreaChart
                    key={coinName}
                    coinName={coinName}
                    current={currents[coinName]}
                    width={width}
                    height={height}
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