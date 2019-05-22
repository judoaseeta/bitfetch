import * as React from 'react';


namespace Account {
    export type Props = {
        children: (props: RenderProps) => JSX.Element;
    };
    export type State = {
        selected: 'account'|'transactions'| 'portfolio'
    };
}
export type RenderProps = Account.State;
class Account extends React.Component<Account.Props, Account.State> {
    state: Account.State = {
        selected: 'account'
    };
    render() {
        return this.props.children({
            ...this.state
        });
    }
}

export default Account;
