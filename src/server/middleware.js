import express, { Router } from 'express';
import thunk from 'redux-thunk';

import reactor from './reactor';

const defaultOptions = {
  initialState: {},
  middleware: [
    thunk
  ],
  scripts: [
    '/bundle.js'
  ]
};

export default function exygenMiddleware( options = {} ) {
  options = Object.assign({}, defaultOptions, options );

  const { Wrapper, routes, reducer, middleware, assets, initialState, scripts } = options;

  const router = Router();

  if ( assets ) {
    router.use( express.static( assets ) );
  }

  router.use( loadState( initialState ), reactor( Wrapper, routes, reducer, middleware, scripts ) );

  return router;
}

function loadState( loader ) {
  return ( req, res, next ) => {
    req.initialState = ( typeof loader === 'function' ) ? loader( req ) : loader;
    next();
  }
}
