window.addEventListener("load", () => {
    const BOARD_SIZE = 8
    const ASCII_NUM_OF_A = 65
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
        for (let i = BOARD_SIZE; i >= 1; i--) {
            const row = document.createElement("tr")
            row.className = "row"
            row.id = "row" + i + ""
            boardContainer.appendChild(row)
            // Create and draw table cells
            for (let j = 1; j <= BOARD_SIZE; j++) {
                const col = document.createElement("td")
                col.classList = "col col" + j
                row.appendChild(col)
            }
        }
    }

    /**
     * This function creates and draws the chess pieces
     */
    function createPieces() {
        for (let i = 1; i <= 2; i++) {
            let row = document.querySelector("#row" + i)
            for (let j = 1; j <= BOARD_SIZE; j++) {
                // Special pieces row
                if (i === 1) {
                    // White row
                    const tile = row.querySelector(".col" + j)
                    const piece = document.createElement("img")
                    tile.appendChild(piece)
                    if (j === 1 || j === 8) piece.src = "imgs/pieces/white/rookW.png"
                    else if (j === 2 || j === 7) piece.src = "imgs/pieces/white/knightW.png"
                    else if (j === 3 || j === 6) piece.src = "imgs/pieces/white/bishopW.png"
                    else if (j === 4) piece.src = "imgs/pieces/white/queenW.png"
                    else if (j === 5) piece.src = "imgs/pieces/white/kingW.png"
                }
                // Pawns row
                if (i === 2) {
                    // White row
                    const tile = row.querySelector(".col" + j)
                    console.log(tile)
                    const piece = document.createElement("img")
                    piece.src = "imgs/pieces/white/pawnW.png"
                    tile.appendChild(piece)
                }
            }
            row = document.querySelector("#row" + (BOARD_SIZE + 1 - i))
            for (let j = 1; j <= BOARD_SIZE; j++) {
                // Special pieces row
                if (i === 1) {
                    // Black row
                    const tile = row.querySelector(".col" + j)
                    const piece = document.createElement("img")
                    tile.appendChild(piece)
                    if (j === 1 || j === 8) piece.src = "imgs/pieces/black/rookB.png"
                    else if (j === 2 || j === 7) piece.src = "imgs/pieces/black/knightB.png"
                    else if (j === 3 || j === 6) piece.src = "imgs/pieces/black/bishopB.png"
                    else if (j === 4) piece.src = "imgs/pieces/black/queenB.png"
                    else if (j === 5) piece.src = "imgs/pieces/black/kingB.png"
                }
                // Pawns row
                if (i === 2) {
                    // Black row
                    const tile = row.querySelector(".col" + j)
                    console.log(tile)
                    const piece = document.createElement("img")
                    piece.src = "imgs/pieces/black/pawnB.png"
                    tile.appendChild(piece)
                }
            }
        }
    }

    // Main app
    drawGame()
})
