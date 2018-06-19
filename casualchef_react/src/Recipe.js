import React, { Component } from "react";
import { Row, Icon } from 'react-materialize'
import RecipeInfo from "./components/RecipeInfo/RecipeInfo";
import RecipeComments from "./components/RecipeComments/RecipeComments";

class Recipe extends Component {
    render() {
	const rid = this.props.match.params.rid;
	return (
	    <div className="center">
		<Row>
		    <RecipeInfo rid={rid}/>
		</Row>
		<Row>
		    <h4><Icon>message</Icon>Comments</h4>
		    <RecipeComments rid={rid}/>
		</Row>
	    </div>
	)
    }
}

export default Recipe;
