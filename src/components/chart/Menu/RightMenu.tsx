import * as React from 'react';
import * as styles from './styles/RightMenu.scss';
import {ChartTypes} from "../../../containers/CryptoChart";
import {ChartBarButton, ChartLineButton} from './Buttons';

const RightMenu:React.FunctionComponent<{
    chartType: ChartTypes;
    changeChartType: (chartType: ChartTypes) => () => void;
}> = ({ chartType, changeChartType }) =>
    <div
        className={styles.rightMenu}
    >
        <ChartBarButton active={chartType === ChartTypes.candle} onClick={changeChartType(ChartTypes.candle)} />
        <ChartLineButton active={chartType === ChartTypes.line} onClick={changeChartType(ChartTypes.line)} />
    </div>;


export default RightMenu;