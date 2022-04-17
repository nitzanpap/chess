window.addEventListener("load", () => {
    const BOARD_SIZE = 8
    const ASCII_NUM_OF_A = 65

    let tileSelected

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
                const tile = document.createElement("td")
                tile.classList = "tile tile" + j
                tile.id = "tileNo" + (j + (i - 1) * BOARD_SIZE)
                row.appendChild(tile)
            }
        }
    }

    /**
     * This function creates and draws the chess pieces
     */
    function createPieces() {
        // Draw two special rows
        for (let i = 1; i <= 2; i++) {
            let row = document.querySelector("#row" + i)
            let tileColor = "W"
            // Runs twice - Once for the white pieces, and once for the black pieces
            for (let k = 1; k <= 2; k++) {
                // k alternates between creating the white and black pieces
                if (k === 2) {
                    tileColor = "B"
                    row = document.querySelector("#row" + (BOARD_SIZE + 1 - i))
                }
                for (let j = 1; j <= BOARD_SIZE; j++) {
                    const tile = row.querySelector(".tile" + j)
                    const piece = document.createElement("img")
                    // Special pieces row
                    if (i === 1) {
                        piece.classList.add("chess-piece")
                        // Add rook
                        if (j === 1 || j === 8) {
                            piece.src = "imgs/pieces/rook" + tileColor + ".png"
                            piece.className += " rook"
                        }
                        // Add knight
                        else if (j === 2 || j === 7) {
                            piece.src = "imgs/pieces/knight" + tileColor + ".png"
                            piece.className += " knight"
                        }
                        // Add bishop
                        else if (j === 3 || j === 6) {
                            piece.src = "imgs/pieces/bishop" + tileColor + ".png"
                            piece.className += " bishop"
                        }
                        // Add queen
                        else if (j === 4) {
                            piece.src = "imgs/pieces/queen" + tileColor + ".png"
                            piece.className += " queen"
                        }
                        // Add king
                        else if (j === 5) {
                            piece.src = "imgs/pieces/king" + tileColor + ".png"
                            piece.className += " king"
                        }
                        tile.appendChild(piece)
                    }
                    // Pawns row
                    if (i === 2) {
                        piece.className += "chess-piece pawn"
                        piece.src = "imgs/pieces/pawn" + tileColor + ".png"
                        tile.appendChild(piece)
                    }
                }
            }
        }
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
})
