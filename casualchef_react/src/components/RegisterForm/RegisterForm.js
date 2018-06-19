import React, { Component } from "react";
import { Input, Row, Col, Button, Divider, Icon } from 'react-materialize'
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { register } from "../../redux/actions/register";
import Loader from "../Loader/Loader";

class RegisterForm extends Component {
    constructor(props) {
	super(props);
	this.state = { 
	    username: '',
	    email: '',
	    password: '',
	    repeat_password: '',
	    input_error: false,
	};
	this.onSubmit = this.onSubmit.bind(this);
    }
    
    passwordMatches() {
        return (this.state.password === this.state.repeat_password)
    }
    passwordLengthOkay() {
	var len = this.state.password.length
	return (len <= 30 && len >= 5)
    }
    usernameLengthOkay() {
	var len = this.state.username.length
	return (len <= 30 && len >= 2)
    }
    emailLengthOkay() {
	var len = this.state.email.length
	return (len <= 50 && len >= 5)
    }

    render() {
	let {username, email, password, repeat_password, input_error} = this.state;
	let {registerPending, registerSuccess, registerError} = this.props;

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
			    <Input s={12} label="Email" type="email" className="validate"
				   onChange={e => this.setState({
					   email: e.target.value
				   })} value={email}/>
			    <Input s={12} label="Password" type="password"
				   onChange={e => this.setState({
					   password: e.target.value
				   })} value={password}/>
			    <Input s={12} label="Repeat Password" type="password"
				   onChange={e => this.setState({
					   repeat_password: e.target.value
				   })} value={repeat_password}/>
			</Col>
		    </Row>
		    
		    <Row>
			<Button className="color2" 
				type="submit" waves='light' icon="send">Register</Button>
		    </Row>
		    
		    <Row>
			{ input_error && <p className="text-error center">
			    {input_error}<Icon>error</Icon></p> }
			{ registerPending && <Loader/> }
		    </Row>
		    { registerPending && <p className="center">Please wait...</p> }
			{ registerSuccess && <p className="center">Success.
			    <Row><NavLink to="/login">Click here to login</NavLink></Row></p> }
			{ registerError && <p className="text-error center">
			    {registerError.message}<Icon>error</Icon></p> }
			<br/>
		</div>
	    </form>	    
	)
    }

    onSubmit(e) {
	e.preventDefault();
	let { username, email, password, repeat_password } = this.state;
	if (!this.passwordMatches()) {
	    this.setState({input_error: "Repeated password doesn't match password"});
	} else if (!this.passwordLengthOkay()) {
	    this.setState({input_error: "Password length must be within 5 to 30"});
	} else if (!this.usernameLengthOkay()) {
	    this.setState({input_error: "Username length must be within 2 to 30"});
	} else if (!this.emailLengthOkay()) {
	    this.setState({input_error: "Email length must be within 5 to 30"});
	} else {
	    this.props.register(username, password, email, repeat_password);
	    this.setState({
		username: '',
		email: '',
		password: '',
		repeat_password: '',
		input_error: null,
	    });
	    
	}
    }

}


const mapStateToProps = (state) => {
    return {
	registerPending: state.reducerRegister.registerPending,
	registerSuccess: state.reducerRegister.registerSuccess,
	registerError: state.reducerRegister.registerError,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
	register: (username, email, password, repeat_password) => 
	    dispatch(register(username, email, password, repeat_password))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
