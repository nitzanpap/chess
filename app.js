window.addEventListener("load", () => {
    const BOARD_COL_SIZE = 8
    const BOARD_ROW_SIZE = 8
    /**
     * This function creates and draws the chess board
     */
    function createAndDrawBoard() {
        // Create and draw board-container table
        const body = document.querySelector("body")
        const boardContainer = document.createElement("table")
        boardContainer.className = "board-container"
        body.appendChild(boardContainer)

        // Create and draw table rows
        for (let i = 0; i < BOARD_ROW_SIZE; i++) {
            let row = document.createElement("tr")
            row.className = "row"
            row.id = "row" + (i + 1)
            boardContainer.appendChild(row)
            // Create and draw table cells
            for (let j = 0; j < BOARD_COL_SIZE; j++) {
                let col = document.createElement("td")
                col.classList = "col col" + (i + 1)
                row.appendChild(col)
            }
        }
    }
    // Main app
    createAndDrawBoard()
})
