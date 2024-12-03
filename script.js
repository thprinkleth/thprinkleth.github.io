// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC2_NBT6YpWztKxB2cucPuA_JPE3ux-57U",
    authDomain: "tictactoe-accac.firebaseapp.com",
    databaseURL: "https://tictactoe-accac-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tictactoe-accac",
    storageBucket: "tictactoe-accac.firebasestorage.app",
    messagingSenderId: "1053461735242",
    appId: "1:1053461735242:web:f2b408873d6e285d5983b3",
    measurementId: "G-X1S1GW1XJ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const boardRef = ref(db, 'tic-tac-toe');

// Variables for game status
let cells = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;
const statusDisplay = document.getElementById('status');
const board = document.getElementById('board');

// Create game board
function createBoard() {
    board.innerHTML = '';
    cells.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

// Handle cell click event
function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (cells[index] !== '' || !gameActive) return;

    cells[index] = currentPlayer;
    checkWinner();

    // Write state to Firebase database
    set(boardRef, { cells, currentPlayer: currentPlayer === 'X' ? 'O' : 'X' });
}

// Update game status in real-time
onValue(boardRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        cells = data.cells;
        currentPlayer = data.currentPlayer;
        createBoard();
        statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;
    }
});

// Check for winner
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
    } else {
        statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;
    }
}

// Reset game
document.getElementById('resetButton').addEventListener('click', () => {
    cells = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    set(boardRef, { cells, currentPlayer });
});

createBoard();
statusDisplay.textContent = `Spieler ${currentPlayer} ist am Zug`;