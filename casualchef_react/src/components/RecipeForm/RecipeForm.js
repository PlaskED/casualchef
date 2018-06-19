import React, { Component } from "react";
import { Input, Row, Col, Button, Divider, Icon } from 'react-materialize'
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Loader from "../Loader/Loader";
import axios from 'axios'

import Select from 'react-select';
import 'react-select/dist/react-select.css';

class RecipeForm extends Component {
    constructor(props) {
	super(props);
	this.state = { 
	    name: '',
	    description: '',
	    ingredients: [{name: '', amount: '', unit: ''}],
	    guide: '',
	    picture_url: '',
	    categories: [{name:''}],
	    pending: false,
	    error: null,
	    success: false,
	    input_error: false,
	    recipe: null,
	};
	this.onSubmit = this.onSubmit.bind(this);
	this.ingredientNameChanges = this.ingredientNameChanges.bind(this);
	this.ingredientAmounthanges = this.ingredientAmountChanges.bind(this);
	this.ingredientUnitChanges = this.ingredientUnitChanges.bind(this);
	this.addIngredient = this.addIngredient.bind(this);
	this.removeIngredient = this.removeIngredient.bind(this);
	this.addCategory = this.addCategory.bind(this);
	this.removeCategory = this.removeCategory.bind(this);
    }
    
    ingredientNameChanges(e, id) {
	let newIngredients = [ ...this.state.ingredients ];
	newIngredients[id] = { ...newIngredients[id], name: e.target.value };
	this.setState({ingredients: newIngredients});
    }
    
    ingredientAmountChanges(e, id) {
	let newIngredients = [ ...this.state.ingredients ];
	newIngredients[id] = { ...newIngredients[id], amount: e.target.value };
	this.setState({ingredients: newIngredients});
    }
    
    ingredientUnitChanges(e, id) {
	let newIngredients = [ ...this.state.ingredients ];
	newIngredients[id] = { ...newIngredients[id], unit: e.value };
	this.setState({ingredients: newIngredients});
    }

    categoryChanges(e, id) {
	let newCategories = [ ...this.state.categories ];
	newCategories[id] = { ...newCategories[id], name: e.target.value };
	this.setState({categories: newCategories});
    }

    addIngredient(e) {
	e.preventDefault();
	this.setState({
	    ingredients: this.state.ingredients.concat([{name: '', amount: '', unit: ''}])
	});
    }

    addCategory(e) {
	e.preventDefault(e);
	this.setState({
	    categories: this.state.categories.concat([{name:''}])
	});
    }

    removeIngredient(e, id) {
	e.preventDefault();
	this.setState({
	    ingredients: this.state.ingredients.filter((_, i) => i !== id)
	});
    }

    removeCategory(e, id) {
	e.preventDefault();
	this.setState({
	    categories: this.state.categories.filter((_, i) => i !== id)
	});
    }
    
