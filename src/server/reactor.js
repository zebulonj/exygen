import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { StaticRouter, matchPath } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { App } from '../app';
import Document from './document';

const scripts = [
  '/bundle.js'
];

const middleware = [
  thunk
];

export function reactor( routes, reducer ) {
  return ( req, res ) => {
    const store = createStore( reducer, {}, applyMiddleware( ...middleware ) );

    // TODO: Pre-fetch data for matched route.
    const handlers = routes
      .map( route => ({ match: matchPath( req.url, route ), route }) )
      .filter( ({ match, route }) => !!match && route.fetch );

    const tasks = handlers.map( ({ match, route }) => store.dispatch( route.fetch( match ) ) );

    Promise.all( tasks )
      .then( () => {
        const state = store.getState();
        const context = {};
        const content = process.env.NODE_ENV === "production"
          ? ReactDOMServer.renderToString(
              <StaticRouter location={ req.url } context={ context }>
                <Provider store={ store }>
                  <App routes={ routes } />
                </Provider>
              </StaticRouter>
            )
          : '';

        // TODO: Handle redirects.
        res.send( "<!DOCTYPE html>\n" + ReactDOMServer.renderToStaticMarkup( React.createElement( Document, { content, state, scripts } ) ) );
      });
  }
}

export default reactor;