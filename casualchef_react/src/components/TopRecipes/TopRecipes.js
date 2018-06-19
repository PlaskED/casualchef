import React, { Component } from "react";
import { Row, Card, CardTitle, CardPanel, Chip, Col } from 'react-materialize'
import { NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";
import Rating from "../Rating/Rating";
import axios from 'axios';

class TopRecipes extends Component {
    constructor(props) {
	super(props);
	this.state = { pending: false, error: null, done: false, recipes: [], index: 0};
    }

    componentDidMount() {
	this.setState({pending: true});
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/toprecipes/' + this.state.index,
	}).then(response => {
	    const newRecipes = response.data.data;
	    this.setState({ recipes: this.state.recipes.concat(newRecipes), pending: false, done: true });
	}).catch(err => {
	    this.setState({error: err});
	});
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
		<p className="text-error center">{error.message}</p>
	    )
	}
	if (done) {
	    return (
		<div>
		    {
			recipes.map(recipe => (
			    <div className="recipe" key={recipe.id}>
				<Card className='small' header={
				    <NavLink to={"/recipe/" + recipe.id}>
					<CardTitle image={recipe.picture_url}>
					    <CardPanel>
						<span className="black-text">{recipe.name}</span>
					    </CardPanel>
					</CardTitle>
				    </NavLink>
				} actions={[recipe.categories.map(category => (
				    <NavLink to={"/category/" + category.id}>
					<Chip className="light-blue lighten-1">{category.name}</Chip>
				    </NavLink>
				))]}>{recipe.description}
				</Card>
				<CardPanel>
				    <span>
					<Row>
					    <Col s={8}>
						<h5>Published by <div className="username">{recipe.author.name}</div></h5>
						    {recipe.published}
					    </Col>
						<Col s={4}><Rating rid={recipe.id} rating={recipe.rating} raters={recipe.raters}/></Col>
					</Row>
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

export default TopRecipes;
