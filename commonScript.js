// commonScript.js
function loadHeaderFooter() {
    fetch('header_footer.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            document.getElementById('header').innerHTML = doc.querySelector('header').outerHTML;
            document.getElementById('footer').innerHTML = doc.querySelector('footer').outerHTML;

            // Set the current year in the footer
            const currentYear = new Date().getFullYear();
            document.getElementById('footer-year').textContent = currentYear;
        });
}

// Function to Read Rows of UsefulLinks.txt
function csvToJson(csv) {
    const rows = csv.split("\n");
    const headers = rows[0].split("|");
    const json = rows.slice(1).map(row => {
        const values = row.split("|");
        return headers.reduce((acc, header, index) => {
            acc[header.trim()] = values[index]?.trim();
            return acc;
        }, {});
    });
    return json;
}

// Function to read the file and generate HTML tags
function loadUsefulLinks() {
    fetch('UsefulLinks.txt')
        .then(response => response.text())
        .then(csv => {
            const websites = csvToJson(csv);
            const usefulLinks = document.getElementById('usefulLinks');
            websites.forEach(website => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${website.link}" target="_blank">${website.name}</a>: ${website.description}`;
                usefulLinks.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error loading CSV:', error));
}

// JavaScript to fetch and display the content of blogList.html
function loadBlogContents(){	
	fetch('blogList.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('blog-content').innerHTML = data;
		})
		.catch(error => console.error('Error fetching the blog content:', error));
}


// TicTacToe Game Code
function loadTicTacToe(){
	const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const player1NameElement = document.getElementById('player1Name');
    const player2NameElement = document.getElementById('player2Name');
    const player1SymbolElement = document.getElementById('player1Symbol');
    const player2SymbolElement = document.getElementById('player2Symbol');
    const opponentSelect = document.getElementById('opponent');
    let board = ['', '', '', '', '', '', '', '', ''];
    let humanPlayer = 'X';
    let aiPlayer = 'O';
    let currentPlayer;
    let gameActive = true;
    let isAgainstComputer = true;
    let player1Name = 'You';
    let player2Name = 'Computer';

    // Randomize starting player
    function randomizeStartingPlayer() {
      currentPlayer = Math.random() < 0.5 ? humanPlayer : aiPlayer;
      if (currentPlayer === aiPlayer && isAgainstComputer) {
        setTimeout(() => aiMove(), 500); // AI makes the first move
      }
    }

    // Create the board
    function createBoard() {
      boardElement.innerHTML = '';
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell', 'w3-card');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        boardElement.appendChild(cell);
      }
    }

    // Handle cell click
    function handleCellClick(event) {
      const index = event.target.getAttribute('data-index');
      if (board[index] === '' && gameActive) {
        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer === 'X' ? 'x' : 'o');
        if (checkWin(board, currentPlayer)) {
          endGame(`${currentPlayer === humanPlayer ? player1Name : player2Name} wins!`, getWinningLine(currentPlayer));
        } else if (isBoardFull(board)) {
          endGame(`It's a draw!`);
        } else {
          // Switch turns
          currentPlayer = currentPlayer === humanPlayer ? (isAgainstComputer ? aiPlayer : 'O') : humanPlayer;
          if (isAgainstComputer && currentPlayer === aiPlayer) {
            setTimeout(() => aiMove(), 500); // AI move after a short delay
          }
        }
      }
    }

    // AI move using Minimax algorithm with slight randomness
    function aiMove() {
      let bestMoves = getBestMoves(board, aiPlayer);
      let bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]; // Randomly select from best moves
      board[bestMove] = aiPlayer;
      const cell = document.querySelector(`[data-index="${bestMove}"]`);
      cell.textContent = aiPlayer;
      cell.classList.add('o');
      if (checkWin(board, aiPlayer)) {
        endGame(`${player2Name} wins!`, getWinningLine(aiPlayer));
      } else if (isBoardFull(board)) {
        endGame(`It's a draw!`);
      } else {
        currentPlayer = humanPlayer;
      }
    }

    // Get all best moves for the AI
    function getBestMoves(newBoard, player) {
      const availableSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
      const moves = [];
      for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;
        const result = minimax(newBoard, player === aiPlayer ? humanPlayer : aiPlayer);
        move.score = result.score;
        newBoard[availableSpots[i]] = '';
        moves.push(move);
      }

      const bestScore = player === aiPlayer ? Math.max(...moves.map(m => m.score)) : Math.min(...moves.map(m => m.score));
      return moves.filter(m => m.score === bestScore).map(m => m.index);
    }

    // Minimax algorithm
    function minimax(newBoard, player) {
      const availableSpots = newBoard.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);

      if (checkWin(newBoard, humanPlayer)) {
        return { score: -10 };
      } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 10 };
      } else if (availableSpots.length === 0) {
        return { score: 0 };
      }

      const moves = [];
      for (let i = 0; i < availableSpots.length; i++) {
        const move = {};
        move.index = availableSpots[i];
        newBoard[availableSpots[i]] = player;

        if (player === aiPlayer) {
          const result = minimax(newBoard, humanPlayer);
          move.score = result.score;
        } else {
          const result = minimax(newBoard, aiPlayer);
          move.score = result.score;
        }

        newBoard[availableSpots[i]] = '';
        moves.push(move);
      }

      let bestMove;
      if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score > bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
          if (moves[i].score < bestScore) {
            bestScore = moves[i].score;
            bestMove = i;
          }
        }
      }

      return moves[bestMove];
    }

    // Check for a win
    function checkWin(board, player) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
      return winPatterns.some(pattern => pattern.every(index => board[index] === player));
    }

    // Get winning line coordinates
    function getWinningLine(player) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
      ];
      for (const pattern of winPatterns) {
        if (pattern.every(index => board[index] === player)) {
          return pattern;
        }
      }
      return null;
    }

    // Draw winning line
    function drawWinningLine(pattern) {
      const [a, b, c] = pattern;
      const cell1 = document.querySelector(`[data-index="${a}"]`);
      const cell2 = document.querySelector(`[data-index="${c}"]`);
      const rect1 = cell1.getBoundingClientRect();
      const rect2 = cell2.getBoundingClientRect();
      const boardRect = boardElement.getBoundingClientRect();

      // Calculate positions relative to the board
      const x1 = rect1.left + rect1.width / 2 - boardRect.left;
      const y1 = rect1.top + rect1.height / 2 - boardRect.top;
      const x2 = rect2.left + rect2.width / 2 - boardRect.left;
      const y2 = rect2.top + rect2.height / 2 - boardRect.top;

      const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      const line = document.createElement('div');
      line.classList.add('win-line');
      line.style.width = `${length}px`;
      line.style.transform = `rotate(${angle}deg)`;
      line.style.left = `${x1}px`;
      line.style.top = `${y1}px`;
      boardElement.appendChild(line);
    }

    // Check if the board is full
    function isBoardFull(board) {
      return board.every(cell => cell !== '');
    }

    // End the game
    function endGame(message, winningPattern) {
      gameActive = false;
      messageElement.textContent = message;
      if (winningPattern) {
        drawWinningLine(winningPattern);
      }
    }

    // Reset the game
    function resetGame() {
      const opponentChanged = isAgainstComputer !== (opponentSelect.value === 'computer');
      isAgainstComputer = opponentSelect.value === 'computer';

      if (opponentChanged) {
        if (isAgainstComputer) {
          player1Name = 'You';
          player2Name = 'Computer';
        } else {
          player1Name = prompt('Enter Player 1 name:', 'Player 1') || 'Player 1';
          player2Name = prompt('Enter Player 2 name:', 'Player 2') || 'Player 2';
        }
      }

      board = ['', '', '', '', '', '', '', '', ''];
      gameActive = true;
      player1NameElement.textContent = player1Name;
      player2NameElement.textContent = player2Name;
      player1SymbolElement.textContent = 'X';
      player2SymbolElement.textContent = 'O';
      randomizeStartingPlayer();
      messageElement.textContent = '';
      boardElement.innerHTML = ''; // Clear the board
      createBoard();
    }

    // Initialize the game
    window.resetGame=resetGame;
    resetGame();
}

