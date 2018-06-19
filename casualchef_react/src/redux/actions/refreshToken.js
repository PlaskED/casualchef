import axios from "axios";

import { TOKEN_PENDING, TOKEN_SUCCESS, TOKEN_ERROR, SET_TOKEN } from "./types"
import { logoutLoginState } from './login'

function setTokenPending(tokenPending) {
    return {
	type: TOKEN_PENDING,
	tokenPending
    };
}

function setTokenSuccess(tokenSuccess) {
    return {
	type: TOKEN_SUCCESS,
	tokenSuccess
    };
}

function setTokenError(tokenError) {
    return {
	type: TOKEN_ERROR,
	tokenError
    };
}

function setToken(token) {
    return {
	type: SET_TOKEN,
	token
    }
}

function callRefreshTokenApi(token, cb) {
    setTimeout(() => {
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/token/refresh',
	    data: {
		'token': token,
	    },
	}).then(function(response) {
	    return cb(response);
	}).catch(function(err) {
	    return cb(err);
	});
    }, 1000);
}

export function silentRefreshToken(token) {
    return dispatch => {
	callRefreshTokenApi(token, cb => {  
	    if (cb.status === 200) {
		dispatch(setToken(cb.data.data.token));
	    }
	});
    }
}

export function refreshToken(token) {
    return dispatch => {
	dispatch(setTokenPending(true));
	dispatch(setTokenSuccess(false));
	dispatch(setTokenError(null));
	
	callRefreshTokenApi(token, cb => {
	    dispatch(setTokenPending(false));
	    
	    if (cb.status === 200) {
		dispatch(setToken(cb.data.data.token));
		dispatch(setTokenSuccess(true));
	    } else {
		dispatch(logoutLoginState());
		dispatch(setTokenError(cb));
	    }
	});
    }
}
