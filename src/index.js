import { compose } from 'redux';

/**
 * @see redux applyMiddleware
 *
 * This enhancer takes the place of the vanilla applyMiddleware from redux,
 * specifically to get back the power of the store when used with thunk.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
export const applyMiddleware = (...middlewares) => {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        `Dispatching while constructing your middleware is not allowed. ` +
          `Other middleware would not be applied to this dispatch.`
      )
    }
    let chain = []

    const middlewareAPI = {
      ...store,
      dispatch: (...args) => dispatch(...args)
    }
    chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
};

function createThunkMiddleware(extraArgument) {
    return (store) => next => action => {
        if (typeof action === 'function') {
            if (typeof extraArgument !== 'undefined') {
              return action(store.dispatch, store.getState, extraArgument, store);
            } else {
              return action(store.dispatch, store.getState, store);
            }
        }

        return next(action);
    };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;
