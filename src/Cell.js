import React from 'react';

export class Cell extends React.Component{
	
	constructor(props){
		super(props);

		this.state = {
			alive: false,
		};
	}

	handleClick(){
		// toggle state when clicked on
		this.setState({alive: !this.state.alive,});
		// turn boolean into 0 or 1 for use with Board array
		let n = this.state.alive ? 0:1;
		// send position and value back to board
		this.props.call_back(this.props.row_pos, this.props.col_pos, n);
	}

	componentWillReceiveProps(nextProps){
		/* this lifecycle method allowed me to update the
		 * state of the cell anytime the nextGen() function
		 * changed to cell array in the board class
		 * (my daughter always corrects me when i do something
		 * wrong - she's only 5 but she sure is smart!
		 * I love you Cora
		 */
		this.setState({alive: nextProps.alive},);
	}

	render(){
		let bg = this.state.alive ? '#0d0d1d':'#d0d0f0';
		let cellStyle = {
			backgroundColor: bg,
			width: this.props.width,
			height: this.props.width,
		};

		return (
				<td 
			style={cellStyle} 
			onClick={this.handleClick.bind(this)}
			></td>
			);
	}
}

