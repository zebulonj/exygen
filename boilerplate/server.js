import path from 'path';
import server from 'exygen/server';

import webpackConfig from '../webpack.config';

import routes from './routes';
import reducer from './reducer';

server({
  routes,
  reducer,
  assets: path.resolve( __dirname, './public' ),
  webpackConfig
});
