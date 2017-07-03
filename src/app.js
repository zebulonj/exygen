import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route as PrimitiveRoute } from 'react-router-dom';
import { connect } from 'react-redux';

export const DefaultWrapper = ({ children }) => (
  <div className="app-wrapper">
    { children }
  </div>
);

export const App = ({ Wrapper, routes }) => (
  <Wrapper>
    { routes.map( ( route, i ) => ( <Route key={ i } { ...route } /> ) ) }
  </Wrapper>
);

App.propTypes = {
  Wrapper:  PropTypes.any.isRequired,
  routes: PropTypes.array
};

App.defaultProps = {
  Wrapper: DefaultWrapper
};

export const NullComponent = () => (
  null
);

/**
 * Expands on the standard `Route` by exposing child routes via props.
 */
export const Route = ({ component, fetch, routes, ...route }) => (
  <PrimitiveRoute { ...route } render={ routeProps => React.createElement( RouteNode, { fetch, routeProps }, React.createElement( component, { ...routeProps, fetch, routes }) ) } />
);

Route.propTypes = {
  component:  PropTypes.any.isRequired,
  fetch:      PropTypes.func,
  routes:     PropTypes.array
};

Route.defaultProps = {
  component:  NullComponent
};

export class RouteNodeComponent extends Component {
  static propTypes = {
    fetch:  PropTypes.func.isRequired
  }

  render() {
    return this.props.children;
  }

  componentDidMount() {
    this.props.fetch();
  }
}

export const RouteNode = connect(
  () => ({}),
  ( dispatch, { fetch, routeProps } ) => ({
    fetch: () => ( fetch ? dispatch( fetch( routeProps ) ) : routeProps )
  })
)( RouteNodeComponent );

RouteNode.propTypes = {
  fetch:  PropTypes.func
};
