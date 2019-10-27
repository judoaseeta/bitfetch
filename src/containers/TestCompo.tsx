import * as React from 'react';
import signedApi from "../utils/apiUtils/signedApi";

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
            signedApi({
                method: 'get',
                endpointName: 'account',
                path: '/load',
            }).then( d => console.log(d));
    }
    render() {
            return (
              <div
                style={{
                    fontSize: '40px'
                }}
                onClick={this.load}
              >
                 hi
              </div>
    );
        }
}
export default TestCompo;