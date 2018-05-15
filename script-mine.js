
let p1 = {name:'Player 1'};
let p2 = {name:'Computer'};
let players = [p1,p2];
let allMoves = [];

const popup = document.getElementById('popup');
const chooseMark = document.querySelectorAll('#popup>div');

//randomly choose who goes first

let firstUp = Math.floor(Math.random()*2) ? p1 : p2;
let upNow = firstUp;

// ask the player to choose 'x' or 'o'

chooseMark.forEach(e => {
	e.onclick = () => {
		p1.value = e.textContent;
		p2.value = (e.textContent === 'X' ? 'O' : 'X');
		popup.className = 'step2';
		popup.textContent = 'Good luck, ' + p1.name + '!';

		function whoIsFirst(){
			popup.textContent = (upNow===p1 ? "You're " : p2.name + ' is') + ' up first!';
			setTimeout(togglePopUp, 500);//1500
		}

		function togglePopUp(){
			let x = popup.style.display;
			popup.style.display = (x==='none' ? 'block' : 'none');

			let bestPlay = findBestPlay();










			if(upNow === p2) makeMove(p2.value, findBestPlay());
		}
		setTimeout(whoIsFirst, 500);//2000
	};
});

let squares = document.querySelectorAll('div.square');

let count = 0;

//set up board, and what happens when p1 selects a square...

function setupBoard(){
	p1.moves=[];
	p2.moves = [];
	squares.forEach(sq => {
		sq.textContent = '';
		sq.value='';
		sq.id = 'sq'+count++;
		sq.onclick = () => {
			makeMove(p1.value,sq.id);
		}
	})
};
setupBoard();



// *************************

function makeMove(player,move){
	if (player !== upNow.value) alert('fix this!!');
	let playerMoves = (upNow=== p1 ? p1.moves : p2.moves);
	debugger;
	console.log(player);
	console.log(move);

	let spot = document.getElementById(move);
	if (player === upNow.value && spot.textContent === ''){//if p1's turn, and square is empty...
		spot.value = player;
		spot.textContent = player;
		(upNow === p1) ? p1.moves.push(spot) : p2.moves.push(spot);
		allMoves.push(spot);

		if (testWin(player,playerMoves) !== ('tie'||'win')) togglePlayer();
	}
}


function togglePlayer(){
	upNow = (upNow === p1 ? p2 : p1);
	if(upNow === p2){
		makeMove(p2.value,findBestPlay());
	}
}

function findBestPlay(){
debugger;
	return minMax(upNow.value, allMoves).index; //availSpots();
}

function availSpots(){
	let empty = [];
	squares.forEach(ea => {
		if(ea.textContent === '') empty.push(ea.id);
	});
	return empty;
}

function testWin(player,plMoves){
	let result = null;
	//let moves = player.moves;

	winSets.map (x=> {
		if(x.every((cell)=>cell.value ===player)) {
	 		result = 'win';
	 		gameWon({mark : player, rowOf3 : winSets.indexOf(x)});
	 		return;
	 	}
	});

	if (!result && allMoves.length === 9) {
		result = 'tie';
	}
	return result;
}

function minMax(player, newBoard){
	let avail = availSpots();

	console.log('newBoard = ' +newBoard);

debugger;
	if (testWin(p1.value, p1.moves)) {
		return {score: -10};
	} else if (testWin(p2.value, newBoard)) {
		return {score: 10};
	} else if (avail.length === 9) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 9; i > avail.length; i--) {
		let move = {};
		move.index = newBoard[avail[i]];
		newBoard[avail[i]] = player;

		if (player == p2.value) {
			let result = minMax(p1.value, newBoard);
			move.score = result.score;
		} else {
			let result = minMax(p2.value, newBoard);
			move.score = result.score;
		}

		newBoard[avail[i]] = move.index;

		moves.push(move);

		console.log('163: moves = '+ moves);
		console.log('164: move = '+ move);

	}

	let bestMove;
	if(player === p2.name) {
		let bestScore = -10000;
		for(let i = 9; i > 0; i--) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 9; i > 0; i--) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];

}

const winSets = [
	[sq0,sq1,sq2],
	[sq3,sq4,sq5],
	[sq6,sq7,sq8],
	[sq0,sq3,sq6],
	[sq1,sq4,sq7],
	[sq2,sq5,sq8],
	[sq0,sq4,sq8],
	[sq2,sq4,sq6]
];

function gameWon(winner){
	// if (!winner) {
	// 	console.log('Pushed Game');
	// 	tieGame();
	// 	return;
	// }
	popup.textContent =  winner.mark + " wins!!!";
	popup.style.display = 'block';
	squares.forEach(e => e.onclick = null);


	winSets[winner.rowOf3].forEach(e => e.className += ' win');//note the space added before the class name



}

function tieGame(){
	popup.style.display = 'block';
	popup.textContent = 'Tie Game';
	setTimeout(setupBoard, 1500);
}
