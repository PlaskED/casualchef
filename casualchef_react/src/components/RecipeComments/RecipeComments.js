import React, { Component } from "react";
import { Input, Row, Button, Col, Icon } from "react-materialize";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import Loader from "../Loader/Loader";
import Comment from "../Comment/Comment";
import axios from 'axios';

class RecipeComments extends Component {
    constructor(props) {
	super(props);
	this.state = this.initState();
	this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
	this.fetchRecipeComments(this.props.rid, this.state.index);
    }

    componentWillReceiveProps(nextProps) {
	if (this.props.rid !== nextProps.rid) {
	    this.setState(this.initState());
	    this.fetchRecipeComments(nextProps.rid, 0);
	}
    }

    initState() {
	return { pending: false, error: null, done: false,
		 comments: [], index: 0, myComment: '', 
		 commentPending: false, commentError: null, commentDone: false};
    }

    fetchRecipeComments(rid, index) {
	this.setState({pending: true});
	axios({
	    method:'get',
	    url: 'http://localhost:5000/api/recipe/' + rid + '/comments/' + index,
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

    postComment(comment) {
	this.setState({commentPending: true});
	let { user, token, rid } = this.props;
	axios({
	    method:'post',
	    url: 'http://localhost:5000/api/create/comment',
	    auth: {
		username: token,
		password: 'unused'
	    },
	    data: {
		recipe: rid,
		text: comment,
	    },
	}).then(response => {
	    const newComment = response.data.data;
	    newComment.author = {id: user.id, name: user.username}
	    this.setState({ comments: this.state.comments.concat([newComment]),
			    commentPending: false, commentDone: true });
	    this.setState({index: newComment.id});
	}).catch(err => {
	    this.setState({commentError: err});
	});
    }

    commentLengthOkay() {
	var len = this.state.myComment.length
	return (len <= 500 && len >= 1)
    }

    onSubmit(e) {
	e.preventDefault();
	let { myComment } = this.state;
	if (!this.commentLengthOkay()) {
	    this.setState({commentError: "Comment length must be within 1 to 500 characters"});
	} else {
	    this.postComment(myComment);
	    this.setState({myComment: ''});
	}
    }

    render() {
	let { comments, pending, error, done, myComment,
	      commentPending, commentError } = this.state;
	let { user } = this.props;
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
		    <form name="comment-form" onSubmit={this.onSubmit}>
			{
			    user && <div className="center">
				<Row>
				    <Input className="color-bg" s={12} placeholder="Comment here.." type="textarea" 
					   onChange={e => this.setState({
						   myComment: e.target.value
					   })} value={myComment}/>
				</Row>
				<Row>
				    <Button className="color2" 
					    type="submit" waves='light' icon="send">Post</Button>
				</Row>
				<Row>
				    { commentError && <div><p className="text-error center">
					<Icon>error</Icon></p>{commentError}</div> }
				    { commentPending && <Loader/> }
				</Row> 
			    </div>
			}
		    </form>
		    { !user && <Row className="center">
			<NavLink to="/login">Login</NavLink> to be able to comment!
		    </Row>
		    }
			<Row>
			    {comments.map(comment =>(<Comment comment={comment}/>))}
			</Row>
		</div>
	    )
	} else { return null; }
    }
}

const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user,
	token: state.reducerLogin.token,
    };
}

export default connect(mapStateToProps, null)(RecipeComments);
