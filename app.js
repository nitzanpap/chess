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
        this.threatend = false
    }

    setRowAndColumn(row, col) {
        this.row = row
        this.col = col
    }

    getPossibleMoves(board) {
        // Get relative moves
        let absoluteMoves = []
        // absoluteMoves = this.getKnightRelativeMoves()
        if (this.type === PAWN) {
            absoluteMoves = this.getPawnRelativeMoves(board, this.row, this.col)
        } else if (this.type === ROOK) {
            this.getRookRelativeMoves(board, absoluteMoves, this.row, this.col)
        } else if (this.type === KNIGHT) {
            this.getKnightRelativeMoves(board, absoluteMoves, this.row, this.col)
        } else if (this.type === BISHOP) {
            this.getBishopRelativeMoves(board, absoluteMoves, this.row, this.col)
        } else if (this.type === KING) {
            this.getKingRelativeMoves(absoluteMoves)
        } else if (this.type === QUEEN) {
            this.getQueenRelativeMoves(board, absoluteMoves, this.row, this.col)
        } else {
            console.log("Unknown type", type)
        }
        console.log("absoluteMoves", absoluteMoves)

        // Get filtered absolute moves
        let filteredMoves = []
        for (let absoluteMove of absoluteMoves) {
            const relativeRow = absoluteMove[0]
            const relativeCol = absoluteMove[1]
            if (relativeRow >= 0 && relativeRow <= 7 && relativeCol >= 0 && relativeCol <= 7) {
                filteredMoves.push(absoluteMove)
            }
        }
        console.log("filteredMoves", filteredMoves)
        return filteredMoves
    }

    // TODO: Remove all moves that colide with pieces and their consecutive moves
    // TODO: Add a special indicator for colision with an opponent's piece and display it.
    getPawnRelativeMoves(board, row, col) {
        let result = []
        result.push(this.color === WHITE_PLAYER ? [row + 1, col] : [row - 1, col])
        if (this.isOnFirstMove)
            result.push(this.color === WHITE_PLAYER ? [row + 2, col] : [row - 2, col])
        return result
    }

    getMovesInDirection(board, result, i, j, rowDirection, colDirection, optionalIterLimit = -1) {
        // If optionalIterLimit has been given a value, then only run this recursive function that
        // many times.
        if (optionalIterLimit != 0) {
            // If tile is out of bounds
            if (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                // If encountered an empty tile
                if (board[i][j].color === "e") {
                    result.push([i, j])
                    this.getMovesInDirection(
                        board,
                        result,
                        i + rowDirection,
                        j + colDirection,
                        rowDirection,
                        colDirection,
                        optionalIterLimit - 1
                    )
                }
                // If encountered an opponent piece
                else if (board[i][j].color !== this.color) {
                    console.log("Opponent's piece threatend at (" + i + ", " + j + ")")
                    result.push([i, j])
                    board[i][j].threatend = true
                }
                // If encountered an ally piece
                else {
                    console.log("Encountered an ally piece at (" + i + ", " + j + ")")
                }
            }
        }
    }

    getRookRelativeMoves(board, result) {
        // First iteration calls for the relevant directions
        this.getMovesInDirection(board, result, this.row + 1, this.col, 1, 0)
        this.getMovesInDirection(board, result, this.row - 1, this.col, -1, 0)
        this.getMovesInDirection(board, result, this.row, this.col + 1, 0, +1)
        this.getMovesInDirection(board, result, this.row, this.col - 1, 0, -1)
    }

    getKnightRelativeMoves(board, result) {
        // First iteration calls for the relevant directions
        this.getMovesInDirection(board, result, this.row - 1, this.col - 2, -1, -2, 1)
        this.getMovesInDirection(board, result, this.row - 2, this.col - 1, -2, -1, 1)
        this.getMovesInDirection(board, result, this.row - 1, this.col + 2, -1, +2, 1)
        this.getMovesInDirection(board, result, this.row - 2, this.col + 1, -2, +1, 1)
        this.getMovesInDirection(board, result, this.row + 1, this.col + 2, +1, +2, 1)
        this.getMovesInDirection(board, result, this.row + 2, this.col + 1, +2, +1, 1)
        this.getMovesInDirection(board, result, this.row + 1, this.col - 2, +1, -2, 1)
        this.getMovesInDirection(board, result, this.row + 2, this.col - 1, +2, -1, 1)
    }

    getBishopRelativeMoves(board, result) {
        // First iteration calls for the relevant directions
        this.getMovesInDirection(board, result, this.row + 1, this.col + 1, 1, 1)
        this.getMovesInDirection(board, result, this.row - 1, this.col - 1, -1, -1)
        this.getMovesInDirection(board, result, this.row + 1, this.col - 1, 1, -1)
        this.getMovesInDirection(board, result, this.row - 1, this.col + 1, -1, 1)
    }

    getKingRelativeMoves(result) {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i != 0 || j != 0)
                    this.getMovesInDirection(board, result, this.row + i, this.col + j, i, j, 1)
            }
        }
        return result
    }

    getQueenRelativeMoves(board, result) {
        // First iteration calls for the relevant directions
        // Rook's moves
        this.getRookRelativeMoves(board, result, this.row, this.col)
        // Bishop's moves
        this.getBishopRelativeMoves(board, result, this.row, this.col)
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

function getPieceFromTile(tile) {
    return board[Math.floor(tile.id.slice(2) / 8)][tile.id.slice(2) % 8]
}

function getTileFromPiece(piece) {
    return board[piece.row][piece.col]
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
            // Empty tile clicked
            if (piece.color === "e") {
            }
            // Opposite player's tile clicked
            else {
                console.log("Clicked on an opponent's piece!")
                erasePieceFromTile(tile)
            }
            // Update board array
            movePiece(rowFrom, colFrom, piece.row, piece.col)
            // Update board screen
            drawPieceOnTile(tile)
            selectTileClick(tile)

            switchTurn()
        }
    }
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
    let possibleMoves = piece.getPossibleMoves(board)
    for (let possibleMove of possibleMoves) {
        const tile = table.rows[possibleMove[0]].cells[possibleMove[1]]
        tile.classList.add("possible-move")
        getPieceFromTile(tile).threatend = false
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
function isValidMove(tileSelected, tile) {
    if (madeAMove || [...tile.classList].indexOf("possible-move") === -1) return false
    return true
}

function movePiece(rowFrom, colFrom, rowTo, colTo) {
    board[rowTo][colTo] = board[rowFrom][colFrom]
    board[rowFrom][colFrom] = new Piece(Number(rowFrom), Number(colFrom), "e", "e")
    board[rowTo][colTo].setRowAndColumn(rowTo, colTo)
    console.log(board[rowTo][colTo])
    madeAMove = true
    if (board[rowTo][colTo].type === PAWN) board[rowTo][colTo].madeFirstMove()
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
    currentColorTurn = currentColorTurn === "W" ? "B" : "W"
    tileSelected = undefined
    madeAMove = false
}
