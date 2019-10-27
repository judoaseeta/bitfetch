import * as React from 'react';

class Tester extends React.Component<{}> {
    componentDidMount() {
        console.log('check starteed');
    }
    componentDidUpdate(){
        console.log('i am updated too.')
    }
    render() {
        return <div>s</div>
    }
}

export default Tester;
