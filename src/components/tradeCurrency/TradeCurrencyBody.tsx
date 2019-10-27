import * as React from 'react';
import * as styles from "./styles/TradeCurrencyBody.scss";
import CloseButton from "../../utils/component/CloseButton";
import Portal from "../../utils/component/Portal";
import IsTrue from '../../utils/component/isTrue';
import Loader from '../../utils/puffLoader/Loading';
import AssetTable from './AssetTable';
// entity
import TradeStatus from '../../core/lib/entities/tradeStatus';

const TradeCurrencyBody:React.FunctionComponent<{
    status: TradeStatus | null;
    isActive: boolean;
    isSignIn: boolean;
    fsym: string;
    current: number;
    onClick: (bool: boolean) => React.MouseEventHandler<HTMLDivElement>;
}> = ({ status, isActive, isSignIn, fsym, current, onClick}) =>
    <Portal
        isActive={isActive}
        isGlobal
    >
        <div
            className={styles.container}
        >
            <div
                className={styles.innerContainer}
            >
                <form>
                    <input
                        name="quantity"
                        step={0.0001}
                        type="number"
                    />
                </form>
                <div
                    className={styles.assets}
                >
                    {isSignIn && !!current && !!status && !!status.get(fsym) &&<AssetTable statusProp={status.get(fsym)} /> }
                </div>
                <CloseButton
                    onClick={onClick(false)}
                />
            </div>
        </div>
    </Portal>;

export default TradeCurrencyBody;
