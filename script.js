
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

			if(upNow === p2) p2.takeTurn();
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
			if (p1 === upNow && sq.textContent === ''){//if p1's turn, and square is empty...
				sq.value = p1.value;
				sq.textContent = p1.value;
				p1.moves.push(sq.id);
				allMoves.push(sq.id);

				if (testWin(p1) !== ('tie'||'win')) togglePlayer();
			}
		}
	})
};
setupBoard();

function togglePlayer(){
	upNow = (upNow === p1 ? p2 : p1);
	if(upNow === p2){
		p2.takeTurn();
	}
}

p2.takeTurn = function(){

	//if (test for win) then either return, or toggle
	let bestPlay = findBestPlay()[0];
	let p2Move = document.getElementById(bestPlay);
	if (!p2Move) return;
	p2Move.textContent = p2.value;
	p2Move.value = p2.value;
	p2.moves.push(bestPlay);
	allMoves.push(bestPlay);
	if (testWin(p2) !== ('tie'||'win')) togglePlayer();
}

function findBestPlay(){
	let empty = [];
	squares.forEach(ea => {
		if(ea.textContent === '') empty.push(ea.id);
	});
	return empty;
}

function testWin(player){
	let winner;
	let moves = player.moves;

	function isMatch(cell){
		return cell.value ===player.value;
	}

	winSets.map (x=> {
		if(x.every(isMatch)) {
			winner = 'win';
			gameWon({name : player.name, rowOf3 : winSets.indexOf(x)});
		}
	});

	if (!winner && allMoves.length === 9) {
		tieGame();
		winner = 'tie';
	}
	return winner;
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
	if (!winner) {
		console.log('Pushed Game');
		tieGame();
		return;
	}
	popup.textContent =  winner.name + " wins!!!";
	popup.style.display = 'block';
	squares.forEach(e => e.onclick = null);


	winSets[winner.rowOf3].forEach(e => e.className += ' win');//note the space added before the class name



}

function tieGame(){
	popup.style.display = 'block';
	popup.textContent = 'Tie Game';
	setTimeout(setupBoard, 1500);
}
