import * as React from 'react';
import * as express from 'express';
import * as cors from 'cors';
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';
import Html from './Html';
import template from './template';
import { ServerSideStore } from '../containers';
import { dispatchers } from '../containers/App';
import * as path from 'path';

const app = express();
app.use(cors());
app.use('/static', express.static(path.join(process.cwd(), 'dist')));
app.use(async (req, res) => {
    const context = {};
    const helmet = Helmet.renderStatic();
    const store = ServerSideStore();
    const App = template(store, req, context);
    const html = <Html state={store.getState()} helmet={helmet} doms={renderToString(App)}/>;
    res.status(200);
    res.write(`<!doctype html>\n${renderToString(html)}`);
    res.end();
});
app.listen(`${process.env.PORT}`, () => console.log('start server'));

export default app;