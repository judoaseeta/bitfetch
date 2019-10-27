import * as React from 'react';
import { bindActionCreators, Dispatch } from "redux";
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { pie } from 'd3-shape';
import { RootState } from "./index";
// adapter
import { presenterActions } from '../core/lib/adapters/redux/accountEpic';
// entity
import Transaction from '../core/lib/entities/transaction';
import TradeStatus from '../core/lib/entities/tradeStatus';


const mapStateToProps = (state: RootState) =>({
        auth: state.auth,
        account: state.account,
        currentStatus: {
            current: state.chart.currentPrice.current,
            listening: state.chart.listening
        },
        ...state.account
    });

const mapDisPatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(({
        ...presenterActions
    }), dispatch)
});
type ReduxProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDisPatchToProps>;
export type RenderProps = {
    transactions: Transaction[],
    tradeStatus: TradeStatus | null
    fsym: string;
    isSignIn: boolean;
    currentStatus: {
        current: number;
        listening: boolean;
    }
};

type Props = {
    children: (rProps: RenderProps) => JSX.Element;
} & ReduxProps & RouteComponentProps<{ fsym: string; }>;
type State = {
    currencyStatus: TradeStatus | null
};
class InvestStatus extends React.Component<Props, State> {
    state: State = {
        currencyStatus : null
    };

    componentDidMount() {
        const { auth: { isSignIn},REQUEST_TRANSACTIONS, account: { transactions } } = this.props;
        if (isSignIn && transactions.length === 0) REQUEST_TRANSACTIONS();
    }
    componentDidUpdate(prevProps: Props) {
        const { account: { transactions: oldTransactions, tradeStatus: oldTradeStatus}} = prevProps;
        const { account: { transactions, tradeStatus }} = this.props;
        if(oldTransactions !== transactions) {

        }
        if(oldTradeStatus !== tradeStatus) {
        }
    }
    render() {
        return(
            this.props.children({
                fsym: this.props.match.params.fsym,
                transactions: this.props.account.transactions,
                tradeStatus: this.props.account.tradeStatus,
                currentStatus: this.props.currentStatus,
                isSignIn: this.props.auth.isSignIn,
            })
        );
    }
};

export default withRouter(connect(mapStateToProps, mapDisPatchToProps)(InvestStatus));