// 15 Puzzle Game Code
function load15PuzzleGame(){
	const puzzleContainer = document.getElementById('puzzle-container');
    const referenceContainer = document.getElementById('reference-container');
    const messageContainer = document.getElementById('message-container');
    const counter = document.getElementById('counter');
    const message = document.getElementById('message');
    const levelDropdown = document.getElementById('level-dropdown');
    const shuffleAgainButton = document.getElementById('shuffle-again-button');
    let tiles = [];
    let emptyIndex = 15; // The empty space is initially at the bottom-right corner
    let moveCount = 0; // Counter for the number of moves

    // Level configurations
    const levels = {
      1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, null], // 1 to 15
      2: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, null], // Reverse order
      3: [1, 2, 4, 7, 3, 5, 8, 11, 6, 9, 12, 14, 10, 13, 15, null], // Diagonal order
      4: [1, 2, 3, 4, 12, 13, 14, 5, 11, 15, 6, 7, 10, 9, 8, null], // Spiral order
      5: [1, 2, 3, 4, 8, 7, 6, 5, 9, 10, 11, 12, 15, 14, 13, null], // Snake pattern
      6: [1, 3, 5, 7, 9, 11, 13, 15, 2, 4, 6, 8, 10, 12, 14, null], // Even-odd separation
      7: [2, 3, 5, 7, 11, 13, 1, 4, 6, 8, 9, 10, 12, 14, 15, null], // Prime numbers first
      8: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, null], // Fibonacci sequence
      9: [1, 3, 5, 7, 2, 4, 6, 8, 9, 11, 13, 15, 10, 12, 14, null], // Random solvable
    };

    let currentLevel = 1; // Default level
    let goalTiles = levels[currentLevel]; // Goal configuration for the current level

    // Function to count inversions
    function countInversions(puzzle) {
      let inversions = 0;
      for (let i = 0; i < puzzle.length; i++) {
        for (let j = i + 1; j < puzzle.length; j++) {
          if (puzzle[i] !== null && puzzle[j] !== null && puzzle[i] > puzzle[j]) {
            inversions++;
          }
        }
      }
      return inversions;
    }

    // Function to get the row number of the empty tile (counting from the bottom)
    function getEmptyTileRow(puzzle, size) {
      const emptyIndex = puzzle.indexOf(null);
      return Math.floor(emptyIndex / size) + 1;
    }

    // Function to check if the puzzle is solvable
    function isSolvable(puzzle, target, size) {
      const puzzleInversions = countInversions(puzzle);
      const targetInversions = countInversions(target);

      const puzzleEmptyRow = getEmptyTileRow(puzzle, size);
      const targetEmptyRow = getEmptyTileRow(target, size);

      const puzzleParity = (puzzleInversions + puzzleEmptyRow) % 2;
      const targetParity = (targetInversions + targetEmptyRow) % 2;

      return puzzleParity === targetParity;
    }

    // Initialize the puzzle
    function initializePuzzle() {
      tiles = [...goalTiles]; // Copy goal configuration to tiles
      emptyIndex = tiles.indexOf(null); // Update the empty space index
      moveCount = 0; // Reset move counter
      counter.textContent = `Moves: ${moveCount}/80`;
      renderPuzzle();
      renderReference();
      disablePuzzle(); // Disable the puzzle until shuffled
      hideShuffleAgainButton(); // Hide the "Shuffle Again" button
      resetBoardColor(); // Reset board color to light gray
    }

    // Render the puzzle grid
    function renderPuzzle() {
      puzzleContainer.innerHTML = '';
      tiles.forEach((tile, index) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile', 'w3-card');
        if (tile === null) {
          tileElement.classList.add('empty');
          tileElement.textContent = '';
        } else {
          tileElement.textContent = tile;
        }
        tileElement.addEventListener('click', () => moveTile(index));
        puzzleContainer.appendChild(tileElement);
      });
    }

    // Render the reference configuration
    function renderReference() {
      referenceContainer.innerHTML = '';
      goalTiles.forEach((tile) => {
        const tileElement = document.createElement('div');
        tileElement.classList.add('tile', 'w3-card');
        if (tile === null) {
          tileElement.classList.add('empty');
          tileElement.textContent = '';
        } else {
          tileElement.textContent = tile;
        }
        referenceContainer.appendChild(tileElement);
      });
    }

    // Shuffle the tiles while ensuring the puzzle remains solvable
    function shuffleTiles() {
      // Start from the solved state
      tiles = [...goalTiles];
      emptyIndex = tiles.indexOf(null);

      // Perform a large number of random valid moves to shuffle the puzzle
      const numShuffles = 1000; // Number of random moves to perform
      for (let i = 0; i < numShuffles; i++) {
        const possibleMoves = getPossibleMoves();
        const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        moveTile(randomMove, false); // Move without updating the move counter
      }

      // Check solvability
      const solvable = isSolvable(tiles, goalTiles, 4);
      if (!solvable) {
        puzzleContainer.parentElement.classList.add('unsolvable');
        counter.textContent = `Moves: ${moveCount}/80`; // Remove "S" or "U"
      } else {
        puzzleContainer.parentElement.classList.remove('unsolvable');
        counter.textContent = `Moves: ${moveCount}/80`;
      }

      moveCount = 0; // Reset move counter
      renderPuzzle();
      message.textContent = '';
      enablePuzzle(); // Enable the puzzle after shuffling
      hideShuffleAgainButton(); // Hide the "Shuffle Again" button
      resetBoardColor(); // Reset board color to light gray
    }

    // Get possible moves (indices of tiles that can move into the empty space)
    function getPossibleMoves() {
      const moves = [];
      const row = Math.floor(emptyIndex / 4);
      const col = emptyIndex % 4;

      // Check tile above
      if (row > 0) moves.push(emptyIndex - 4);
      // Check tile below
      if (row < 3) moves.push(emptyIndex + 4);
      // Check tile to the left
      if (col > 0) moves.push(emptyIndex - 1);
      // Check tile to the right
      if (col < 3) moves.push(emptyIndex + 1);

      return moves;
    }

    // Move a tile into the empty space (without updating the move counter)
    function moveTile(index, updateCounter = true) {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const emptyRow = Math.floor(emptyIndex / 4);
      const emptyCol = emptyIndex % 4;

      // Check if the clicked tile is adjacent to the empty space
      if ((Math.abs(row - emptyRow) === 1 && col === emptyCol) || (Math.abs(col - emptyCol) === 1 && row === emptyRow)) {
        // Swap the tile with the empty space
        [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
        emptyIndex = index;

        if (updateCounter) {
          moveCount++; // Increment move counter
          counter.textContent = `Moves: ${moveCount}/80`;
        }

        renderPuzzle();

        // Check if the puzzle is solved
        if (isSolved()) {
          const score = calculateScore();
          message.textContent = `Congratulations! You solved the puzzle! Score: ${score}%`;
          puzzleContainer.parentElement.classList.add('success'); // Turn board green
          showShuffleAgainButton(); // Show the "Shuffle Again" button
          disablePuzzle(); // Disable the puzzle after solving
        }
      }
    }

    // Check if the puzzle is solved
    function isSolved() {
      for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] !== goalTiles[i]) return false;
      }
      return true;
    }

    // Calculate the score as a percentage
    function calculateScore() {
      const minMoves = 80; // Minimum number of moves required to solve the puzzle
      const score = (minMoves / moveCount) * 100;
      return Math.round(score); // Round to the nearest integer
    }

    // Change level based on dropdown selection
    function changeLevel() {
      currentLevel = parseInt(levelDropdown.value);
      goalTiles = levels[currentLevel];
      initializePuzzle();
      shuffleTiles();
    }

    // Disable the puzzle
    function disablePuzzle() {
      puzzleContainer.classList.add('disabled');
    }

    // Enable the puzzle
    function enablePuzzle() {
      puzzleContainer.classList.remove('disabled');
    }

    // Show the "Shuffle Again" button
    function showShuffleAgainButton() {
      shuffleAgainButton.style.display = 'block';
    }

    // Hide the "Shuffle Again" button
    function hideShuffleAgainButton() {
      shuffleAgainButton.style.display = 'none';
    }

    // Reset board color to blue
    function resetBoardColor() {
      puzzleContainer.parentElement.classList.remove('success', 'unsolvable');
    }

    // Event listener for the "Shuffle Again" button
    shuffleAgainButton.addEventListener('click', () => {
      shuffleTiles();
      hideShuffleAgainButton();
    });

    // Expose the inner function to the global scope
    window.changeLevel=changeLevel;

    // Start the game
    initializePuzzle();
}

