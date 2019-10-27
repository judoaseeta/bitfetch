import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
type Props = {

} & RouteComponentProps<{ fsym: string }>;
type State = {

}
class TradingPairs extends React.Component<Props, State> {
    async componentDidMount(){
    }
    render() {
        return <div></div>
    }
}

export default withRouter(TradingPairs);
