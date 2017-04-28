import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

import { App } from '../app';

const defaultOptions = {
  middleware: [
    logger,
    thunk
  ]
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

  console.log( "Initial State:", initialState() );
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
