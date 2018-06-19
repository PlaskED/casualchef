import axios from "axios";

import { TOP_RECIPES_PENDING, TOP_RECIPES_SUCCESS, 
	 TOP_RECIPES_ERROR, SET_TOP_RECIPES } from "./types"

function setTopRecipesPending(topRecipesPending) {
    return {
	type: TOP_RECIPES_PENDING,
	topRecipesPending
    };
}

function setTopRecipesSuccess(topRecipesSuccess) {
    return {
	type: TOP_RECIPES_SUCCESS,
	topRecipesSuccess
    };
}

function setTopRecipesError(topRecipesError) {
    return {
	type: TOP_RECIPES_ERROR,
	topRecipesError
    };
}

function setTopRecipes(topRecipes) {
    return {
	type: SET_TOP_RECIPES,
	topRecipes
    };
}

function callGetTopRecipesApi(cb) {
    setTimeout(() => {
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/toprecipes',
	}).then(function(response) {
	    return cb(response);
	}).catch(function(err) {
	    return cb(err);
	});
    }, 1000);
}


export function getTopRecipes() {
    return dispatch => {
	dispatch(setTopRecipesPending(true));
	dispatch(setTopRecipesSuccess(false));
	dispatch(setTopRecipesError(null));
	dispatch(setTopRecipes([]));
	callGetTopRecipesApi(cb => {	    
	    if (cb.status === 200) {
		dispatch(setTopRecipes(cb.data.data));
		dispatch(setTopRecipesPending(false));
		dispatch(setTopRecipesSuccess(true));
	    } else {
		dispatch(setTopRecipesError(cb));
	    }
	});
    }
}
