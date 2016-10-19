import React from "react";

export default class Banner extends React.Component{
	constructor(){
		super();
		this.scrollToMap = this.scrollToMap.bind(this);
	}
	scrollToMap(){

	}
	render(){
		return (
			<section className="banner">
				<img src={assetsUrl + "/images/banner.jpg"} className="bg" />
				<img src={assetsUrl + "/images/arrow-btn.png"} className="arrowBtn" onClick={this.scrollToMap} />
			</section>
		)
	}

}