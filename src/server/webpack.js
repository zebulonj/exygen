import middleware from 'webpack-dev-middleware';
import hot from 'webpack-hot-middleware';
import webpack from 'webpack';

const middlewareConfig = {
  publicPath: '/'
};

export const factory = ( webpackConfig ) => {
  const bundler = webpack( webpackConfig );

  return [
    middleware( bundler, middlewareConfig ),
    hot( bundler )
  ]
};

export default factory;
