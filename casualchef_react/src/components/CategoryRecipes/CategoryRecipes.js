import React, { Component } from "react";
import { Card, CardTitle, CardPanel, Chip, Col } from 'react-materialize'
import { NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";
import axios from 'axios';

class CategoryRecipes extends Component {
    constructor(props) {
	super(props);
	this.state = this.initState();
    }

    componentDidMount() {
	this.fetchCategoryRecipes(this.props.cid, this.state.index);
    }

    componentWillReceiveProps(nextProps) {
	if (this.props.cid !== nextProps.cid) {
	    this.setState(this.initState());
	    this.fetchCategoryRecipes(nextProps.cid, 0);
	}
    }

    initState() {
	return { pending: false, error: null, done: false,
		 pendingMore: false, recipes: [], index: 0 };
    }

    fetchCategoryRecipes(cid, index) {
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/category/' + cid + '/' + index,
	}).then(response => {
	    const newRecipes = response.data.data;
	    this.setState({recipes: this.state.recipes.concat(newRecipes),
			   pending: false, pendingMore: false, done: true});
	    if (newRecipes.length !== 0) {
		this.setState({index: newRecipes[newRecipes.length-1].id});
	    }
	}).catch(err => {
	    this.setState({error: err});
	});
    }

    render() {
	let { recipes, pending, pendingMore, error, done } = this.state;
	if (pending) {
	    return (
		<Col offset="s5"><Loader/></Col>
	    )
	}
	if (error) {
	    return (
		<div>Error! {error.message}</div>
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
						<span className="black-text">{recipe.name}
						    (id: {recipe.id})
						</span>
					    </CardPanel>
					</CardTitle>
				    </NavLink>
				} actions={[recipe.categories.map(category => (
				    <NavLink to={'/category/' + category.id}>
					<Chip className="light-blue lighten-1">{category.name}</Chip>
				    </NavLink>
				))]}>{recipe.description}
				</Card>
				<blockquote>
				    Published by {recipe.author.name}
				    (id: {recipe.author.id}), {recipe.published}
				    <br/>
				    Rating: {recipe.rating} ({recipe.raters} users rated)
				</blockquote>
			    </div>
			))
		    }
		    { pendingMore && <Col offset="s5"><Loader/></Col> }
		</div>
	    )
	} else { return null; }
    }
}

export default CategoryRecipes;
