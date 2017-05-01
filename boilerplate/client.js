import Client from 'exygen/client';

import routes from './routes';
import reducer from './reducer';

Client({
  routes,
  reducer
}, mount => {
  if ( module.hot ) {
    module.hot.accept( './routes', () => {
      mount();
    });
  }
});
