import * as React from 'react';

import { RootState } from './';

const mapStateToProps = (state: RootState) => ({

});
type RenderProps = {

}
type Props = {
    children:(rProps: RenderProps) => JSX.Element
}
type State = {

}
class BidWindow extends React.Component<Props,State> {
    render() {
        return (
            this.props.children({})
        )
    }
}

export default BidWindow;
