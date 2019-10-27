import * as React from 'react';
import {  Response } from 'express';
import {Helmet} from "react-helmet";
import { RequestWithVerified } from '../';
import {ServerSideStore} from "../../containers/";
import template from "../template";
import Html from "../Html";
import {renderToString} from "react-dom/server";

//adapters
import { SSRActions } from '../../core/lib/adapters/redux/authEpics';
//entity
import User from '../../core/lib/entities/user';
const Render = (req: RequestWithVerified, res: Response) => {
    const context = {};
    const helmet = Helmet.renderStatic();
    const store = ServerSideStore();
    if(req.validated && req.verified === false) {
        req.url = `/confirm/${req.email}`;
    }
    if(req.validated) store.dispatch(SSRActions.SSR_SIGN_IN(new User({ name: req.name!, email: req.email!})));
    const App = template(store, req, context);
    const html = <Html authConfig={req.authConfig!} state={store.getState()} helmet={helmet} doms={renderToString(App)}/>;
    res.status(200);
    res.write(`<!doctype html>\n${renderToString(html)}`);
    res.end();
};
export default Render;