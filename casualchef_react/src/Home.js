import React, { Component } from "react";
import { Row, Divider } from 'react-materialize'
import TopRecipes from "./components/TopRecipes/TopRecipes";

class Home extends Component {
    render() {
	return (
	    <div className="center">
		<Row>
		    <h4>Homepage</h4>
		    <Divider/>
		    <p>This is the Homepage content. Here you can see some new cool recipes, popular comments and trends and so on.</p>
		</Row>
		<Row>
		    <TopRecipes/>
		</Row>
	    </div>
	)

    }
}

export default Home;
