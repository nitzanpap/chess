class PawnPiece extends Piece {
    constructor(row, col, type, color) {
        super(row, col, type, color)
        this.isOnFirstMove = true
    }
    madeFirstMove() {
        this.isOnFirstMove = false
    }
}
