import express from 'express';

import middleware from './middleware';

const defaultOptions = {
  port: 8080
};

export function server( options = {} ) {
  options = Object.assign( {}, defaultOptions, options );

  console.log( "[exygen-server] Starting..." );

  const server = express();

  server.use( middleware( options ) );

  server.listen( options.port, () => {
    console.log( `[exygen-server] Listening. (port=${ options.port })` );
  });
}

export { middleware };

export default server;
