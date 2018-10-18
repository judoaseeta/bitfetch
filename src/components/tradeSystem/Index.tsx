import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import * as styles from './index.scss';

import Header from './Header';
import CryptoChart  from '../../containers/CryptoChart';
import CandleChart from '../chart/CandleChart';
const TradeSystem: React.SFC<{

} & RouteComponentProps<{ fsym: string }>> = ({ match }) => (
    <div
        className={styles.container}
    >
        <Header
            fsym={match.params.fsym}
        />
        <main>
            <div>2-1</div>
            <CryptoChart
                width={700}
                height={400}
            >
                {({
                      bandwidth,
                      current,
                      containerRef,
                      data,
                      fsym,
                      height,
                      loading,
                      isDisconnected,
                      marginLeft,
                      marginRight,
                      marginTop,
                      minimum,
                      maximum,
                      selectedIndex,
                      setSelectedIndex,
                      flag,
                      histo,
                      line,
                      tsym,
                      type,
                      width,
                      volumeChartHeight,
                      volumeChartMarginTop,
                      volumeScale,
                      xScale,
                      yScale,
                  }) => (<CandleChart
                            bandwidth={bandwidth}
                            current={current}
                            data={data!}
                            fsym={fsym}
                            loading={loading}
                            line={line}
                            isDisconnected={isDisconnected}
                            marginRight={marginRight}
                            marginTop={marginTop}
                            minimum={minimum}
                            maximum={maximum}
                            histo={histo}
                            tsym={tsym}
                            xScale={xScale}
                            yScale={yScale}
                            width={width}
                            selectedIndex={selectedIndex}
                            setSelectedIndex={setSelectedIndex}
                            flag={flag}
                            volumeChartHeight={volumeChartHeight}
                            volumeChartMarginTop={volumeChartMarginTop}
                            volumeScale={volumeScale}
                            height={height}
                            containerRef={containerRef}
                            type={type}
                            marginLeft={marginLeft}
                />)
                }
            </CryptoChart>
        </main>
        <footer>3</footer>
    </div>
);

export default withRouter(TradeSystem);
