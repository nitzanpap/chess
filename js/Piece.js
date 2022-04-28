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
        console.log(this)
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
        return absoluteMoves
    }

    getPawnRelativeMoves() {
        let result = []
        let i = this.row + this.pawnDirectionFactor
        let j = this.col
        // Check if the next tile is empty
        if (isWithinBounds(i, j) && board[i][j].color === "e") {
            result.push([i, j])
            // If the pawn's on it's first move, check if the tile after the first one is empty
            if (this.isOnFirstMove && board[i + this.pawnDirectionFactor][j].color === "e") {
                result.push([i + this.pawnDirectionFactor, j])
            }
        }
        if (isWithinBounds(i, j + 1) && board[i][j + 1].color === this.opponentColor) {
            this.threatenThisPiece(board[i][j + 1])
            result.push([i, j + 1])
        }
        if (isWithinBounds(i, j - 1) && board[i][j - 1].color === this.opponentColor) {
            this.threatenThisPiece(board[i][j - 1])
            result.push([i, j - 1])
        }
        return result
    }

    threatenThisPiece(piece) {
        piece.threatend = true
        getTileFromPiece(piece).classList.add("threatend")
        if (piece.type === KING) piece.inCheck = true
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
                    result.push([i, j])
                    this.threatenThisPiece(board[i][j])
                }
                // If encountered an ally piece, maybe add somthing later
                else {
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
        // TODO: Code works well, but needs to be integrated.
        // Castling:
        // If the king and the rook are on their first move still, then suggest castling
        // if (
        //     this.isOnFirstMove === true &&
        //     board[this.row][0].type === ROOK &&
        //     board[this.row][0].isOnFirstMove === true &&
        //     board[this.row][this.col - 1].type === "e" &&
        //     board[this.row][this.col - 2].type === "e" &&
        //     board[this.row][this.col - 3].type === "e"
        // ) {
        //     this.castled = true
        //     result.push([this.row, this.col - 2])
        // }
        return result
    }

    getQueenRelativeMoves() {
        return this.getRookRelativeMoves().concat(this.getBishopRelativeMoves())
    }
}
