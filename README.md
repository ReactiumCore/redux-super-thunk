Redux Super Thunk
=================

Thunk [middleware](http://redux.js.org/docs/advanced/Middleware.html) for Redux that adds the store as an argument.

```js
npm install --save redux-super-thunk
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
