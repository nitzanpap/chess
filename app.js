window.addEventListener("load", () => {
    const BOARD_SIZE = 8
    const ASCII_NUM_OF_A = 65
    /**
     * This function creates and draws the chess board
     */
    function drawGame() {
        createBoard()
        // createPieces()
    }
    function createBoard() {
        // Create and draw board-container table
        const body = document.querySelector("body")
        const boardContainer = document.createElement("table")
        boardContainer.className = "board-container"
        body.appendChild(boardContainer)

        // Create and draw table rows
        for (let i = BOARD_SIZE; i >= 1; i--) {
            let row = document.createElement("tr")
            row.className = "row"
            row.id = "row" + i + ""
            boardContainer.appendChild(row)
            // Create and draw table cells
            for (let j = 1; j <= BOARD_SIZE; j++) {
                let col = document.createElement("td")
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
            const row2 = document.querySelector("#row")
            if (i === 1) {
                for (let j = 0; j < BOARD_SIZE; j++) {}
            }
        }
    }

    // Main app
    drawGame()
})
