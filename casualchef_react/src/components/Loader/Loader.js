import React, { Component } from "react";
import { Preloader } from 'react-materialize';

class Loader extends Component {
    render() {
	return (
	    <div className="center">
		<Preloader size='big' flashing="true" />
	    </div>
	)
    }
}

export default Loader;
