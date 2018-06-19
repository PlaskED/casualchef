import React, { Component } from "react";
import { Row, Col, CardPanel, Button } from 'react-materialize'
import { connect } from "react-redux";
import axios from 'axios';

class Comment extends Component {
    constructor(props) {
	super(props);
	this.state = {
	    comment: this.props.comment,
	    pending: false,
	    error: false,
	    success: false,
	}
	this.submitUpvote = this.submitUpvote.bind(this);
	this.submitDownvote = this.submitDownvote.bind(this);
    }


    voteComment(vote) {
	this.setState({pending: true});
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/vote/comment',
	    auth: {
		username: this.props.token,
		password: 'unused'
	    },
	    data: {
		comment: this.state.comment.id,
		good: vote,
	    },
	}).then(response => {
	    const resVote = response.data.data
	    var newVoters = this.state.comment.voters;
	    var newPopularity = this.state.comment.popularity;
	    switch(resVote.old_vote) {
		case 'new':
		    newVoters += 1;
		    newPopularity += (vote) ? 1 : -1;
		    break;
		case 'unchanged':
		    //State should remain the same
		    break;
		case 'changed':
		    newPopularity += (vote) ? 2 : -2;
		    break;
		default:
		    break;
	    }
	    var newComment = this.state.comment;
	    newComment.voters = newVoters;
	    newComment.popularity = newPopularity;
	    this.setState({comment: newComment, pending: false, success: true});
	}).catch(err => {
	    this.setState({error: err});
	});
    }

    submitUpvote() {
	let { pending } = this.state;
	if (!pending) {
	    this.voteComment(true);
	}
    }
    
    submitDownvote() {
	let { pending } = this.state;
	if (!pending) {
	    this.voteComment(false);
	}
    }
    
    render() {
	let { comment, user } = this.props;

	return (
	    <div className="comment" key={comment.id}>
		<CardPanel>
		    <span className="black-text">
			<Row>
			    <Col s={7}>
				<p>{comment.published}</p>
			    </Col>
			    { user && <div><Col s={2}>
				<Button floating className="color-bg" waves='light'
					 onClick={this.submitDownvote}>
				    <i class="material-icons downvote">thumb_up</i>
				</Button>
			    </Col>
			    </div> }
			    { !user && <Col s={2}></Col> }
			    <Col s={1}>
				<Button floating className="color-bg">
				    <h5 className="black-text">{comment.popularity}</h5></Button>
			    </Col>
			    { user && <div><Col s={2}>
				<Button floating className="color-bg" waves='light'
					onClick={this.submitUpvote}>
				    <i class="material-icons upvote">thumb_up</i>
				</Button>
			    </Col></div> }
			    { !user && <Col s={2}></Col> }
			</Row>
			<blockquote>
			    <Row>
				<Col s={4}>
				    <h5 className="username left">{comment.author.name}:</h5>
				</Col>
				<Col s={8}>
				    <p className="flow-text left">{comment.text}</p>
				</Col>
			    </Row>
			</blockquote>
		    </span>
		</CardPanel>
	    </div>
	)
    }
    
}

const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user,
	token: state.reducerLogin.token,
    };
}

export default connect(mapStateToProps, null)(Comment);
