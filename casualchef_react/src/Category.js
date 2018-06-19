import React, { Component } from "react";
import { Row } from 'react-materialize';
import CategoryRecipes from "./components/CategoryRecipes/CategoryRecipes";

class Category extends Component {
    render() {
	return (
	    <div className="center">
		<Row>
		    <CategoryRecipes cid={this.props.match.params.cid}/>
		</Row>
	    </div>
	)
    }
}

export default Category;
