Redux Super Thunk
=================

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
[Thunk](https://github.com/gaearon/redux-thunk) supplies the `dispatch` and `getState` arguments and provides the ability to add extra arguments via the `thunk.withExtraArgument` function.
While this is great, it would be so much more powerful to supply the `store` as well, making it possible to subscribe to a store inside of an action.

```js
import axios from 'axios';

export default {
    subscribe: params => (dispatch, getState, store) => {
        let unsubscribe = store.subscribe(() => {
            let ival = setInterval(() => {
                let state = getState()['subscription'];
                if ( state === 'on' ) {
                     axios.get('http://someapi/route').then((result) => {
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
