const BOARD_SIZE = 8
const ASCII_NUM_OF_A = 65

const WHITE_PLAYER = "W"
const BLACK_PLAYER = "B"

const PAWN = "pawn"
const ROOK = "rook"
const KNIGHT = "knight"
const BISHOP = "bishop"
const KING = "king"
const QUEEN = "queen"

let currentColorTurn = WHITE_PLAYER
let board = [[], [], [], [], [], [], [], []]
let tileSelected = undefined
let madeAMove = false
let table
class Piece {
    constructor(row, col, type, color) {
        this.row = row
        this.col = col
        this.type = type
        this.color = color
    }

    setRowAndColumn(row, col) {
        this.row = row
        this.col = col
    }

    getPossibleMoves() {
        // Get relative moves
        let relativeMoves
        if (this.type === PAWN) {
            relativeMoves = this.getPawnRelativeMoves()
        } else if (this.type === ROOK) {
            relativeMoves = this.getRookRelativeMoves()
        } else if (this.type === KNIGHT) {
            relativeMoves = this.getKnightRelativeMoves()
        } else if (this.type === BISHOP) {
            relativeMoves = this.getBishopRelativeMoves()
        } else if (this.type === KING) {
            relativeMoves = this.getKingRelativeMoves()
        } else if (this.type === QUEEN) {
            relativeMoves = this.getQueenRelativeMoves()
        } else {
            console.log("Unknown type", type)
        }
        console.log("relativeMoves", relativeMoves)

        // Get absolute moves
        let absoluteMoves = []
        for (let relativeMove of relativeMoves) {
            const absoluteRow = this.row + relativeMove[0]
            const absoluteCol = this.col + relativeMove[1]
            absoluteMoves.push([absoluteRow, absoluteCol])
        }

        // Get filtered absolute moves
        let filteredMoves = []
        for (let absoluteMove of absoluteMoves) {
            const absoluteRow = absoluteMove[0]
            const absoluteCol = absoluteMove[1]
            if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                filteredMoves.push(absoluteMove)
            }
        }
        console.log("filteredMoves", filteredMoves)
        return filteredMoves
    }

    // TODO: Remove all moves that colide with pieces and their consecutive moves
    // TODO: Add a special indicator for colision with an opponent's piece and display it.
    getPawnRelativeMoves() {
        let result = []
        result.push(this.color === WHITE_PLAYER ? [1, 0] : [-1, 0])
        if (this.isOnFirstMove) {
            result.push(this.color === WHITE_PLAYER ? [2, 0] : [-2, 0])
            this.madeFirstMove()
        }
        return result
    }

    getRookRelativeMoves() {
        let result = []
        for (let i = 1; i < BOARD_SIZE; i++) {
            result.push([i, 0])
            result.push([-i, 0])
            result.push([0, i])
            result.push([0, -i])
        }
        return result
    }

    getKnightRelativeMoves() {
        let result = []
        result.push([-1, -2])
        result.push([-2, -1])
        result.push([-1, 2])
        result.push([-2, 1])
        result.push([1, 2])
        result.push([2, 1])
        result.push([1, -2])
        result.push([2, -1])
        return result
    }

    getBishopRelativeMoves() {
        let result = []
        for (let i = 1; i < BOARD_SIZE; i++) {
            result.push([i, i])
            result.push([-i, -i])
            result.push([i, -i])
            result.push([-i, i])
        }
        return result
    }

    getKingRelativeMoves() {
        let result = []
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i != 0 || j != 0) result.push([i, j])
            }
        }
        return result
    }

    getQueenRelativeMoves() {
        let result = []
        for (let i = 1; i < BOARD_SIZE; i++) {
            // Moves of a rook
            result.push([i, 0])
            result.push([-i, 0])
            result.push([0, i])
            result.push([0, -i])
            // Moves of a bishop
            result.push([i, i])
            result.push([-i, -i])
            result.push([i, -i])
            result.push([-i, i])
        }
        return result
    }
}

class PawnPiece extends Piece {
    constructor(row, col, type, color) {
        super(row, col, type, color)
        this.isOnFirstMove = true
    }
    madeFirstMove() {
        this.isOnFirstMove = false
    }
}

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
                handleTileClick(td)
            })
        }
    }
    console.log(board)
}

function addNewPieceToBoardArray(i, j, type, color) {
    board[i][j] = type === PAWN ? new PawnPiece(i, j, type, color) : new Piece(i, j, type, color)
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

function drawPieceInit(tile, type, tileColor) {
    const piece = document.createElement("img")
    piece.className += "chess-piece " + type
    piece.src = "imgs/pieces/" + type + tileColor + ".png"
    tile.appendChild(piece)
}

// Handles a click on a tile on the board
function handleTileClick(tile) {
    const tdRow = tile.classList[0].slice(5)
    const tdCol = tile.classList[1].slice(5)
    let piece = board[tdRow][tdCol]

    // Click on a current player's piece
    if (piece.color === currentColorTurn) {
        selectTileClick(tile)
        showPossibleMoves(piece)
    }
    // Empty cell clicked and a piece was selected previously
    else if (piece.color === "e" && tileSelected !== undefined) {
        const rowFrom = tileSelected.classList[0].slice(5)
        const colFrom = tileSelected.classList[1].slice(5)
        if (isValidMove()) {
            // Update board array
            movePiece(rowFrom, colFrom, piece.row, piece.col)
            // Update board screen
            drawPiece(tile)
            selectTileClick(tile)

            switchTurn()
        }
    }
    // Click on an opposite player's piece
    // else {}
}
function selectTileClick(tile) {
    // Remove any previous selected tiles and rest tileSelected
    if (tileSelected != undefined) {
        removeSelectedTile()
        tileSelected = undefined
    }
    // Select the given tile and update tileSelected accordingly
    tileSelected = tile
    tile.classList.add("selected-tile")
}

function removeSelectedTile() {
    tileSelected.classList.remove("selected-tile")
}
function showPossibleMoves(piece) {
    // Clear all previous possible moves
    removePossibleMoves()
    let possibleMoves = piece.getPossibleMoves()
    for (let possibleMove of possibleMoves) {
        const cell = table.rows[possibleMove[0]].cells[possibleMove[1]]
        cell.classList.add("possible-move")
    }
}

function removePossibleMoves() {
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            table.rows[i].cells[j].classList.remove("possible-move")
        }
    }
}

// TODO: Refactor this function to include all, or at least most, of the move validations.
function isValidMove() {
    if (madeAMove) return false
    return true
}

function movePiece(rowFrom, colFrom, rowTo, colTo) {
    board[rowTo][colTo] = board[rowFrom][colFrom]
    board[rowFrom][colFrom] = new Piece(Number(rowFrom), Number(colFrom), "e", "e")
    board[rowTo][colTo].setRowAndColumn(rowTo, colTo)
    console.log(board[rowTo][colTo])
    madeAMove = true
}

function drawPiece(tile) {
    tile.appendChild(tileSelected.children[0])
}

function switchTurn() {
    removeSelectedTile()
    removePossibleMoves()
    currentColorTurn = currentColorTurn === "W" ? "B" : "W"
    tileSelected = undefined
    madeAMove = false
}
// Code to check if the selected tile's piece is the same as piece in the pieces array:
// board[i][j] === board[Math.floor(tileSelected.id.slice(2)/8)][tileSelected.id.slice(2) % 8]
