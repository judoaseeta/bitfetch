import * as React from 'react';
import { bind } from 'classnames/bind';

import * as styles from './styles/Menu.scss';
import {ChartTypes} from "../../../containers/CryptoChart";
import CloseButton from '../../../utils/component/CloseButton';
import Portal from '../../../utils/component/Portal';
import RightMenu from './RightMenu';
import { HistoButtons } from './Buttons';
// entity
import { HistoType } from '../../../core/lib/entities/histoData';

const cx = bind(styles);
const Menu: React.FunctionComponent<{
    chartType: ChartTypes;
    changeChartType: (chartType: ChartTypes) => () => void;
    isMenuOn: boolean;
    histo: HistoType;
    setHisto: (histo: string) => () => void;
    toggleMenu: React.MouseEventHandler<HTMLDivElement>;
}> = ({ chartType, changeChartType,isMenuOn, histo, setHisto, toggleMenu }) => (
    <Portal
        isActive={isMenuOn}

    >
        <div
            className={cx('menu', {
                on: isMenuOn
            })}
        >
            <CloseButton
                onClick={toggleMenu}
            />
            <HistoButtons histoType={histo} setHisto={setHisto}/>
            <RightMenu chartType={chartType} changeChartType={changeChartType} />
        </div>
    </Portal>
);

export default Menu;