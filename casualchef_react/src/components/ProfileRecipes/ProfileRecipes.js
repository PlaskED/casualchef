import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, CardPanel } from "react-materialize";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import axios from 'axios';

class ProfileRecipes extends Component {
    constructor(props) {
	super(props);
	this.state = { pending: false, error: null, done: false, recipes: [], index: 0 };
    }

    componentDidMount() {
	this.setState({pending: true});
	setTimeout(() => {
	    axios({
		method:'get',
		url: 'http://localhost:5000/api/profile/recipes/' + this.state.index,
		auth: {
		    username: this.props.token,
		    password: 'unused'
		},
	    }).then(response => {
		const newRecipes = response.data.data;
		this.setState({ recipes: this.state.recipes.concat(newRecipes), pending: false, done: true });
		if (newRecipes.length !== 0) {
		    this.setState({index: newRecipes[newRecipes.length-1].id});
		}
	    }).catch(err => {
		this.setState({error: err});
	    })
	}, 2000);
    }

    render() {
	let { recipes, pending, error, done } = this.state;

	if (pending) {
	    return (
		<Row><Loader/></Row>
	    )
	}
	if (error) {
	    return (
		<p classname="text-error center">{error.message}</p>
	    )
	}
	if (done) {
	    return (
		<div>
		    {
			recipes.map(recipe => (
			    <div className="recipe" key={recipe.id}>	
				<CardPanel>
				    <span className="black-text bold">
					You created the recipe&nbsp;
					<NavLink to={"/recipe/" + recipe.id}>
					    {recipe.name}
					</NavLink>
					<br/>
					Published: {recipe.published}
					<br/>
					Rating: {recipe.rating} 
					({recipe.raters} users rated)
				    </span>
				</CardPanel>
			    </div>	    
			))
		    }
		</div>
	    )
	} else { return null; }
    }
}

const mapStateToProps = (state) => {
    return {
	token: state.reducerLogin.token
    };
}

export default connect(mapStateToProps, null)(ProfileRecipes);
