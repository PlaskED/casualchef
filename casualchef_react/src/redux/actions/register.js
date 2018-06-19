import axios from "axios";

import { REGISTER_PENDING, REGISTER_SUCCESS, REGISTER_ERROR } from "./types"

function setRegisterPending(registerPending) {
    return {
	type: REGISTER_PENDING,
	registerPending
    };
}

function setRegisterSuccess(registerSuccess) {
    return {
	type: REGISTER_SUCCESS,
	registerSuccess
    };
}

function setRegisterError(registerError) {
    return {
	type: REGISTER_ERROR,
	registerError
    };
}

function callRegisterApi(username, password, email, repeat_password, cb) {
    setTimeout(() => {
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/register',
	    data: {
		'username': username,
		'password': password,
		'email': email,
		'repeat_password':repeat_password,
	    },
	}).then(function(response) {
	    return cb(response);
	}).catch(function(err) {
	    return cb(err);
	});
    }, 1000);
}

export function register(username, password, email, repeat_password) {
    return dispatch => {
	dispatch(setRegisterPending(true));
	dispatch(setRegisterSuccess(false));
	dispatch(setRegisterError(null));
	
	callRegisterApi(username, password, email, repeat_password, cb => {
	    dispatch(setRegisterPending(false));
	    
	    if (cb.status === 201) {
		dispatch(setRegisterSuccess(true));
	    } else {
		dispatch(setRegisterError(cb));
	    }
	});
    }
}

export function logoutRegisterState() {
    return dispatch => {
	dispatch(setRegisterPending(false));
	dispatch(setRegisterSuccess(false));
	dispatch(setRegisterError(null));
    }
}
