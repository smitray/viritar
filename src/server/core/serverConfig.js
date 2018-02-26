import convert from 'koa-convert';
import cors from 'kcors';
import bodyParser from 'koa-body';
import session from 'koa-session';
import helmet from 'koa-helmet';
import config from 'config';

import { cModules, cIoModules, cMiddleware } from '../app';
import { catchErr, statusMessage } from './errorConfig';
import nuxtConfig from './nuxtConfig';

function baseConfig(app, io) {
  app.keys = config.get('secret');
  app.proxy = true;

  nuxtConfig(app);

  app.use(convert.compose(
    catchErr,
    cors({
      credentials: true,
      origin: true
    }),
    bodyParser({
      multipart: true
    }),
    session({
      maxAge: Math.floor(Date.now() / 1000) + 21599
    }, app),
    helmet(),
    statusMessage
  ));

  cModules(app, io);
  cIoModules(app);
  app.use(cMiddleware());
}

export default baseConfig;
