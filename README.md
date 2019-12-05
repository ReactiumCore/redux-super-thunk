Redux Super Thunk
=================

[![Greenkeeper badge](https://badges.greenkeeper.io/Atomic-Reactor/redux-super-thunk.svg)](https://greenkeeper.io/)

Thunk [middleware](http://redux.js.org/docs/advanced/Middleware.html) for Redux that adds the store as an argument.

```bash
npm install --save redux-super-thunk
```

# Apply Middleware

To use redux super thunk, you will need to use the super thunk version of the `applyMiddleware` enhancer, instead of the out of the box version from the redux library.

```js
import { createStore, combineReducers } from 'redux'
import thunk, { applyMiddleware } from 'redux-super-thunk';
import * as reducers from './reducers'

let reducer = combineReducers(reducers)

// using super thunk applyMiddleware instead of
// the one from redux library
let store = createStore(reducer, applyMiddleware(thunk))
```


# Why Redux Super Thunk?
Redux Super Thunk is a super-set of what is provided by [Redux Thunk](https://github.com/gaearon/redux-thunk). Redux Thunk supplies the redux store's `dispatch` and `getState` methods to a higher-order action creator (as well as an addition argument of your choosing).

While thunk is a powerful too for being able to create almost any manner of asynchronous actions, it would be so much more powerful to supply the `store` as well, making it possible to subscribe to a store inside of a higher order action creator. This is where Super Thunk comes in.

```js
import axios from 'axios';

export default {
    subscribe: params => (dispatch, getState, store) => {
        let unsubscribe = store.subscribe(() => {
            let ival = setInterval(() => {
                let state = getState()['subscription'];
                if ( state === 'on' ) {
                     axios.get('http://someapi/my-data').then((result) => {
                        dispatch({ type: 'MY_UPDATE', result: result});                
                    });
                }
                else {
                    clearInterval(ival);
                    unsubscribe();
                }
            }, 8000);
        });
    },

    unsubscribe: () => ({type: 'UNSUBSCRIBE'}),
};
```

## Super Thunk with extra argument

For redux thunk users that are currently using an extra argument when adding thunk as middleware, you can still do this, and the store becomes a fourth argument for your thunk action creator.

Setup with extra argument:
```js
import { createStore, combineReducers } from 'redux'
import thunk, { applyMiddleware } from 'redux-super-thunk';
import * as reducers from './reducers'
import axios from 'axios';

let reducer = combineReducers(reducers)

const api = axios.create({ baseUrl: 'http://someapi' });
let store = createStore(reducer, applyMiddleware(thunk.withExtraArgument(api)))
```

Your thunk will now be:
```js
export default {
    subscribe: params => (dispatch, getState, api, store) => {
        let unsubscribe = store.subscribe(() => {
            let ival = setInterval(() => {
                let state = getState()['subscription'];
                if ( state === 'on' ) {
                     api.get('/my-data').then((result) => {
                        dispatch({ type: 'MY_UPDATE', result: result});                
                    });
                }
                else {
                    clearInterval(ival);
                    unsubscribe();
                }
            }, 8000);
        });
    },

    unsubscribe: () => ({type: 'UNSUBSCRIBE'}),
};
```

**_For more information on thunks go [here](https://github.com/gaearon/redux-thunk)_
