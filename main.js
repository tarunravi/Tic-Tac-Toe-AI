let cvs = document.getElementById("canvas");
let ctx = cvs.getContext("2d");

let AI = false

/*Create an empty board
  If index i is null, there is no piece there
  If index i is true, the player/AIs piece is there
  if index i is false, the opponent's piece is there

 */
let board = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];
let hasAIBeenTrained = false
// Creates an empty q table dictionary
let qTable = []

let turn = true
let reward = checkGame()
let alpha = 0.02
let gamma = 1
let generation = 0
let show = false

let win = 0
let loss = 0
let tie = 0

draw();

function draw() {
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    //Draws board with all the pieces
    drawBoard()

    // Player vs AI mechanics
    if (!AI) {
        reward = checkGame()
        if (turn && reward == 0) {
            priorBoard = JSON.parse(JSON.stringify(board)); //The prior board is used to show the Q values on board
            let moveAI = genAction(board, 0) // The AI generates a move based on the board
            makeMove(false, moveAI) // The AI makes the move
            turn = false // Turn is false, this allows the player to make a move and it prevents the AI from making an additional move
        }
        if (!turn && priorBoard != null) {
            showValues(priorBoard) // Displays the Q values
        }
    }

    // AI Training Mechanics
    if (AI) {
        let moveAI = genAction(board, 0.1) // AI generates an action
        let priorBoard = JSON.parse(JSON.stringify(board)); // The current board is saved. The board will be modified in line 65, this saves the prior board layout.

        makeMove(false, moveAI) // AI makes a move

        drawBoard() // Redraws the new board

        // Handles the terminal state mechanics
        if (checkGame() != 0) {
            reward = checkGame()
            qTable[priorBoard][moveAI[0]][moveAI[1]] = qTable[priorBoard][moveAI[0]][moveAI[1]] + alpha * (reward - qTable[priorBoard][moveAI[0]][moveAI[1]])
        } else { //Handles non terminal state mechanics
            let moveBot = genAction(revBoard(board), 0) // The AI's opponent reverses the board. And then picks the best move possible
            makeMove(true, moveBot) // The AI's opponent makes the move

            let updatedBoard = JSON.parse(JSON.stringify(board)); // We store the current board
            reward = checkGame()
            let bestMove = genAction(board, 0) // Generates the best possible action. It does not make the action. This is used to update the Q value per the Q-Learning Formula
            qTable[priorBoard][moveAI[0]][moveAI[1]] = qTable[priorBoard][moveAI[0]][moveAI[1]] + alpha * (reward + gamma * qTable[updatedBoard][bestMove[0]][bestMove[1]] - qTable[priorBoard][moveAI[0]][moveAI[1]])
        }

        // Handles end of game mechanics
        if (checkGame() != 0) {

            if (checkGame() == -1) {
                loss += 1
            }
            if (checkGame() == 1) {
                win += 1
            }
            if (checkGame() == 0.5) {
                tie += 1
            }
            board = [
                [null, null, null],
                [null, null, null],
                [null, null, null]
            ];
            generation += 1
            document.getElementById("Generation").value = "A.I Generation: " + generation
        }
    }

    ctx.restore();
    requestAnimationFrame(draw);
}

// Flips the board, turning true spots to false. This enable's the AI's opponent during training to make the best possible move
function revBoard(board) {
    let tempBoard = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    for (let rows = 0; rows < 3; rows++) {
        for (let col = 0; col < 3; col++) {
            if ((board[rows][col]) != null) {
                tempBoard[rows][col] = !(board[rows][col])
            }

        }
    }
    return tempBoard
}

// Updates the Board variable with the move
function makeMove(player, move) {
    board[move[0]][move[1]] = player
}

