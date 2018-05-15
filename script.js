let origBoard;
let p1;
let p2;
const winSets = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]
count = 0;
const squares = document.querySelectorAll('div.square');

squares.forEach(sq => sq.id = '' + count++);

const popup = document.getElementById('popup');
const chooseMark = document.querySelectorAll('#popup>div');
let firstUp = Math.floor(Math.random()*2) ? 'p1' : 'p2';

let startGame = function startGame(r) {
  if (r) console.log(r);
  count = 0;
  let first = firstUp;

  chooseMark.forEach(e => {
  	e.onclick = () => {
  		p1 = e.textContent;
  		p2 = (e.textContent === 'X' ? 'O' : 'X');
  		popup.className = 'step2';
  		popup.textContent = 'Good luck, Player1!';

  		function whoIsFirst(){
  			popup.textContent = (first === 'p1' ? "You're " : p2 + ' is') + ' up first.';
  			setTimeout(closePopUp, 1500);
  		}

  		function closePopUp(){
  			popup.style.display = 'none';
        goOn();
  		}
  		setTimeout(whoIsFirst, 1500);
  	};
  });

  function goOn(){

  	origBoard = Array.from(Array(9).keys());
  	for (let i = 0; i < squares.length; i++) {
  		squares[i].innerText = '';
  		squares[i].classList.remove('win');
      squares[i].style.color = 'white';
  		squares[i].addEventListener('click', p1Move);
  	}
    if(first === 'p2') makeMove('4', p2);
  }
}

function p1Move(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		makeMove(square.target.id, p1)
		if (!checkWin(origBoard, p1) && !tieGame()) makeMove(bestSpot(), p2);
	}
}

function makeMove(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winSets.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winSets[gameWon.index]) {
		document.getElementById(index).className += ' win';
	}
	for (let i = 0; i < squares.length; i++) {
		squares[i].removeEventListener('click', p1Move);
	}
	declareWinner(gameWon.player == p1 ? "You win!" : "You lose.");
  //setTimeout(startGame, 2000);
  startGame();
}

function declareWinner(msg) {
	document.querySelector("#popup").style.display = "block";
	document.querySelector("#popup").textContent = msg;
  setTimeout(startGame, 2000);

}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, p2).index;
}

function tieGame() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < squares.length; i++) {
			squares[i].style.color = "grey";
			squares[i].removeEventListener('click', p1Move);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, p1)) {
		return {score: -10};
	} else if (checkWin(newBoard, p2)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == p2) {
			let result = minimax(newBoard, p1);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, p2);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(player === p2) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
startGame();
