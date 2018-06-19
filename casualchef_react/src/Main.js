import React, { Component } from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { Container } from 'react-materialize'
import Home from "./Home";
import Recipes from "./Recipes";
import Login from "./Login";
import Logout from "./Logout";
import Register from "./Register";
import Profile from "./Profile";
import Recipe from "./Recipe";
import CreateRecipe from "./CreateRecipe";
import Category from "./Category";
import MyNavbar from "./components/MyNavbar/MyNavbar";
import Footer from "./components/Footer/Footer";

import { connect } from "react-redux";
import { refreshToken, silentRefreshToken } from "./redux/actions/refreshToken";

class Main extends Component {
    constructor(props) {
	super(props);
	this.state = { timer: null,  counter: 0 }
	this.tick = this.tick.bind(this);
    }
    componentDidMount() {
	this.props.refreshToken(this.props.token);
	let timer = setInterval(this.tick, 10000);
	this.setState({timer});
    }
    componentWillUnmount() {
	clearInterval(this.state.timer);
    }
    
    tick() {
	if(this.props.token) {
	    this.setState({ counter: this.state.counter + 1 });
	    if (this.state.counter > 56) { //Refresh token when it's close to expiry
		this.props.silentRefreshToken(this.props.token);
		this.setState({ counter: 0 });
	    }
	} else {
	    this.setState({ counter: 0 });
	}
    }
    
    render() {
	return (
	    <BrowserRouter>
		<div>
		    <MyNavbar/>
		    <Container>
			<Route exact path="/" component={Home}/>
			<Route path="/recipes" component={Recipes}/>
			<Route path="/login" component={Login}/>
			<Route path="/logout" component={Logout}/>
			<Route path="/register" component={Register}/>
			<Route path="/profile" component={Profile}/>
			<Route path="/create/recipe" component={CreateRecipe}/>
			<Route path="/recipe/:rid" component={Recipe}/>
			<Route path="/category/:cid" component={Category}/>
		    </Container>
		    <Footer/>
		</div>
	    </BrowserRouter>
	);
    }
}

const mapStateToProps = (state) => {
    return {
	token: state.reducerLogin.token,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
	refreshToken: (token) => dispatch(refreshToken(token)),
	silentRefreshToken: (token) => dispatch(silentRefreshToken(token))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);

