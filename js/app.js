const BOARD_SIZE = 8
const ASCII_NUM_OF_A = 65

const WHITE_PLAYER = "White"
const BLACK_PLAYER = "Black"

const PAWN = "pawn"
const ROOK = "rook"
const KNIGHT = "knight"
const BISHOP = "bishop"
const KING = "king"
const QUEEN = "queen"

const messageBox = document.querySelector(".message-box")
let currentColorTurn = WHITE_PLAYER
const board = [[], [], [], [], [], [], [], []]
let tileSelected = undefined
let madeAMove = false
let table
let endGame = false

runMainGameLoop()

function runMainGameLoop() {
    createBoard()
    createPieces()
}

// This function creates and draws the chess board
function createBoard() {
    // Create and draw board-container table
    const body = document.querySelector("body")
    table = document.createElement("table")
    table.className = "board-container"
    body.appendChild(table)

    // Create and draw table rows
    for (let i = 0; i <= BOARD_SIZE - 1; i++) {
        const tr = document.createElement("tr")
        tr.className = "tr"
        tr.id = "tr" + i + ""
        table.appendChild(tr)
        // Create and draw table cells
        for (let j = 0; j <= BOARD_SIZE - 1; j++) {
            const td = document.createElement("td")
            td.classList = "tdRow" + i + " tdCol" + j
            td.id = "td" + (j + i * BOARD_SIZE)
            tr.appendChild(td)
            // Add piece to board array
            addNewPieceToBoardArray(i, j, "e", "e")
            td.addEventListener("click", () => {
                if (!endGame) handleTileClick(td)
            })
        }
    }
    console.log(board)
}

function addNewPieceToBoardArray(i, j, type, color) {
    if (type === PAWN) {
        board[i][j] = new PawnPiece(i, j, type, color)
    } else if (type === KING) {
        board[i][j] = new KingPiece(i, j, type, color)
    } else if (type === ROOK) {
        board[i][j] = new RookPiece(i, j, type, color)
    } else board[i][j] = new Piece(i, j, type, color)
}

function createPieces() {
    // Draw two special rows
    for (let i = 0; i <= 1; i++) {
        let tr = document.querySelector("#tr" + i)
        let tileColor = "White"
        // Runs twice - Once for the white pieces, and once for the black pieces
        for (let k = 1; k <= 2; k++) {
            // k alternates between creating the white and black pieces
            if (k === 2) {
                tileColor = "Black"
                tr = document.querySelector("#tr" + (BOARD_SIZE - 1 - i))
            }
            for (let j = 0; j <= BOARD_SIZE - 1; j++) {
                const tdCol = tr.querySelector(".tdCol" + j)
                let pieceType
                // Special pieces row
                if (i === 0) {
                    // Add rook
                    if (j === 0 || j === 7) pieceType = ROOK
                    // Add knight
                    else if (j === 1 || j === 6) pieceType = KNIGHT
                    // Add bishop
                    else if (j === 2 || j === 5) pieceType = BISHOP
                    // Add queen
                    else if (j === 3) pieceType = QUEEN
                    // Add king
                    else if (j === 4) pieceType = KING
                }
                // Pawns row
                if (i === 1) pieceType = PAWN
                // Add pieces to board array
                if (k === 1) addNewPieceToBoardArray(i, j, pieceType, tileColor)
                else addNewPieceToBoardArray(BOARD_SIZE - 1 - i, j, pieceType, tileColor)
                // Draw pieces on the screen
                drawPieceInit(tdCol, pieceType, tileColor)
            }
        }
    }
}

function getPieceFromTile(tile) {
    return board[Math.floor(tile.id.slice(2) / 8)][tile.id.slice(2) % 8]
}

function getTileFromPiece(piece) {
    return document.querySelector("#td" + (piece.row * 8 + piece.col))
}

function drawPieceInit(tile, type, tileColor) {
    const piece = document.createElement("img")
    piece.className += "chess-piece " + type
    piece.src = "imgs/pieces/" + type + tileColor + ".png"
    tile.appendChild(piece)
}

