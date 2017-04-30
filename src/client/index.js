import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { App } from '../app';

export const defaultMiddleware = [
  logger,
  thunk
];

const defaultOptions = {
  middleware: defaultMiddleware
};

function initialState() {
  try {
    const state = document.getElementById( 'state' );

    return state ? JSON.parse( state.innerHTML ) : {};
  }
  catch ( err ) {
    console.error( "Failed to initialize state.", err );
    return {};
  }
}

export function client( options, callback ) {
  options = Object.assign( {}, defaultOptions, options );

  const { routes, reducer, middleware } = options;

  const store = createStore( reducer, initialState(), applyMiddleware( ...middleware ) );

  function mount() {
    ReactDOM.render( React.createElement( Root, { routes, store }), document.getElementById( 'content' ) );
  }

  mount();

  callback && callback( mount );
}

export default client;

export const Root = ({ routes, store }) => (
  <BrowserRouter>
    <Provider store={ store }>
      <App routes={ routes } />
    </Provider>
  </BrowserRouter>
);

Root.propTypes = {
  routes: PropTypes.array,
  store:  PropTypes.any
};
