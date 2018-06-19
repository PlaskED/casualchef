import React, { Component } from "react";
import { Table } from 'react-materialize'

class IngredientList extends Component {
    constructor(props) {
	super(props); //Needs to be sliced in some way later
	this.state = { ingredients: [this.props.ingredients]};
    }
    
    render() {
	let { ingredients } = this.state;
	return (
	    <Table>
		<thead>
		    <tr>
			<th data-field="name">Ingredient List</th>
		    </tr>
		</thead>
		<tbody>
		    { 
			ingredients.map(ingredient => (
			    <tr className="ingredient">
				<td>{ingredient}</td>
			    </tr>
			))
		    }
		</tbody>
	    </Table>
	)
    }
}

export default IngredientList;
