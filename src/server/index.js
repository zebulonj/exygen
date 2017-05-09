import express from 'express';
import proxy from 'http-proxy-middleware';
import thunk from 'redux-thunk';

import webpack from './webpack';
import reactor from './reactor';

const defaultOptions = {
  port: 8080,
  webpackConfig: {},
  initialState: {},
  middleware: [
    thunk
  ]
};

function loadState( loader ) {
  return ( req, res, next ) => {
    req.initialState = ( typeof loader === 'function' ) ? loader( req ) : loader;
    next();
  }
}

export function server( options = {} ) {
  options = Object.assign( {}, defaultOptions, options );

  const { routes, reducer, middleware, assets, initialState, webpackConfig } = options;

  console.log( "[exygen-server] Starting..." );

  const server = express();

  if ( process.env.NODE_ENV !== "production" ) {
    const rules = ( ( webpackConfig.devServer || {} ).proxy || {} );
    Object.keys( rules ).map( path => server.use( path, proxy( rules[path] ) ) );

    server.use( webpack( webpackConfig ) );
  }

  if ( assets ) {
    server.use( express.static( assets ) );
  }

  server.use( loadState( initialState ), reactor( routes, reducer, middleware ) );

  server.listen( options.port, () => {
    console.log( `[exygen-server] Listening. (port=${ options.port })` );
  });
}

export default server;
