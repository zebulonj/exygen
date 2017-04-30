import express from 'express';

import webpack from './webpack';
import reactor from './reactor';

const defaultOptions = {
  port: 8080,
  webpackConfig: {},
  initialState: {}
};

function loadState( loader ) {
  return ( req, res, next ) => {
    req.initialState = ( typeof loader === 'function' ) ? loader( req ) : loader;
    next();
  }
}

export function server( options = {} ) {
  options = Object.assign( {}, defaultOptions, options );

  const { routes, reducer, assets, initialState } = options;

  console.log( "[exygen-server] Starting..." );

  const server = express();

  if ( process.env.NODE_ENV !== "production" ) {
    server.use( webpack( options.webpackConfig ) );
  }

  if ( assets ) {
    server.use( express.static( assets ) );
  }

  server.use( loadState( initialState ), reactor( routes, reducer ) );

  server.listen( options.port, () => {
    console.log( `[exygen-server] Listening. (port=${ options.port })` );
  });
}

export default server;
