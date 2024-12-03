const board = document.getElementById('board');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('resetButton');

let cells = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

function createBoard() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        cellElement.textContent = cell;
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (cells[index] !== '' || !gameActive) return;
    
    cells[index] = currentPlayer;
    createBoard();
    checkWinner();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameActive) {
        statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            gameActive = false;
            statusDisplay.textContent = `Spieler ${cells[a]} hat gewonnen!`;
            return;
        }
    }

    if (!cells.includes('')) {
        gameActive = false;
        statusDisplay.textContent = 'Unentschieden!';
    }
}

resetButton.addEventListener('click', () => {
    cells = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;
    createBoard();
});

createBoard();
statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;
