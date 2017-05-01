import client from 'exygen/client';

import routes from './routes';
import reducer from './reducer';

client({
  routes,
  reducer
}, mount => {
  if ( module.hot ) {
    module.hot.accept( './routes', () => {
      mount();
    });
  }
});