    postRecipe(recipe) {
	this.setState({pending: true});
	let { token } = this.props;
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/create/recipe',
	    auth: {
		username: token,
		password: 'unused'
	    },
	    data: recipe,
	}).then(response => {
	    //This is a hack, better to use the data receive from response as props to the Recipe component.
	    const newRecipe = response.data.data;
	    this.setState({ recipe: newRecipe, pending: false, success: true });
	}).catch(err => {
	    this.setState({error: err});
	});
    }
    
    onSubmit(e) {
	e.preventDefault();
	let { name, description, ingredients,
	      guide, picture_url, categories } = this.state;

	//Do some basic input checking here TODO
	const newCategories = categories.map((category) => category.name);
	const recipe = {
	    name: name,
	    description: description,
	    ingredients: ingredients,
	    guide: guide,
	    picture_url: picture_url,
	    categories: newCategories,
	}

	this.postRecipe(recipe);
    }
    
    render() {
	let { name, description, ingredients, guide, picture_url,
	      categories, pending, error, success, input_error, recipe } = this.state;
	let { user } = this.props;
	
	if (user) {
	    return (
		<form name="recipe-form" onSubmit={this.onSubmit}>
		    <div className="center">
			<Row>
			    <Col offset="s2" s={8}>
				<h4>Tell us about your recipe!</h4>
				<Divider/>
				<Input s={12} label="recipe name" 
				onChange={e => this.setState({
					name: e.target.value
				})} value={name}/>
				
				<Input s={12} label="description" type="textarea"
				       onChange={e => this.setState({
					       description: e.target.value
				       })} value={description}/>

				<h5>Ingredients</h5>
				<Divider/>
			    </Col>
			</Row>
			{
			    ingredients.map((ingredient, id) => (
				<Row>
				    <Col offset="s2" s={8}>
					<Input s={4} label={"Ingredient " + (id+1) + " Name"}
					       onChange={e => this.ingredientNameChanges(e, id)}
					       value={ingredient.name}/>
					<Input s={3} label="Amount" 
					       onChange={e => this.ingredientAmountChanges(e, id)}
					       value={ingredient.amount}/>
					<Col s={4}>
					    <br/>
					    <Select
						name="form-field-name"
						value={ingredient.unit}
					    onChange={e => this.ingredientUnitChanges(e, id)}
						clearable={false}
					    options={[
						{ value: '', label: 'Unit' },
						{ value: 'krm', label: 'krm' },
						{ value: 'tsk', label: 'tsk' },
						{ value: 'msk', label: 'msk' },
						{ value: 'dl', label: 'dl' },
						{ value: 'l', label: 'l' },
						{ value: 'g', label: 'g' },
						{ value: 'kg', label: 'kg' }
					    ]}
					    />
					</Col>
					<Col className="right" s={1}>
					    <br/>
					    <Button floating className="color3" type="button" icon="remove"
						    onClick={e => this.removeIngredient(e, id) } waves='light'>
					    </Button>
					</Col>
					
				    </Col>
				</Row>
			    ))
			}
			<Row>
			    <Col offset="s2" s={8}>
				<br/>
				<Col s={12}>
				    <Button floating className="color1 right" type="button"
					    onClick={e => this.addIngredient(e)} waves='light' icon="add">
				    </Button>
				</Col>
				
				
				<Input s={12} label="guide" type="textarea"
				       onChange={e => this.setState({
					       guide: e.target.value
				       })} value={guide}/>
				
				<Input s={12} label="picture_url" 
				       onChange={e => this.setState({
					       picture_url: e.target.value
				       })} value={picture_url}/>

				
				<h5>Categories</h5>
				<Divider/>
			    </Col>
			</Row>
			<Row>
			    <Col offset="s2" s={8}>
				{
				 
				    categories.map((category, id) => (
					<div>
					<Input s={5} label={"Category " + (id+1) }
					       onChange={e => this.categoryChanges(e, id)}
					       value={category.name}/>
					<Col s={1}>
					    <br/>
					    <Button floating className="color3" type="button" icon="remove"
						    onClick={e => this.removeCategory(e, id)} waves='light'>
					    </Button>
					</Col>
					</div>
				    ))
				}
			    </Col>
			</Row>
			<br/>
			<Row>
			    <Col offset="s2" s={8}>
				<Col s={12}>
				    <Button floating className="color1 right" type="button"
					onClick={this.addCategory} waves='light' icon="add">
				    </Button>
				</Col>
			    </Col>
			</Row>
			<Row/>
			<Row>
			    <Button className="color2" type="submit" waves='light' icon="send">Post</Button>
			</Row>
			
			<Row>
			    { input_error && <p className="text-error center">
				{input_error}<Icon>error</Icon></p> }
			    { pending && <Loader/> }
			</Row>
			{ pending && <p className="center">Please wait...</p> }
			{ success && <p className="center">Success.
			    <Redirect to={"/recipe/"+recipe.id}/></p> }
			{ error && <p className="text-error center">
			    {error.message}<Icon>error</Icon></p> }
			<br/>
		    </div>
		</form>	    
	    )
	} else { return <Redirect to="/login" /> }
    }
}


const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user,
	token: state.reducerLogin.token,
    };
}

export default connect(mapStateToProps, null)(RecipeForm);
