import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { StaticRouter, matchPath } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';

import { App } from '../app';
import Document from './document';

export function reactor( Wrapper, routes, reducer, middleware, scripts, stylesheets ) {
  return ( req, res, next ) => {
    const store = createStore( reducer, req.initialState, applyMiddleware( ...( ( typeof middleware === 'function' ) ? middleware( req ) : middleware ) ) );

    // TODO: Pre-fetch data for matched route.
    const handlers = routes
      .map( route => ({ match: matchPath( req.url, route ), route }) )
      .filter( ({ match, route }) => !!match && route.fetch );

    const tasks = handlers.map( ({ match, route }) => store.dispatch( route.fetch({ match }) ) );

    Promise.all( tasks )
      .then( () => {
        const state = store.getState();

        // Expose state object for debugging.
        res.state = state;

        const context = {};
        const content = ReactDOMServer.renderToString(
          <StaticRouter location={ req.url } context={ context }>
            <Provider store={ store }>
              <App Wrapper={ Wrapper } routes={ routes } />
            </Provider>
          </StaticRouter>
        );

        if ( context.url ) {
          res.redirect( context.url );
        }
        else {
          res.send( "<!DOCTYPE html>\n" + ReactDOMServer.renderToStaticMarkup( React.createElement( Document, { content: process.env.NODE_ENV === "production" ? content : '', state, scripts, stylesheets } ) ) );
        }
      })
      .catch(
        err => next( err )  // TODO: Better error handling (how to gracefully support error handling without prescribing application structure).
      );
  }
}

export default reactor;
