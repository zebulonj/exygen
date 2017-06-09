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
  <PrimitiveRoute { ...route } render={ props => React.createElement( RouteNode, { fetch, match: props }, React.createElement( component, { ...props, fetch, routes }) ) } />
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
  ( dispatch, { fetch, match } ) => ({
    fetch: () => ( fetch ? dispatch( fetch( match ) ) : match )
  })
)( RouteNodeComponent );

RouteNode.propTypes = {
  fetch:  PropTypes.func
};
