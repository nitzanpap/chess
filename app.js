const BOARD_SIZE = 8
const ASCII_NUM_OF_A = 65

class Piece {
    constructor(row, col, type, color) {
        this.row = row
        this.col = col
        this.type = type
        this.color = color
    }
}

let colorTurn = "W"
let board = [[], [], [], [], [], [], [], []]

runMainGameLoop()

function runMainGameLoop() {
    createBoard()
    createPieces()
}

// This function creates and draws the chess board
function createBoard() {
    // Create and draw board-container table
    const body = document.querySelector("body")
    const boardContainer = document.createElement("table")
    boardContainer.className = "board-container"
    body.appendChild(boardContainer)

    // Create and draw table rows
    for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        const tr = document.createElement("tr")
        tr.className = "tr"
        tr.id = "tr" + i + ""
        boardContainer.appendChild(tr)
        // Create and draw table cells
        for (let j = 0; j <= BOARD_SIZE - 1; j++) {
            const td = document.createElement("td")
            td.classList = "tdRow" + i + " tdCol" + j
            td.id = "td" + (j + i * BOARD_SIZE)
            tr.appendChild(td)
            // Add piece to board array
            addNewPieceToBoardArray(i, j, "e", "e")
            td.addEventListener("click", () => {
                handleTileClick(td)
            })
        }
    }
    console.log(board)
}

function addNewPieceToBoardArray(i, j, type, color) {
    board[i][j] = new Piece(i, j, type, color)
}

function createPieces() {
    // Draw two special rows
    for (let i = 0; i <= 1; i++) {
        let tr = document.querySelector("#tr" + i)
        let tileColor = "W"
        // Runs twice - Once for the white pieces, and once for the black pieces
        for (let k = 1; k <= 2; k++) {
            // k alternates between creating the white and black pieces
            if (k === 2) {
                tileColor = "B"
                tr = document.querySelector("#tr" + (BOARD_SIZE - 1 - i))
            }
            for (let j = 0; j <= BOARD_SIZE - 1; j++) {
                const tdCol = tr.querySelector(".tdCol" + j)
                let pieceType
                // Special pieces row
                if (i === 0) {
                    // Add rook
                    if (j === 0 || j === 7) pieceType = "rook"
                    // Add knight
                    else if (j === 1 || j === 6) pieceType = "knight"
                    // Add bishop
                    else if (j === 2 || j === 5) pieceType = "bishop"
                    // Add queen
                    else if (j === 3) pieceType = "queen"
                    // Add king
                    else if (j === 4) pieceType = "king"
                }
                // Pawns row
                if (i === 1) pieceType = "pawn"
                drawPieceInit(tdCol, pieceType, tileColor)
                // Add pieces to board array
                if (k === 1) addNewPieceToBoardArray(i, j, pieceType, tileColor)
                else addNewPieceToBoardArray(BOARD_SIZE - 1 - i, j, pieceType, tileColor)
            }
        }
    }
}

function drawPieceInit(tile, type, tileColor) {
    const piece = document.createElement("img")
    piece.className += "chess-piece " + type
    piece.src = "imgs/pieces/" + type + tileColor + ".png"
    tile.appendChild(piece)
}

/*

let tileSelected
let madeAMove = false

// TODO: Write all possible moves
function showPossibleMoves(piece) {
    console.log(piece)
}

// Handles a click on a tile on the board
function handleTileClick(tile) {
    let tileID = tile.id.slice(1)
    let piece = board[Math.floor(tileID / 8)][tileID % 8]

    // Click on a current player's piece
    if (piece.color === colorTurn) {
        selectTileClick(tile)
        showPossibleMoves(tile)
    }
    // Empty cell clicked
    else if (piece.color === "e") {
        // A piece was selected previously
        if (tileSelected !== undefined) {
            let tileSelectedID = tileSelected.id.slice(1)
            let rowFrom = Math.floor(tileSelectedID / 8)
            let colFrom = tileSelectedID % 8
            if (isValidMove()) {
                // Update board array
                movePiece(rowFrom, colFrom, piece.row, piece.col)
                // Update board screen
                drawPiece(tile, tileSelected)
                selectTileClick(tile)
                switchTurn()
            }
        }
    }
    // Click on an opposite player's piece
    // else {}
}

function switchTurn() {
    colorTurn = colorTurn === "W" ? "B" : "W"
    tileSelected = undefined
    madeAMove = false
}

function drawPiece(tile, tileSelected) {
    tile.appendChild(tileSelected.children[0])
}

function isValidMove() {
    if (madeAMove) return false
    return true
}

function movePiece(rowFrom, colFrom, rowTo, colTo) {
    board[rowTo][colTo] = board[rowFrom][colFrom]
    board[rowFrom][colFrom] = new Piece(rowFrom, colFrom, "e", "e")
    madeAMove = true
}

// TODO: Refactor code so that the tile selected is pulled from the board array and not from the DOM.
function selectTileClick(tile) {
    // let tileID = tile.id.slice(1)
    // let piece = board[Math.floor(tileID / 8)][tileID % 8]
    // tileSelected = document.querySelector(".selectedTile")
    if (tileSelected != null) {
        tileSelected.classList.remove("selectedTile")
    }
    tileSelected = tile
    tile.classList.add("selectedTile")
}
*/
