import React from 'react';
import {Cell} from './Cell.js';

export class Board extends React.Component{
	
	constructor(props){
		super(props);

		this.state = {
			cells: this.buildArray(),
			neighbors: this.buildArray(),
		};
	
		this.isThereAnybodyOutThere = this.isThereAnybodyOutThere.bind(this);
		this.getNeighborCount = this.getNeighborCount.bind(this);
		this.updateNeighbors = this.updateNeighbors.bind(this);
		this.nextGen = this.nextGen.bind(this);
		this.runGame = this.runGame.bind(this);
	}

	buildArray(){
		//builds a 2D array full of zeros
		let sq = [];
		let row = Array(this.props.size).fill(0);

		for(let i = 0; i < this.props.size; i++){
			sq.push(row);
		}

		return sq;
	}

	isThereAnybodyOutThere(x, y, val){
		/* this is the callback from the cell
		* it is called when a cell is clicked on
		* @param x,y grid location
		* @param val 0 = dead, 1 = alive
		*/
		let new_arr = [];
		let copy_cells = [...this.state.cells];
		
		for(let i = 0; i < copy_cells.length; i++){
			// if it is not the row that contains the clicked on cell 
			if(i != x){
				// push a copy into the new array
				new_arr.push(copy_cells[i]);
			}
			else{
				let new_row = [];
				let old_row = copy_cells[i];

				for(let j = 0; j < copy_cells.length; j++){
					// if it is not the clicked on cell
					if(j != y){
						// push whatever was there 
						new_row.push(old_row[j]);
					}
					else{
						// push val returned from the cell
						new_row.push(val);
					}
				}
				// push the modified row into the new array
				new_arr.push(new_row);
			}
		}

		// update state
		this.setState({cells: new_arr});
		this.updateNeighbors();
	}

	updateNeighbors(){
		/* this method handles populating the neighbor array
		 * with the neighbor counts returned from getNeighborCount
		 */

		let neighbor_counts = [];
		let length = this.state.cells.length;

		for(let i = 0; i < length; i++){
			let row = []

			for(let j = 0; j < length; j++){
				// push all the neighbor counts into a row
				row.push(this.getNeighborCount(i, j));
			}
			// push the row into the array
			neighbor_counts.push(row);
		}
		
		// update state 
		this.setState({neighbors: neighbor_counts,});
	}

	getNeighborCount(i, j){
		/* this method handles the math of counting
		 * neighboring cells
		 * @param i, j loctation in grid
		 * @return number of neighbors (0 - 8)
		 */

		let living_neighbors = 0;

		// double loop through region bordering cell @i, j
		for(let x = i - 1; x <= i + 1; x++){
			for(let y = j - 1; y <= j + 1; y++){
				// do not count itself
				let not_me = !(x==i && y==j);
				//make sure index is in range (not negative, not exceeding size)
				let in_bounds = x >= 0 && y >= 0 && x < this.props.size && y < this.props.size;

				// only count if valid index other than itself
				if(not_me && in_bounds){
					// add up the 1's (living neighbors)
					living_neighbors += this.state.cells[x][y];
				}
			}
		}

		return living_neighbors;
	}

	renderCell(i, j){
		//renders cell @ grid location i, j
		let cellWidth = Math.round(this.props.width/this.props.size);
		
		return (
			<Cell 
				width={cellWidth}
				row_pos={i}
				col_pos={j}
				call_back={this.isThereAnybodyOutThere}
				run={this.props.run}
				alive={this.state.cells[i][j]}	
			/>
		       );
	}

	renderTable(){
		// renders table of cells
		let table = [];

		for(let i = 0; i < this.props.size; i++){
			let row = [];
			for(let j = 0; j < this.props.size; j++){
				row.push(this.renderCell(i, j));
			}
			table.push(<tr>{row}</tr>);
		}

		return table;
	}

	nextGen(){
		/* this method handles all the game of life logic
		 * living cells with less than 2 neighbors die
		 * living cells with 2 or 3 neighbors live
		 * living cells with more than 3 neighbors die
		 * dead cells with exactly 3 neighbors come to life
		 */

		//only calculate if in 'run' mode
		if(this.props.run){
			let new_arr = [];
			let length = this.state.cells.length;

			//loop through both 2D state arrays
			for(let i = 0; i < length; i++){
				let new_row = [];
				for(let j = 0; j < length; j++){

					// the cell is alive!
					let alive = (this.state.cells[i][j] == 1);
					// number of neighbors
					let n = this.state.neighbors[i][j];
					// the cell will stay alive
					let stay_alive = (alive && n > 1 && n <= 3);
					// the cell will come to life
					let born_again = (!alive && n == 3);

					// push a 1 in if living or reborn
					if(stay_alive || born_again){
			 			new_row.push(1);
					}
					// push a 0 for dead cells
					else{
						new_row.push(0);
					}
				}
				new_arr.push(new_row);
			}
		
			//update state
			this.setState({cells: new_arr,});
		}
	}		

	runGame(){
		// this is the timer method
		
		// only update neighbors if in 'run' mode
		if(this.props.run){
			this.updateNeighbors();
		}
		// run game logic
		this.nextGen();
	}

	componentDidMount(){
		// start the timer when the board first renders
		this.timerID = setInterval(this.runGame, 1000);
	}

	componentDidUnmount(){
		//clear the timer when the board is removed
		clearInterval(this.timerID);
	}

	render(){

		let tableStyle = {
			borderWidth: 2,
			borderStyle: 'solid',
			borderColor: '#232323',
			borderRadius: 5,
			width: this.props.width,
			margin: 'auto',
		};

		return (<table style={tableStyle}><tbody>{this.renderTable()}</tbody></table>);
	}
}
