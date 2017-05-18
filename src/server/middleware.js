import express, { Router } from 'express';
import proxy from 'http-proxy-middleware';
import thunk from 'redux-thunk';

import webpack from './webpack';
import reactor from './reactor';

const defaultOptions = {
  webpackConfig: {},
  initialState: {},
  middleware: [
    thunk
  ]
};

export default function exygenMiddleware( options = {} ) {
  options = Object.assign({}, defaultOptions, options );

  const { routes, reducer, middleware, assets, initialState, webpackConfig } = options;

  const router = Router();

  if ( process.env.NODE_ENV !== "production" ) {
    const rules = ( ( webpackConfig.devServer || {} ).proxy || {} );
    Object.keys( rules ).map( path => router.use( path, proxy( rules[path] ) ) );

    router.use( webpack( webpackConfig ) );
  }

  if ( assets ) {
    router.use( express.static( assets ) );
  }

  router.use( loadState( initialState ), reactor( routes, reducer, middleware ) );

  return router;
}

function loadState( loader ) {
  return ( req, res, next ) => {
    req.initialState = ( typeof loader === 'function' ) ? loader( req ) : loader;
    next();
  }
}
