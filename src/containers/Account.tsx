import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import { RootState } from './';

import { bindActionCreators, Dispatch } from "redux";

// adapter
import { presenterActions } from '../core/lib/adapters/redux/accountEpic';

const MapStateToProps = (state: RootState) => ({
    account: state.account,
    auth: state.auth
});

const mapDisPatchToProps = (dispatch: Dispatch) => ({
    ...bindActionCreators(({
        ...presenterActions
    }), dispatch)
});
type ReducerProps = ReturnType<typeof MapStateToProps>;
type DispatcherProps = ReturnType<typeof mapDisPatchToProps>;
export type Props = {
    children: (props: RenderProps) => JSX.Element;
} & RouteComponentProps & ReducerProps & DispatcherProps;
export type RenderProps = {};

class Account extends React.Component<Props,{}> {
    componentDidMount() {
        const { auth: { isSignIn},REQUEST_TRANSACTIONS, account: { transactions } } = this.props;
        if (isSignIn && transactions.length === 0) REQUEST_TRANSACTIONS();
    }
    render() {
        return this.props.children({});
    }
}

export default withRouter(connect(MapStateToProps,mapDisPatchToProps)(Account));

