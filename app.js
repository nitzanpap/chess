const BOARD_SIZE = 8
const ASCII_NUM_OF_A = 65

let tileSelected
let board = [[], [], [], [], [], [], [], []]

/**
 * This function creates and draws the chess board
 */
function drawGame() {
    createBoard()
    createPieces()
}
function createBoard() {
    // Create and draw board-container table
    const body = document.querySelector("body")
    const boardContainer = document.createElement("table")
    boardContainer.className = "board-container"
    body.appendChild(boardContainer)

    // Create and draw table rows
    for (let i = BOARD_SIZE - 1; i >= 0; i--) {
        const row = document.createElement("tr")
        row.className = "row"
        row.id = "row" + i + ""
        boardContainer.appendChild(row)
        // Create and draw table cells
        for (let j = 0; j <= BOARD_SIZE - 1; j++) {
            const tile = document.createElement("td")
            tile.classList = "tile col" + j
            // tile.id = "tileNo" + (j + (i - 1) * BOARD_SIZE)
            tile.id = "tileNo" + (j + i * BOARD_SIZE)
            row.appendChild(tile)
            // Add piece to board array
            board[i][j] = "e"
        }
    }
    console.log(board)
}

/**
 * This function creates and draws the chess pieces
 */
function createPieces() {
    // Draw two special rows
    for (let i = 0; i <= 1; i++) {
        let row = document.querySelector("#row" + i)
        let tileColor = "W"
        // Runs twice - Once for the white pieces, and once for the black pieces
        for (let k = 1; k <= 2; k++) {
            // k alternates between creating the white and black pieces
            if (k === 2) {
                tileColor = "B"
                row = document.querySelector("#row" + (BOARD_SIZE - 1 - i))
            }
            for (let j = 0; j <= BOARD_SIZE - 1; j++) {
                const tile = row.querySelector(".col" + j)
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
                drawPiece(tile, pieceType, tileColor)
                if (k === 1) addPieceToBoardArray(i, j, pieceType, tileColor)
                else addPieceToBoardArray(BOARD_SIZE - 1 - i, j, pieceType, tileColor)
            }
        }
    }
}

function addPieceToBoardArray(row, col, pieceType, color) {
    board[row][col] = pieceType + color
}

function drawPiece(tile, type, tileColor) {
    const piece = document.createElement("img")
    piece.className += "chess-piece " + type
    piece.src = "imgs/pieces/" + type + tileColor + ".png"
    tile.appendChild(piece)
}

function selectTileClick(tile) {
    tileSelected = document.querySelector(".selectedTile")
    if (tileSelected != null) {
        tileSelected.classList.remove("selectedTile")
    }
    tileSelected = tile
    tile.classList.add("selectedTile")
    console.log(tile)
}

// Main app
drawGame()

const tiles = Array.from(document.querySelectorAll(".tile"))

tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
        selectTileClick(tile)
    })
})
