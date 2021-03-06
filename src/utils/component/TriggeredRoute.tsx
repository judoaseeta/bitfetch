import * as React from 'react';
import { Route, RouteProps, Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {RootState} from "../../containers";

const MapStateToProps = (state: RootState) => ({
    auth: state.auth
});
const AuthRoute: React.SFC<{
    component:  React.ComponentType<any>;
    exact?: boolean;
    isAuthNeeded?: boolean;
    path: string;
} & ReturnType<typeof MapStateToProps>> = ({ component: Component, exact, isAuthNeeded = true,  path, auth}) => (
    <Route
        exact={exact}
        path={path}
        render={(rProps) => {
            if(isAuthNeeded && auth.isSignIn) return <Component {...rProps}/>;
            else if(isAuthNeeded && ! auth.isSignIn) return <Redirect to={'/'} />;
            else if(!isAuthNeeded &&  auth.isSignIn) return <Redirect to={'/'} />;
            else return <Component {...rProps}/>
        }}
    />
);

export default connect(MapStateToProps,null)(AuthRoute);
