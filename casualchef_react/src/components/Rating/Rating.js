import React, { Component } from "react";
import ReactStars from 'react-stars';
import { connect } from "react-redux";
import axios from 'axios';


class Rating extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    rid: this.props.rid,
	    rating: this.props.rating,
	    raters: this.props.raters,
	    pending: false,
	    error: false,
	    success: false,
	    avgRating: this.roundedToFixed(this.props.rating/this.props.raters, 1)
	}
	this.ratingChanged = this.ratingChanged.bind(this);
    }

    roundedToFixed(_float, _digits){
	var rounder = Math.pow(10, _digits);
	return (Math.round(_float * rounder) / rounder).toFixed(_digits);
    }
    
    ratingChanged(newRating) {
	let { pending } = this.state;
	if (!pending) {
	    this.rateRecipe(newRating);
	}
    }

    rateRecipe(rating) {
	this.setState({pending: true});
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/rate/recipe',
	    auth: {
		username: this.props.token,
		password: 'unused'
	    },
	    data: {
		recipe: this.state.rid,
		rating: rating,
	    },
	}).then(response => {
	    const resRating = response.data.data;
	    const currRating = this.state.rating;
	    if (resRating.old_rating === -1) {
		const newRating = currRating + resRating.rating;
		const newRaters = this.state.raters + 1;
		const newAvg = this.roundedToFixed(newRating/newRaters, 1)
		this.setState({rating: newRating, raters: newRaters,
			       avgRating: newAvg, pending: false, success: true});
	    } else {
		const newRating = currRating - resRating.old_rating + resRating.rating;
		const newAvg = this.roundedToFixed(newRating/this.state.raters, 1)
		this.setState({rating: newRating, avgRating: newAvg,
			       pending: false, success: true});
	    }
	}).catch(err => {
	    this.setState({error: err});
	});
    }
    
    render() {
	let { raters, avgRating } = this.state;
	let { user } = this.props;
	return (                
	    <div className="left">
		<h5> {avgRating} ({raters} rated)</h5>
		{ user &&
		  <ReactStars
		      count={5}
		      value={avgRating}
		      onChange={this.ratingChanged}
		      size={30}
		      color2={'#ffd700'}
		  /> }
		{ !user &&
		  <ReactStars
		      count={5}
		      value={avgRating}
		      edit={false}
		      onChange={this.ratingChanged}
		      size={30}
		      color2={'#ffd700'}
		  /> }
	    </div>
	);
    }
    
}

const mapStateToProps = (state) => {
    return {
	token: state.reducerLogin.token,
	user: state.reducerLogin.user,
    };
}

export default connect(mapStateToProps, null)(Rating);
