import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { Row, CardPanel } from "react-materialize";
import Loader from "../Loader/Loader";
import { connect } from "react-redux";
import axios from 'axios';

class ProfileComments extends Component {
    constructor(props) {
	super(props);
	this.state = { pending: false, error: null, done: false, comments: [], index: 0 };
    }

    componentDidMount() {
	this.setState({pending: true});
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/profile/comments/' + this.state.index,
	    auth: {
		username: this.props.token,
		password: 'unused'
	    },
	}).then(response => {
	    const newComments = response.data.data;
	    this.setState({ comments: this.state.comments.concat(newComments), pending: false, done: true });
	    if (newComments.length !== 0) {
		this.setState({index: newComments[newComments.length-1].id});
	    }
	}).catch(err => {
	    this.setState({error: err});
	});
    }

    render() {
	let { comments, pending, error, done } = this.state;
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
			comments.map(comment => (
			    <div className="comment" key={comment.id}>	
				<CardPanel>
				    <span className="black-text bold">
					You commented on the recipe&nbsp;
					<NavLink to={"/recipe/" + comment.recipe.id}>
					    {comment.recipe.name}
					</NavLink>:
			    <br/>
			    <blockquote>
				{comment.text}
			    </blockquote>
			    <br/>
			    Published: {comment.published}
			    <br/>
			    Popularity: {comment.popularity}
			    ({comment.voters} users voted)
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
	token: state.reducerLogin.token,
    };
}

export default connect(mapStateToProps, null)(ProfileComments);
