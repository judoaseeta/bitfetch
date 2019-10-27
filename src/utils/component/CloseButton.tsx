import * as React from 'react';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import FaIcon from './faIcon';

import * as styles from './closeButton.scss';
const CloseButton:React.FunctionComponent<{
    className?: string;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}> = ({ className, onClick }) =>
    <FaIcon
        className={className? className : styles.button}
        onClick={onClick}
        icon={faWindowClose}
    />;

export default CloseButton;

