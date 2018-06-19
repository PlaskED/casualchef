import axios from "axios";

import { LOGIN_PENDING, LOGIN_SUCCESS, LOGIN_ERROR, SET_TOKEN, SET_USER } from "./types"

function setLoginPending(loginPending) {
    return {
	type: LOGIN_PENDING,
	loginPending
    };
}

function setLoginSuccess(loginSuccess) {
    return {
	type: LOGIN_SUCCESS,
	loginSuccess
    };
}

function setLoginError(loginError) {
    return {
	type: LOGIN_ERROR,
	loginError
    };
}

function setToken(token) {
    return {
	type: SET_TOKEN,
	token
    }
}

function setUser(user) {
    return {
	type: SET_USER,
	user
    }
}

function callLoginApi(username, password) {
    return axios({
	method:'get',
	url: 'http://localhost:5000/api/token/get',
	auth: {
	    username: username,
	    password: password,
	},
    });
}

function callGetUserApi(username, password) {
    return axios({
	method:'get',
	url: 'http://localhost:5000/api/profile/user',
	auth: {
	    username: username,
	    password: password,
	},
    });
}

export function login(username, password) {
    return dispatch => {
	dispatch(setLoginPending(true));
	dispatch(setLoginSuccess(false));
	dispatch(setLoginError(null));

	axios.all([callLoginApi(username, password),
		   callGetUserApi(username, password)])
	     .then(axios.spread(function (cb_login, cb_user) {
		 dispatch(setLoginPending(false));
		 dispatch(setToken(cb_login.data.data.token));
		 dispatch(setUser(cb_user.data.data));
		 dispatch(setLoginSuccess(true));
	     }))
	     .catch((err) => {
		 dispatch(setLoginPending(false));
		 dispatch(setLoginError(err));
	     });
    }
}

export function logoutLoginState() {
    return dispatch => {
	dispatch(setLoginPending(false));
	dispatch(setLoginSuccess(false));
	dispatch(setLoginError(null));
	dispatch(setToken(null));
	dispatch(setUser(null));
    }
}
