import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';


import { RenderProps } from '../../containers/TradeCurrency';

import TradeButton from './TradeButton';
import TradeCurrencyBody from './TradeCurrencyBody';
const TradeCurrency: React.FunctionComponent<RenderProps & RouteComponentProps<{ fsym: string}>> =
    ({ status, isSignIn, isActive, current, match: { params: { fsym }}, onClick}) =>
    <>
        <TradeButton fsym={fsym} onClick={onClick} />
        <TradeCurrencyBody
            status={status}
            isActive={isActive}
            isSignIn={isSignIn}
            fsym={fsym}
            current={current}
            onClick={onClick}
        />
    </>;

export default withRouter(TradeCurrency);
