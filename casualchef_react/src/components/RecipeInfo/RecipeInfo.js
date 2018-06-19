import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Card, CardPanel, CardTitle, Chip, Row, Col } from "react-materialize";
import Loader from "../Loader/Loader";
import Rating from "../Rating/Rating";
import IngredientList from "../IngredientList/IngredientList";
import { connect } from "react-redux";
import axios from 'axios'

class RecipeInfo extends Component {
    constructor(props) {
	super(props);
	this.state = { pending: false, error: null, done: false, recipe: null };
    }

    componentDidMount() {
	this.fetchRecipeInfo(this.props.rid);
    }
    
    componentWillReceiveProps(nextProps) {
	if (this.props.rid !== nextProps.rid) {
	    alert("called!");
	    this.setState(this.initState());
	    this.fetchRecipeInfo(nextProps.rid);
	}
    }

    initState() {
	return { pending: false, error: null, done: false, recipe: null };
    }

    fetchRecipeInfo(rid) {
	this.setState({pending: true});
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/recipe/' + rid,
	}).then(response => {
	    this.setState({ recipe: response.data.data, pending: false, done: true });
	}).catch(err => {
	    this.setState({error: err});
	});
    }

    render() {
	let { recipe, pending, error, done } = this.state;
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
		    <Card className="medium" header={
			<CardTitle image={recipe.picture_url}>
			    <CardPanel><span className="black-text">{recipe.name}</span></CardPanel>
			</CardTitle>
		    } actions={[recipe.categories.map(category => (
			<NavLink to={"/category/" + category.id}>
			    <Chip>{category.name}</Chip>
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
			    <Row>
				<IngredientList ingredients={recipe.ingredients} />
				{recipe.guide}
			    </Row>
			</span>
		    </CardPanel>
		</div>
	    )
	} else { return null; }
    }
}

const mapStateToProps = (state) => {
    return {
	token: state.reducerLogin.token,
    };
}

export default connect(mapStateToProps, null)(RecipeInfo);
