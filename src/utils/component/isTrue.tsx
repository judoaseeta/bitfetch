import * as React from 'react';

const IsTrue = (condition: boolean, Compo: JSX.Element) => {
    if(condition) {
        return Compo;
    }
    return null;
};

export default IsTrue;

