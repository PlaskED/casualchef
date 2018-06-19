import { createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistedReducer } from './reducers/index';

const middlewares = applyMiddleware(thunk, logger)
const store = createStore(persistedReducer, {}, middlewares)
const persistor = persistStore(store)

export { store, persistor }
