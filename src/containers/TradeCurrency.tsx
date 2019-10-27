import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { RootState } from './';
// entity
import TradeStatus from '../core/lib/entities/tradeStatus';

type TradeType = 'BUY' | 'SELL';
const mapStateToProps = (state: RootState) => ({
    isSignIn: state.auth.isSignIn,
    current: state.chart.currentPrice,
    status : state.account.tradeStatus
});

export type RenderProps = {
    status: TradeStatus | null,
    isSignIn: boolean;
    current: number;
    onClick: (bool: boolean) => React.MouseEventHandler<HTMLDivElement>;
} & TradeState;
type TradeProps = {
    children: (rProps: RenderProps) => JSX.Element;
} & ReturnType<typeof mapStateToProps> & RouteComponentProps<{ fsym: string }>
interface TradeState {
    isActive: boolean;
    sellingAmount: number;
}
class TradeCurrency extends React.Component<TradeProps, TradeState> {
    state = {
        isActive: false,
        sellingAmount: 0
    };
    componentDidUpdate(prevProps: Readonly<TradeProps>, prevState: Readonly<TradeState>, snapshot?: any): void {
        if(prevState.isActive !== this.state.isActive && this.state.isActive) {
            document.documentElement.style.overflow = 'hidden'
        }
        if(prevState.isActive !== this.state.isActive && !this.state.isActive) {
            document.documentElement.style.overflow = 'auto'
        }
    }
    shouldComponentUpdate(nextProps: TradeProps, nextState: TradeState): boolean {
        return (
            this.props.current.current !== nextProps.current.current
            || this.state.sellingAmount !== nextState.sellingAmount
            || this.state.isActive !== nextState.isActive
        );
    }
    onClick = (bool: boolean) => () => this.setState({ isActive: bool });
    render() {
        const { match: { params: { fsym}}, children, status, current, isSignIn } = this.props;
        return (
            children({
                current: current.current,
                status: status,
                isSignIn: isSignIn,
                isActive: this.state.isActive,
                onClick: this.onClick,
                ...this.state,
            })
        )
    }
}

export default withRouter(connect(mapStateToProps)(TradeCurrency));
