import React from "react";
import ReactDOM from "react-dom";
import Banner from './Banner';
import Map from './Map';
import Search from './Search';
import Content from './Content';



class Main extends React.Component {
	constructor(){
		super();
	}
	render(){
		return (
			<div>
				<Banner />
				<Search />
				<Map />
				<Content />
			</div>
		)
	}
}

ReactDOM.render(<Main />, document.getElementById('main'));