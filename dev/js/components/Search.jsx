import React from "react";

class Search extends React.Component{
	constructor(){
		super();
	}
	componentWillReceiveProps(nextProps){
		this.setState({

		});
	}

	render(){
		return (
			<section className="searchContainer">
				<p>Find a fit event here</p>
				<fieldset className="inputs">
					<input type="text" placeholder="Enter your zip code" id="address" />
					<button>Go</button>
					<em>or</em>
					<select>
						<option>Select Your City</option>
						
					</select>
				</fieldset>
			</section>
		)
	}

}

export default Search;