import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import * as styles from './index.scss';

import Header from './Header';
import CryptoChart  from '../../containers/CryptoChart';
import Chart from '../chart/Chart';
import Tester from './Tester';
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
                      listenCurrent,
                      isDisconnected,
                      isMenuOn,
                      marginLeft,
                      marginRight,
                      marginTop,
                      minimum,
                      maximum,
                      selectedIndex,
                      setHisto,
                      setSelectedIndex,
                      flag,
                      histo,
                      line,
                      toggleMenu,
                      tsym,
                      type,
                      width,
                      volumeChartHeight,
                      volumeChartMarginTop,
                      volumeScale,
                      xScale,
                      yScale,
                  }) => (<Chart
                            bandwidth={bandwidth}
                            current={current}
                            data={data!}
                            fsym={fsym}
                            loading={loading}
                            line={line}
                            listenCurrent={listenCurrent}
                            isDisconnected={isDisconnected}
                            isMenuOn={isMenuOn}
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
                            setHisto={setHisto}
                            flag={flag}
                            volumeChartHeight={volumeChartHeight}
                            volumeChartMarginTop={volumeChartMarginTop}
                            volumeScale={volumeScale}
                            height={height}
                            containerRef={containerRef}
                            toggleMenu={toggleMenu}
                            type={type}
                            marginLeft={marginLeft}
                />)
                }
            </CryptoChart>
        </main>
        <Tester />
    </div>
);

export default withRouter(TradeSystem);
