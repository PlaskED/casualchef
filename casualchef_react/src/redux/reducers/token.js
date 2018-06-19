import { TOKEN_PENDING, TOKEN_SUCCESS, TOKEN_ERROR } from "../actions/types"

export default function reducerToken(state = {
    tokenPending: false,
    tokenSuccess: false,
    tokenError: false, 
}, action) {
    switch (action.type) {
	case TOKEN_PENDING:
	    return {
		...state,
		tokenPending: action.tokenPending
	    };
	case TOKEN_SUCCESS:
	    return {
		...state,
		tokenSuccess: action.tokenSuccess
	    };
	case TOKEN_ERROR:
	    return {
		...state,
		tokenError: action.tokenError
	    };
	default:
	    return state;
    }
}
