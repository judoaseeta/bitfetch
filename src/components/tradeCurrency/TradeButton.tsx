import * as React from 'react';
import * as styles from "./styles/TradeButton.scss";
import FaIcon from "../../utils/component/faIcon";
import {faMoneyCheckAlt} from "@fortawesome/free-solid-svg-icons";

const TradeButton: React.FunctionComponent<{
    fsym: string;
    onClick: (bool: boolean) => React.MouseEventHandler<HTMLDivElement>;
}> = ({ onClick, fsym }) =>
    <div
        className={styles.tradeButton}
        onClick={onClick(true)}
    >
        <FaIcon
            className={styles.icon}
            icon={faMoneyCheckAlt}
        />
        Trade {fsym}
    </div>;

export default TradeButton;