// Generates an action
function genAction(state, epsilon) {
    /* If this is the first time the AI has visited state s,
       it will append to the dictionary, and value each movable
       future move 0 initially.
     */
    if (qTable[state] == null) {
        qTable[state] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]

        // This loop prevents the AI from moving onto a spot that already has a token in
        for (var rows = 0; rows < 3; rows++) {
            for (var col = 0; col < 3; col++) {
                if (state[col][rows] != null) {
                    qTable[state][col][rows] = Number.NEGATIVE_INFINITY
                }
            }
        }
    }

    // Makes a random number between [0,1). If that is less than epsilon, it will just randomly pick a legal action
    let rand = Math.random()

    if (rand <= epsilon) {
        let done = false

        while (!done) {
            let row = Math.floor(Math.random() * 3)
            let col = Math.floor(Math.random() * 3)
            if (state[col][row] == null) {
                done = true
                return [col, row]
            }
        }
    } else { // If the random number is greater or equal to epsilon, it will pick the best known move

        let max = qTable[state][0][0]
        let maxRow = [0]
        let maxCol = [0]

        for (var rows = 0; rows < 3; rows++) {

            for (var col = 0; col < 3; col++) {
                if (qTable[state][col][rows] == max) {
                    maxRow.push(rows)
                    maxCol.push(col)
                }
                if (qTable[state][col][rows] > max) {
                    max = qTable[state][col][rows]
                    maxRow = [rows]
                    maxCol = [col]
                }
            }
        }

        // If 2 or more spots have the same value, the AI randomly picks one
        var index = Math.floor(Math.random() * maxCol.length)

        return [maxCol[index], maxRow[index]]
    }


}

// Draws the Board and each piece
function drawBoard() {
    // Sets the color of the tic tac toe board
    ctx.strokeStyle = "#acf4e6";
    ctx.lineWidth = (cvs.width / 30).toString()

    //Draws all the vertical lines of the board
    for (var i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cvs.width / 3, 0);
        ctx.lineTo(i * cvs.width / 3, cvs.height);
        ctx.stroke();
    }

    //Draws all the Horizontal lines of the board
    for (var i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cvs.height / 3);
        ctx.lineTo(cvs.width, i * cvs.height / 3);
        ctx.stroke();
    }

    for (var rows = 0; rows < 3; rows++) {
        for (var col = 0; col < 3; col++) {

            // Draws the player's pieces (circles)
            if (board[col][rows]) {
                ctx.strokeStyle = "#2d3e52";
                ctx.beginPath();
                // Draws the circle, the X, Y and Radius scale with the window's width/height
                ctx.arc((rows * 2 + 1) * (cvs.width / 6), (col * 2 + 1) * (cvs.height / 6), cvs.width / 10, 0, 2 * Math.PI);
                ctx.stroke();
            }

            // Draws the opponent's pieces (X)
            if (board[col][rows] == false) {
                ctx.strokeStyle = "#19bd9c";
                ctx.beginPath();
                // Draws one line of the X piece, the x and y scale with the window's width/height
                ctx.moveTo((rows * 2 + 1) * (cvs.width / 6) - cvs.width / 10, (col * 2 + 1) * (cvs.height / 6) - cvs.height / 10);
                ctx.lineTo((rows * 2 + 1) * (cvs.width / 6) + cvs.width / 10, (col * 2 + 1) * (cvs.height / 6) + cvs.height / 10);
                ctx.stroke();

                // Draws the other line of the X piece, the x and y scale with the window's width/height
                ctx.beginPath();
                ctx.moveTo((rows * 2 + 1) * (cvs.width / 6) - cvs.width / 10, (col * 2 + 1) * (cvs.height / 6) + cvs.height / 10);
                ctx.lineTo((rows * 2 + 1) * (cvs.width / 6) + cvs.width / 10, (col * 2 + 1) * (cvs.height / 6) - cvs.height / 10);
                ctx.stroke();
            }

        }
    }

}

// Checks for mouse input
cvs.addEventListener('click', event => {

    // Player can only place pieces if AI is not on
    if (!AI && !turn && checkGame() == 0) {

        let bound = cvs.getBoundingClientRect();

        let x = event.clientX - bound.left - cvs.clientLeft;
        let y = event.clientY - bound.top - cvs.clientTop;

        // Find which column the click was in
        let column = -1
        if (x < cvs.width / 3) {
            column = 0
        } else if (x > 2 * cvs.width / 3) {
            column = 2
        } else {
            column = 1
        }

        //Find what row the click was in
        let row = -1
        if (y < cvs.height / 3) {
            row = 0
        } else if (y > 2 * cvs.height / 3) {
            row = 2
        } else {
            row = 1
        }

        // It only draws the piece if its empty (null)
        if (board[row][column] == null) {
            board[row][column] = true
            turn = true
        }
    }

});