// Handles a click on a tile on the board
function handleTileClick(tile) {
    let piece = getPieceFromTile(tile)

    // Click on a current player's piece
    if (piece.color === currentColorTurn) {
        selectTileClick(tile)
        showPossibleMoves(piece)
    }
    // A piece was selected previously
    else if (tileSelected !== undefined) {
        let previousPiece = getPieceFromTile(tileSelected)
        const rowFrom = tileSelected.classList[0].slice(5)
        const colFrom = tileSelected.classList[1].slice(5)
        if (isValidMove(tileSelected, tile)) {
            let actionMade
            messageBox.innerText = ""
            // Empty tile clicked
            if (piece.color === "e") {
                actionMade = "move"
            }
            // Opposite player's tile clicked
            else {
                // a king has been captured
                if (piece.type === KING) {
                    actionMade = "checkmate"
                    endGame = true
                    // a different piece has been captured
                } else {
                    actionMade = "capture"
                }
                erasePieceFromTile(tile)
            }
            // Update board array
            movePiece(rowFrom, colFrom, piece.row, piece.col)
            // Update board screen
            updateMessageBox(actionMade, previousPiece, piece)
            drawPieceOnTile(tile)

            selectTileClick(tile)
            switchTurn()
        }
    }
}

function updateMessageBox(event, piece1, piece2 = undefined) {
    messageBox.innerText = ""
    messageBox.className = "message-box"
    if (event === "capture") {
        messageBox.innerText =
            piece1.color + " " + piece1.type + " Captured " + piece2.color + " " + piece2.type + "!"
        messageBox.classList.add("message-box-capture")
    } else if (event === "move") {
        messageBox.innerText =
            piece1.color +
            " " +
            piece1.type +
            " moved to " +
            coordinateToChessCoordinate(piece1.row, piece1.col)
    }
    if (event === "castle") {
        messageBox.innerText = piece1.color + " player has castled"
        messageBox.classList.add("message-box-check")
    }
    if (event === "check") {
        messageBox.innerText = "Check on " + piece1.color + " player king!"
        messageBox.classList.add("message-box-check")
    }
    if (event === "checkmate") {
        messageBox.innerText = "Checkmate! " + piece1.color + " player Won!"
        messageBox.classList.add("message-box-checkmate")
    }
}
function coordinateToChessCoordinate(row, col) {
    return String.fromCharCode(ASCII_NUM_OF_A + row) + col
}

function selectTileClick(tile) {
    // Remove any previous selected tiles and rest tileSelected
    if (tileSelected != undefined) {
        removeSelectedTile()
    }
    // Select the given tile and update tileSelected accordingly
    tileSelected = tile
    tile.classList.add("selected-tile")
}

function removeSelectedTile() {
    tileSelected.classList.remove("selected-tile")
    tileSelected = undefined
}
function showPossibleMoves(piece) {
    // Clear all previous possible moves
    removePossibleMoves()
    let possibleMoves = piece.getPossibleMoves(board)
    for (let possibleMove of possibleMoves) {
        const tile = getTileFromPiece(board[possibleMove[0]][possibleMove[1]])
        tile.classList.add("possible-move")
    }
}

function removePossibleMoves() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            table.rows[i].cells[j].classList.remove("possible-move")
            table.rows[i].cells[j].classList.remove("threatend")
            board[i][j].threatend = false
            if (board[i][j].type === KING) board[i][j].inCheck = false
        }
    }
}

// TODO: Refactor this function to include all, or at least most, of the move validations.
function isValidMove(tileSelected, tile) {
    if (madeAMove || [...tile.classList].indexOf("possible-move") === -1) return false
    return true
}
function movePiece(rowFrom, colFrom, rowTo, colTo) {
    board[rowTo][colTo] = board[rowFrom][colFrom]
    board[rowFrom][colFrom] = new Piece(Number(rowFrom), Number(colFrom), "e", "e")
    board[rowTo][colTo].setRowAndColumn(rowTo, colTo)
    // Print what piece moved, and where did it move to
    madeAMove = true
    let piece = board[rowTo][colTo]
    // Check pawn's special first double move
    if (piece.type === PAWN) piece.madeFirstMove()
}

function erasePieceFromTile(tile) {
    tile.removeChild(tile.children[0])
}

function drawPieceOnTile(tile) {
    tile.appendChild(tileSelected.children[0])
}

function switchTurn() {
    removeSelectedTile()
    removePossibleMoves()
    currentColorTurn = currentColorTurn === "White" ? "Black" : "White"
    tileSelected = undefined
    madeAMove = false
}

function isWithinBounds(i, j) {
    return i >= 0 && i <= 7 && j >= 0 && j <= 7
}
