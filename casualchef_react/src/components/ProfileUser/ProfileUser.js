import React, { Component } from "react";
import { Divider, CardPanel } from "react-materialize";
import { connect } from "react-redux";

class ProfileUser extends Component {
    render() {
	let { user } = this.props;
	return (
	    <CardPanel>
		<h4 className="username">{user.username}</h4> 
		<Divider/>
		<p>Email: {user.email}</p>
		<p>Cooking points: {user.cooking_points}</p>
	    </CardPanel>
	)
    }
}

const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user
    };
}

export default connect(mapStateToProps, null)(ProfileUser);
