import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faChartPie } from '@fortawesome/free-solid-svg-icons';

import * as styles from './styles/ExtendSearchItemIcon.scss';
export enum ExtendSearchIconType {
    lineChart = 'lineChart',
    pieChart = 'pieChart'
}
const IconType = (itemType: ExtendSearchIconType) => {
    if(itemType === ExtendSearchIconType.lineChart) return faChartLine;
    else return faChartPie;
};
const Icon: React.FunctionComponent<{
    iconType: ExtendSearchIconType
}> = ({ iconType }) => (
    <FontAwesomeIcon
        className={styles.icon}
        icon={IconType(iconType)}
        size={'2x'}
    />
);

export default Icon;
