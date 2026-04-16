let moves = 0;
let puzzleState = [];
let history = [];
const targetState = [1, 2, 3, 4, 5, 6, 7, 8, null];

const puzzleContainer = document.getElementById('puzzle');
const targetContainer = document.getElementById('target');
const moveCountEl = document.getElementById('moveCount');
const winMessage = document.getElementById('winMessage');
const finalMovesEl = document.getElementById('finalMoves');

function createTile(value, isTarget = false) {
    const tile = document.createElement('div');
    
    if (isTarget) {
        tile.className = value === null ? 'mini-tile mini-empty' : 'mini-tile';
        if (value !== null) tile.textContent = value;
    } else {
        tile.className = value === null ? 'tile empty' : 'tile';
        if (value !== null) tile.textContent = value;
    }
    return tile;
}

function renderGrid(container, state, isTarget = false) {
    container.innerHTML = '';
    state.forEach((value, index) => {
        const tile = createTile(value, isTarget);
        if (!isTarget && value !== null) {
            tile.addEventListener('click', () => moveTile(index));
        }
        container.appendChild(tile);
    });
}

function findEmpty() {
    return puzzleState.indexOf(null);
}

function isAdjacent(a, b) {
    const rowA = Math.floor(a / 3), colA = a % 3;
    const rowB = Math.floor(b / 3), colB = b % 3;
    return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
}

function saveHistory() {
    history.push([...puzzleState]);
    if (history.length > 30) history.shift();
}

function moveTile(index) {
    const emptyIndex = findEmpty();
    if (!isAdjacent(index, emptyIndex)) return;

    saveHistory();
    [puzzleState[index], puzzleState[emptyIndex]] = [puzzleState[emptyIndex], puzzleState[index]];
    
    moves++;
    moveCountEl.textContent = moves;

    renderGrid(puzzleContainer, puzzleState);
    checkWin();
}

function checkWin() {
    if (puzzleState.every((val, i) => val === targetState[i])) {
        finalMovesEl.textContent = moves;
        setTimeout(() => {
            winMessage.style.display = 'block';
        }, 300);
    }
}

function shuffle(array) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function startGame() {
    moves = 0;
    history = [];
    moveCountEl.textContent = '0';
    winMessage.style.display = 'none';

    do {
        puzzleState = shuffle(targetState);
    } while (JSON.stringify(puzzleState) === JSON.stringify(targetState));

    renderGrid(targetContainer, targetState, true);
    renderGrid(puzzleContainer, puzzleState);
}

// Buttons
document.getElementById('newGameBtn').addEventListener('click', startGame);

document.getElementById('resetBtn').addEventListener('click', () => {
    if (history.length > 0) {
        puzzleState = [...history[history.length - 1]];
        moves = Math.max(0, moves - 1);
        moveCountEl.textContent = moves;
        renderGrid(puzzleContainer, puzzleState);
    }
});

document.getElementById('undoBtn').addEventListener('click', () => {
    if (history.length > 0) {
        puzzleState = history.pop();
        moves = Math.max(0, moves - 1);
        moveCountEl.textContent = moves;
        renderGrid(puzzleContainer, puzzleState);
    }
});

// Keyboard shortcut
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'r') startGame();
});

// Start the game
window.onload = startGame;
