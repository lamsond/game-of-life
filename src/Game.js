import React from 'react';
import {Heading} from './Heading.js';
import {Board} from './Board.js';

export class Game extends React.Component{

	constructor(props){
		super(props);
		
		this.state = {
			step: 0,
			boardWidth: 420,
			rowLength: 20,
			isRunning: false,
		};

		this.toggleRun = this.toggleRun.bind(this);
	}

	toggleRun(){
		this.setState({
			isRunning: !this.state.isRunning,
		});
	}

	render(){
		const buttonStyle = {
			background: this.state.isRunning ? '#000000':'#000000',
			color: this.state.isRunning ? '#ff0000':'#00ff00',
			padding: 10,
			marginBottom: 5,
			borderRadius: 5,
			width: 75,
			fontSize: 19,
		};

		const divStyle = {
			width: 400,
			textAlign: 'center',
			margin: 'auto',
		};

		return (
				<div>
					<Heading step={this.state.step} />
					<div style={divStyle}>
						<button
							style={buttonStyle} 
							onClick={this.toggleRun}
						>{this.state.isRunning ? "stop":"start"}</button>
					</div>
					<Board 
						size={this.state.rowLength} 
						width={this.state.boardWidth} 
						run={this.state.isRunning} 
					/>
				</div>
				);
	}
}