// Checks if anyone won
function checkGame() {
    let winner = null

    if ((board[0][0] == board[0][1]) && (board[0][1] == board[0][2]) && (board[0][0] != null)) {
        winner = board[0][0]
    }
    if ((board[1][0] == board[1][1]) && (board[1][1] == board[1][2]) && (board[1][0] != null)) {
        winner = board[1][0]
    }
    if ((board[2][0] == board[2][1]) && (board[2][1] == board[2][2]) && (board[2][0] != null)) {
        winner = board[2][0]
    }
    if ((board[0][0] == board[1][0]) && (board[1][0] == board[2][0]) && (board[0][0] != null)) {
        winner = board[0][0]
    }
    if ((board[0][1] == board[1][1]) && (board[1][1] == board[2][1]) && (board[0][1] != null)) {
        winner = board[0][1]
    }
    if ((board[0][2] == board[1][2]) && (board[1][2] == board[2][2]) && (board[0][2] != null)) {
        winner = board[0][2]
    }

    if ((board[0][0] == board[1][1]) && (board[1][1] == board[2][2]) && (board[0][0] != null)) {
        winner = board[0][0]
    }

    if ((board[2][0] == board[1][1]) && (board[1][1] == board[0][2]) && (board[2][0] != null)) {
        winner = board[2][0]
    }

    /*
    If winner is Player or AI, the reward is +1
    If winner is Opponent, the reward is -1
    if no one won, the reward is 0
    */

    let reward = 0
    switch (winner) {
        case true:
            reward = -1
            break;
        case false:
            reward = 1
            break;
    }

    let empty = true
    if (reward == 0) {
        for (var rows = 0; rows < 3; rows++) {
            for (var col = 0; col < 3; col++) {
                if (board[rows][col] == null) {
                    empty = false
                }

            }
        }
        if (empty) {
            reward = 0.5
        }
    }

    return reward
}

// Resizes canvas elements for any device size
function resizeCanvas() {
    var canvas = document.getElementById("canvas");

    if (window.innerHeight > window.innerWidth) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = window.innerWidth * 0.9;
    } else {
        canvas.width = window.innerHeight * 0.9;
        canvas.height = window.innerHeight * 0.9;
    }

}

// Controls the bottom button mechanics
function playAI() {
    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    AI = false

    document.getElementById("playAI").value = "Reset Game"
    document.getElementById("trainAi").className = "button";
    if (hasAIBeenTrained == true) {
        document.getElementById("trainAi").value = "Continue Training A.I."
    } else {
        document.getElementById("trainAi").value = "Train A.I."
    }
    turn = true
}

function trainAI() {

    board = [
        [null, null, null],
        [null, null, null],
        [null, null, null]
    ];
    turn = true
    AI = true

    document.getElementById("trainAi").value = "A.I. Is Training"
    document.getElementById("trainAi").className = "button2";
    document.getElementById("playAI").value = "Play A.I."
    hasAIBeenTrained = true
}

function enableValues() {
    if (document.getElementById("showVal").value == "Show Values") {
        show = true
        document.getElementById("showVal").value = "Hide Values"
    } else {
        show = false
        document.getElementById("showVal").value = "Show Values"
    }
}

function showValues(board) {
    if (show) {
        ctx.fillStyle = "#2d3e52";
        let fontSize = cvs.width / 35
        ctx.font = fontSize + "px Arial";


        for (let r = 1; r < 4; r++) {
            for (let c = 1; c < 4; c++) {
                let qValue = (("          ") + (qTable[board][c - 1][r - 1] + "").slice(0, 9)).slice(-9)

                ctx.fillText(qValue, r * (cvs.width / 3) - 150, c * (cvs.height / 3) - 25);

            }
        }
    }

}
