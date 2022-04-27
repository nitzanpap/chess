class KingPiece extends Piece {
    constructor(row, col, type, color) {
        super(row, col, type, color)
        this.isOnFirstMove = true
        this.inCheck = false
        this.castled = false
    }
    madeFirstMove() {
        this.isOnFirstMove = false
    }
}
