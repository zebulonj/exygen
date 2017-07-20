import express from 'express';
import proxy from 'http-proxy-middleware';
import webpack from './webpack';

import middleware from './middleware';

const NODE_ENV = process.env.NODE_ENV || 'development';

const defaultOptions = {
  webpackConfig: {},
  port: 8080
};

export function server( options = {} ) {
  options = Object.assign( {}, defaultOptions, options );

  console.log( "[exygen-server] Starting..." );

  const { webpackConfig } = options;
  const server = express();

  if ( NODE_ENV === 'development' ) {
    const rules = ( ( webpackConfig.devServer || {} ).proxy || {} );
    Object.keys( rules ).map( path => server.use( path, proxy( rules[path] ) ) );

    server.use( webpack( webpackConfig ) );
  }

  server.use( middleware( options ) );

  // Error logging.
  server.use ( ( err, req, res, next ) => {
    if ( res.state ) {
      console.log( "State:", res.state );
    }

    console.error( err );

    next( err );
  });

  server.listen( options.port, () => {
    console.log( `[exygen-server] Listening. (port=${ options.port })` );
  });
}

export { middleware };

export default server;
