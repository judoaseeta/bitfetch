import * as React from 'react';
import Api from "@aws-amplify/api";
class TestCompo extends React.Component {
    state = {

    };
    componentDidMount() {
        console.log('It has Mounted: TEST')

    }
    componentDidUpdate() {
        console.log('It has Updated: TEST')
    }
    load(){
        console.log(Api.get('account', '/load',{}).catch(e => console.log(e.response.data)));
    }
    render() {
            return (<div onClick={this.load}>Test</div>);
        }
}
export default TestCompo;