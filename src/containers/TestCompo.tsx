import * as React from 'react';

class TestCompo extends React.Component {
    state = {

    };
    componentDidMount() {
        console.log('It has Mounted: TEST')
    }
    componentDidUpdate() {
        console.log('It has Updated: TEST')
    }
    render() {
        return (<div>Test</div>);
    }
}
export default TestCompo;