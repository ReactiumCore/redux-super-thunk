function createThunkMiddleware(extraArgument) {
    return (store) => next => action => {
        if (typeof action === 'function') {
            return action(store.dispatch, store.getState, store, extraArgument);
        }

        return next(action);
    };
}

const thunk = createThunkMiddleware();
thunk.withExtraArgument = createThunkMiddleware;

export default thunk;