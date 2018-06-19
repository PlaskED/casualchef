import { REGISTER_PENDING, REGISTER_SUCCESS, REGISTER_ERROR } from "../actions/types"

export default function reducerRegister(state = {
    registerPending: false,
    registerSuccess: false,
    registerError: null, 
}, action) {
    switch (action.type) {
	case REGISTER_SUCCESS:
	    return {
		...state,
		registerSuccess: action.registerSuccess
	    };
	case REGISTER_PENDING:
	    return {
		...state,
		registerPending: action.registerPending
	    };
	case REGISTER_ERROR:
	    return {
		...state,
		registerError: action.registerError
	    };
	default:
	    return state;
    }
}
