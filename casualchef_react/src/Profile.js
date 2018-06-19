import React, { Component } from "react";
import { Row, Col, Icon } from 'react-materialize'
import { Redirect } from "react-router-dom";
import ProfileUser from "./components/ProfileUser/ProfileUser";
import ProfileComments from "./components/ProfileComments/ProfileComments";
import ProfileRecipes from "./components/ProfileRecipes/ProfileRecipes";
import { connect } from "react-redux";

class Profile extends Component {
    render() {
	let { user } = this.props;
	if (user) {
	    return (
		<div>
		    <Row className="center">
			<ProfileUser/>
		    </Row>
		    <Row>
			<Col s={6} className="center">
			    <h4><Icon>message</Icon> Latest comments</h4>
			    <ProfileComments/>
			</Col>
			<Col s={6} className="center">
			    <h4><Icon>description</Icon> Latest recipes</h4>
			    <ProfileRecipes/>
			</Col>
		    </Row>
		</div>
	    )
	} else { return <Redirect to="/login" /> }
    }
}

const mapStateToProps = (state) => {
    return {
	user: state.reducerLogin.user,
    };
}

export default connect(mapStateToProps, null)(Profile);
