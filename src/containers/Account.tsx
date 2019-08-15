import * as React from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';

namespace Account {
    export type Props = {
        children: (props: RenderProps) => JSX.Element;
    } & RouteComponentProps
    export type State = {
    };
}
export type RenderProps = Account.State;
class Account extends React.Component<Account.Props, Account.State> {
    state: Account.State = {
    };
    render() {
        return this.props.children({
            ...this.state
        });
    }
}

export default withRouter(Account);

