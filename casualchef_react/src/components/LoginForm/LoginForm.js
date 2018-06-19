import React, { Component } from "react";
import { Input, Row, Col, Button, Divider, Icon } from "react-materialize";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { login } from "../../redux/actions/login";
import Loader from "../Loader/Loader";

class LoginForm extends Component {
    constructor(props) {
	super(props);
	this.state = {username: '', password: ''};
	this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e) {
	e.preventDefault();
	let { username, password } = this.state;
	this.props.login(username, password);
	this.setState({
	    username: '',
	    password: ''
	});
    }

    render() {
	let {username, password} = this.state;
	let {loginPending, loginSuccess, loginError} = this.props;

	return (
	    <form name="login-form" onSubmit={this.onSubmit}>
		<div className="center">
		    <Row>
			<Col offset="s3" s={6}>
			    <h4>Enter credentials</h4>
			    <Divider/>
			    <Input s={12} label="Username" 
				   onChange={e => this.setState({
					   username: e.target.value
				   })} value={username}/>
			    <Input s={12} label="Password" type="password" 
				   onChange={e => this.setState({
					   password: e.target.value
				   })} value={password}/>
			</Col>
		    </Row>
		    
		    <Row>
			<Button className="color2" 
				type="submit" waves='light' icon="send">Login</Button>
		    </Row>
		    <Row>{ loginPending && <Loader/> }</Row>
		    <Row>
			{ loginPending && <p className="center">Please wait...</p> }
			{ loginSuccess && <p className="center">Success.
			    <Redirect to="/profile"/></p> }
			{ loginError && <p className="text-error center">
			    {loginError.message}<Icon>error</Icon></p> }
		    </Row>
		</div>
	    </form>	    
	)
    }
}

const mapStateToProps = (state) => {
    return {
	loginPending: state.reducerLogin.loginPending,
	loginSuccess: state.reducerLogin.loginSuccess,
	loginError: state.reducerLogin.loginError,
	token: state.reducerLogin.token,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
	login: (username, password) => dispatch(login(username, password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
