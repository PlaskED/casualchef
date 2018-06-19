import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import reducerLogin from "./login";
import reducerRegister from "./register";
import reducerToken from "./token";


const rootPersistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['reducerLogin']
}

const loginPersistConfig = {
    key: 'reducerLogin',
    storage: storage,
    whitelist: ['token', 'user']
}

const rootReducer = combineReducers({
    reducerLogin: persistReducer(loginPersistConfig, reducerLogin),
    reducerRegister: reducerRegister,
    reducerToken: reducerToken,
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export { persistedReducer };