// Digital Dice Code
function loadDigitalDice(){
	const dice1 = document.getElementById('dice1');
	const dice2 = document.getElementById('dice2');
	const rollButton = document.getElementById('roll-button');
	const diceCountRadios = document.querySelectorAll('input[name="diceCount"]');

let diceCount = 1;

diceCountRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    diceCount = parseInt(radio.value);
    if (diceCount === 1) {
      dice2.style.display = 'none';
    } else {
      dice2.style.display = 'flex';
    }
  });
});

rollButton.addEventListener('click', () => {
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  const diceFaces = ['&#x2680;', '&#x2681;', '&#x2682;', '&#x2683;', '&#x2684;', '&#x2685;'];
  dice1.innerHTML = diceFaces[roll1 - 1];
  if(roll1 === 6){
    dice1.classList.add('red-dot');
  } else {
    dice1.classList.remove('red-dot');
  }

  if (diceCount === 2) {
    dice2.innerHTML = diceFaces[roll2 - 1];
    if(roll2 === 6){
      dice2.classList.add('red-dot');
    } else {
      dice2.classList.remove('red-dot');
    }
  }

  dice1.classList.add('shake');
  if (diceCount === 2) {
    dice2.classList.add('shake');
  }

  setTimeout(() => {
    dice1.classList.remove('shake');
    dice1.classList.remove('red-dot');
    if (diceCount === 2) {
      dice2.classList.remove('shake');
      dice2.classList.remove('red-dot');
    }
  }, 100);
});
}	
		