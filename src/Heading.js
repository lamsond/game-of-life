import React from 'react';

export class Heading extends React.Component{

	render(){

		let style = {
			textAlign:'center',
		};

		return (<div style={style}><h1>Conway{'\''}s Game of Life</h1></div>);
	}
}
