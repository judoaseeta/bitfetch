import * as React from 'react';
import {faChartBar, faChartLine, faCog} from '@fortawesome/free-solid-svg-icons';

import FaIcon from '../../../utils/component/faIcon';
import Button from '../../../utils/component/Button';
import {bind} from 'classnames/bind';
import * as styles from './styles/Buttons.scss';


//entity

import { HistoType } from '../../../core/lib/entities/histoData';
const cx = bind(styles);


export const ConfigButton: React.FunctionComponent<{
    active: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>
}> = ({ active, onClick }) =>
    <FaIcon
        className={cx('config',{
            active: active
        })}
        icon={faCog}
        onClick={onClick}
    />;

export const ChartBarButton: React.FunctionComponent<{
    active: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>
}> = ({ active, onClick }) =>
    <FaIcon
        className={cx('chartButton', {
            active: active
        })}
        icon={faChartBar}
        onClick={onClick}
    />;
export const ChartLineButton: React.FunctionComponent<{
    active: boolean;
    onClick: React.MouseEventHandler<HTMLDivElement>
}> = ({ active, onClick }) =>
    <FaIcon
        className={cx('chartButton', {
            active: active
        })}
        icon={faChartLine}
        onClick={onClick}
    />;
export const HistoButtons:React.FunctionComponent<{
    histoType: HistoType;
    setHisto: (histoType: string) => () => void;
}> = ({histoType, setHisto }) =>
    <div
        className={styles.histoButtons}
    >
        {
            Object.values(HistoType).map(histo => <Button
                className={styles.histoButton}
                key={histo}
                disabled={histoType === histo}
                onClick={setHisto(histo)}
            >{histo}</Button>)
        }
    </div>;
