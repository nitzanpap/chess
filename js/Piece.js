class Piece {
    constructor(row, col, type, color) {
        this.row = row
        this.col = col
        this.type = type
        this.color = color
        if (this.color === "e") this.opponentColor = "e"
        else this.opponentColor = color === WHITE_PLAYER ? BLACK_PLAYER : WHITE_PLAYER
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
            absoluteMoves = this.getPawnRelativeMoves()
        } else if (this.type === ROOK) {
            absoluteMoves = this.getRookRelativeMoves()
        } else if (this.type === KNIGHT) {
            absoluteMoves = this.getKnightRelativeMoves()
        } else if (this.type === BISHOP) {
            absoluteMoves = this.getBishopRelativeMoves()
        } else if (this.type === KING) {
            absoluteMoves = this.getKingRelativeMoves()
        } else if (this.type === QUEEN) {
            absoluteMoves = this.getQueenRelativeMoves()
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
    getPawnRelativeMoves(board) {
        let result = []
        // A factor that determines the vertical direction of the pawn based on it's color
        let colorFactor = this.color === WHITE_PLAYER ? 1 : -1
        let numOfMovesAllowed = this.isOnFirstMove ? 2 : 1
        this.getMovesInDirection(
            result,
            this.row + colorFactor,
            this.col,
            colorFactor,
            0,
            numOfMovesAllowed
        )
        return result
        // let result = []
        // if (this.color === WHITE_PLAYER) {
        //     result.push([this.row + 1, this.col])
        // } else result.push([this.row - 1, this.col])
        // if (this.isOnFirstMove)
        //     if (this.color === WHITE_PLAYER) {
        //         result.push([this.row + 2, this.col])
        //     } else result.push([this.row - 2, this.col])
        // return result
    }
    // TODO: Refactor this function so it can receive the initial piece's coordinate, and adds to it according to the direction.
    // TODO: Example: Instead of calling getMovesInDirection(arr,i+1,j+1,1,1), should be getMovesInDirection(arr,i,j,1,1).
    getMovesInDirection(result, i, j, rowDirection, colDirection, optionalIterLimit = -1) {
        // If optionalIterLimit has been given a value, then only run this recursive function that
        // many times.
        if (optionalIterLimit != 0) {
            // If tile is out of bounds
            if (i >= 0 && i <= 7 && j >= 0 && j <= 7) {
                // If encountered an empty tile
                if (board[i][j].color === "e") {
                    result.push([i, j])
                    this.getMovesInDirection(
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

    getRookRelativeMoves() {
        let result = []
        // First iteration calls for the relevant directions
        this.getMovesInDirection(result, this.row + 1, this.col, 1, 0)
        this.getMovesInDirection(result, this.row - 1, this.col, -1, 0)
        this.getMovesInDirection(result, this.row, this.col + 1, 0, +1)
        this.getMovesInDirection(result, this.row, this.col - 1, 0, -1)
        return result
    }

    getKnightRelativeMoves() {
        let result = []
        // First iteration calls for the relevant directions
        this.getMovesInDirection(result, this.row - 1, this.col - 2, -1, -2, 1)
        this.getMovesInDirection(result, this.row - 2, this.col - 1, -2, -1, 1)
        this.getMovesInDirection(result, this.row - 1, this.col + 2, -1, +2, 1)
        this.getMovesInDirection(result, this.row - 2, this.col + 1, -2, +1, 1)
        this.getMovesInDirection(result, this.row + 1, this.col + 2, +1, +2, 1)
        this.getMovesInDirection(result, this.row + 2, this.col + 1, +2, +1, 1)
        this.getMovesInDirection(result, this.row + 1, this.col - 2, +1, -2, 1)
        this.getMovesInDirection(result, this.row + 2, this.col - 1, +2, -1, 1)
        return result
    }

    getBishopRelativeMoves() {
        let result = []
        // First iteration calls for the relevant directions
        this.getMovesInDirection(result, this.row + 1, this.col + 1, 1, 1)
        this.getMovesInDirection(result, this.row - 1, this.col - 1, -1, -1)
        this.getMovesInDirection(result, this.row + 1, this.col - 1, 1, -1)
        this.getMovesInDirection(result, this.row - 1, this.col + 1, -1, 1)
        return result
    }

    getKingRelativeMoves() {
        let result = []
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i != 0 || j != 0)
                    this.getMovesInDirection(result, this.row + i, this.col + j, i, j, 1)
            }
        }
        return result
    }

    getQueenRelativeMoves() {
        return this.getRookRelativeMoves().concat(this.getBishopRelativeMoves())
    }
}
