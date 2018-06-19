import React, { Component} from "react";
import { Navbar } from 'react-materialize';
import { NavLink, withRouter} from "react-router-dom";
import { connect } from "react-redux";

class MyNavbar extends Component {
    getNavLinkClass = (path) => {
	return this.props.location.pathname === path ? 'active' : '';
    }
    render() {
	let { user } = this.props;

	return (
	    <Navbar brand='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Casualchef&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
		    className='teal lighten-1' right>
		<div>
		    <li className={this.getNavLinkClass("/")}><NavLink to="/">
			<i className="material-icons left">home</i>Home</NavLink></li>
		    <li className={this.getNavLinkClass("/recipes")}><NavLink to="/recipes">
			<i className="material-icons left">find_in_page</i>Browse Recipes</NavLink></li>
		    { user && <li className={this.getNavLinkClass("/create/recipe")}><NavLink to="/create/recipe">
			<i className="material-icons left">create</i>Create Recipe</NavLink></li> }
			
			{ user && <li className={this.getNavLinkClass("/logout")}><NavLink to="/logout">
			    <i className="material-icons left">keyboard_return</i>Logout</NavLink></li> }
			{ user && <li className={this.getNavLinkClass("/profile")}><NavLink to="/profile">
			    <i className="material-icons left">account_circle</i>Profile</NavLink></li> }
			{ !user && <li className={this.getNavLinkClass("/login")}><NavLink to="/login">
			    <i className="material-icons left">exit_to_app</i>Login</NavLink></li> }
			{ !user &&  <li className={this.getNavLinkClass("/register")}><NavLink to="/register">
			    <i className="material-icons left">input</i>Register</NavLink></li> }
		</div>
	    </Navbar>
	);
    }
}

const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user,
    };
}

export default withRouter(connect(mapStateToProps, null)(MyNavbar));
