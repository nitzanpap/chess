class PawnPiece extends Piece {
    constructor(row, col, type, color) {
        super(row, col, type, color)
        this.isOnFirstMove = true
        this.pawnDirectionFactor = this.color === "White" ? 1 : -1
    }
    madeFirstMove() {
        this.isOnFirstMove = false
    }
}
