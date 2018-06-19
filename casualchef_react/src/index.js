import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import Main from "./Main";
import Loader from "./components/Loader/Loader";
import { PersistGate } from 'redux-persist/integration/react';

// eslint-disable-next-line import/no-webpack-loader-syntax
import 'materialize-loader!./scss/materialize.config.js';


ReactDOM.render(
    <Provider store={store}>
	<PersistGate loading={<Loader/>} persistor={persistor}>
	    <Main/>
	</PersistGate>
    </Provider>,
    document.getElementById("root")
);
