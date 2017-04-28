import express from 'express';

import webpack from './webpack';
import reactor from './reactor';

const defaultOptions = {
  port: 8080,
  webpackConfig: {}
};

export function server( options = {} ) {
  options = Object.assign( {}, defaultOptions, options );

  const { routes, reducer, assets } = options;

  console.log( "[oxygen-server] Starting..." );

  const server = express();

  if ( process.env.NODE_ENV !== "production" ) {
    server.use( webpack( options.webpackConfig ) );
  }

  if ( assets ) {
    server.use( express.static( assets ) );
  }

  server.use( reactor( routes, reducer ) );

  server.listen( options.port, () => {
    console.log( `[oxygen-server] Listening. (port=${ options.port })` );
  });
}

export default server;
