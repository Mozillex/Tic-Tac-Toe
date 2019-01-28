'use strict';

let positions;
let  p1 = 'X';
let  p2 = 'O';

const popup = document.getElementById('popup');
const msg = document.getElementById('msg');
const end = document.getElementById('end');
const endMsg = document.getElementById('endMsg');
const backEnd = document.getElementById('backEnd');
const choice = document.getElementById('choice');

const winSets =[
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8],
  [1, 4, 7],
  [0, 3, 6]
];

const squares = document.querySelectorAll('.square');

function chooseMark(mark){
  p1 = mark;
  p2 = (mark === 'X' ? 'O' :'X');
  positions = Array.from(Array(9).keys());
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', p1Move, false);
    squares[i].textContent = '';
  }
  if (p2 === 'X') {
    takeTurn(bestSpot(), p2);
  }
  choice.style.display = 'none';
  popup.style.display = 'none';
}

function startGame() {
  end.style.display = 'none';
  choice.style.display = 'block';
  popup.style.display = 'block';
  squares.forEach(x => x.className = 'square');
}

function p1Move(pos) {
  if (typeof positions[pos.target.id] ==='number') {
    takeTurn(pos.target.id, p1);
    if (!checkWin(positions, p1) && !checkTie()) takeTurn(bestSpot(), p2);
  }
}

function takeTurn(squareId, player) {
  positions[squareId] = player;
  document.getElementById(squareId).innerHTML = player;
  let  winGame = checkWin(positions, player);
  if (winGame) gameOver(winGame);
  checkTie();
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player) ? a.concat(i) : a, []);
  let  winner = null;
  
  for (let [index, win] of winSets.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      winner = {index: index, player: player};
      break;
    }
  }
  return  winner;
}

function gameOver(winner){
  for (let index of winSets[winner.index]) document.getElementById(index).classList.add('win');
  for (let i=0; i < squares.length; i++) {
    squares[i].removeEventListener('click', p1Move, false);
  }
  declareWinner((winner.player ===  p1 ? "You win!" : winner.player + " wins. Try Again."),winner.player);
}

let repeat;
function again(){
  startGame();
  chooseMark(p1);
}

function declareWinner(message,player) {
  end.style.display = "block";
  backEnd.textContent = player;
  endMsg.textContent = message;
  repeat = setTimeout(again, 2000);
}

function openSquares() {
  return positions.filter((x, y) => y === x);
}

function bestSpot(){
  return minMax(positions, p2).index;
}

function checkTie() {
  if (openSquares().length === 0){
    for(let i = 0; i< squares.length; i++) {
      squares[i].style.color = '#757575';
      squares[i].removeEventListener('click',p1Move, false);
    }
    declareWinner("Tie game");
    return true;
  }
  return false;
}

function minMax(newBoard, player) {
  let openSq = openSquares(newBoard);

  if (checkWin(newBoard, p1)) {
    return {score: -10};
  } else if (checkWin(newBoard, p2)) {
    return {score: 10};
  } else if (openSq.length === 0) {
    return {score: 0};
  }
  let moves = [];
  for (let i = 0; i < openSq.length; i ++) {
    let move = {};
    move.index = newBoard[openSq[i]];
    newBoard[openSq[i]] = player;

    if (player === p2)
      move.score = minMax(newBoard, p1).score;
    else
       move.score =  minMax(newBoard, p2).score;
    newBoard[openSq[i]] = move.index;
    if ((player === p2 && move.score === 10) || (player === p1 && move.score === -10))
      return move;
    else
      moves.push(move);
  }

  let bestMove, bestScore;
  if (player === p2) {
    bestScore = -1000;
    for(let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
      bestScore = 1000;
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
