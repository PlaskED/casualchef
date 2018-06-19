import React, { Component } from "react";
import { connect } from 'react-redux'
import { Redirect } from "react-router-dom";
import { logoutLoginState } from "./redux/actions/login";
import { logoutRegisterState } from "./redux/actions/register";

class Logout extends Component {
    componentWillMount() {
	this.props.logoutLoginState();
	this.props.logoutRegisterState();
    }
    render() {
	return (
	    <Redirect to="/" />
	)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
	logoutLoginState: () => dispatch(logoutLoginState()),
	logoutRegisterState: () => dispatch(logoutRegisterState())
    };
}

export default connect(null, mapDispatchToProps)(Logout);
