# Exygen
Not so much a framework, closer to boilerplate... but maintained and bundled with useful connectors. An out-of-box (and slightly opinionated) foundation for building "universal" React/Redux applications.

## Install

```shell
npm install --save exygen
```

## Quickstart
The guiding principal behind Exygen is to reduce boilerplate (and boilerplate maintenance), without getting in the way of your use of the core libraries it bundles (`react`, `redux`, `react-router`,...). At its most basic, Exygen cares about just two things: your routes and your root reducer.

**routes.js**
```js
import { Dashboard } from './pages';

export const routes = [
  {
    path: '/',
    exact: true,
    component: Dashboard
  }
];

export default routes;

```

**reducer.js**
```js
import { combineReducers } from 'redux';

import { todos } from './modules/todos/reducer';

export default combineReducers({
  todos
});

```

Pass those into the entry points for client and server, and... voila!

**server.js**
```js
import path from 'path';
import server from 'exygen/server';

import routes from './routes';
import reducer from './reducer';

server({
  routes,
  reducer,
  assets: path.resolve( __dirname, './public' )
});
```

**client.js**
```js
import client from 'exygen/client';

import routes from './routes';
import reducer from './reducer';

client({
  routes,
  reducer
});

```

_This is an **incomplete setup**, but it gives you a good sense of the flavor of Exygen._

## Features

### Route Actions

"Route Actions" are actions that are dispatched to the Redux store when a route matches. Their most important use is pre-fetching data based on routes, for server-side rendering. They are managed by the `Exygen` connectors, and fire on both server and client.

**routes.js**
```js
import { Dashboard, TodoList } from './pages';
import { fetchList } from './actions';

export const routes = [
  {
    path: '/',
    exact: true,
    component: Dashboard
  },
  {
    path: '/list/:listId',
    component: TodoList,
    fetch: ({ params }) => fetchList( params.listId )
  }
];

export default routes;

```

**actions.js**
```js
export const fetchList = ( listId ) => {
  return dispatch => {
    dispatch({ type: 'LIST_REQUESTED', listId });

    return fetch( `/api/lists/${ listId }` )
      .then(
        res => dispatch({ type: 'LIST_RECEIVED', list: res }),
        err => dispatch({ type: 'LIST_ERROR' })
      );
  }
}
```

### Boilerplate

This project isn't simply boilerplate, but it does offer a quick starting point for your project.

```shell
npm install -g exygen
exygen init
```

`Exygen` will install a minimal project template (directory structure and essential files) into the current working directory.
