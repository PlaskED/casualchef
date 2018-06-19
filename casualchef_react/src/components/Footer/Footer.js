import React from "react";
import { Footer } from 'react-materialize'

//import { NavLink } from "react-router-dom";

export default () => (
    <Footer copyrights="&copy; 2018 Casualchef"
    moreLinks={
	<a className="white-text text-lighten-4 right" href="#!">Github</a>
    }
    links={
	<ul>
	    <li><a className="white-text text-lighten-4" href="#!">Link 1</a></li>
	    <li><a className="white-text text-lighten-4" href="#!">Link 2</a></li>
	    <li><a className="white-text text-lighten-4" href="#!">Link 3</a></li>
	    <li><a className="white-text text-lighten-4" href="#!">Link 4</a></li>
	</ul>
    }
    className='teal lighten-1'
    >
    <h5 className="white-text">Additional Information</h5>
    <p className="white-text text-lighten-4">
	You can use rows and columns here to organize your footer content.
    </p>
	    </Footer>
)
