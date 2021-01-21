
function undo() {
    // console.log(gUserOperations)
    if (!gUserOperations.length || !gGame.isOn) return
    console.log("undo")

    var lastOperation = gUserOperations[gUserOperations.length - 1]
    // console.log(lastOperation.expandedCells)
    undoOperation(lastOperation)
}

function undoOperation(operation) {


    gUserHints = operation.hints
    console.log("gUserHints", gUserHints)
    renderHints()

    if (operation.cell.isMine) {
        console.log("MIVE!!!!!!!!!!!111")
        gBoard[operation.cell.pos.i][operation.cell.pos.j].isShown = false
        gUserLives++
        renderLives()
        renderBoard()
        gUserOperations.pop()
        return
    }


    var expandedCells = operation.expandedCells
    if (!expandedCells.length) {
        console.log("not expanded!!!")
        gBoard[operation.cell.pos.i][operation.cell.pos.j].isShown = false
        renderBoard()
        gUserOperations.pop()
        return
    }


    console.log(expandedCells, "inside unto expanded cells")

    for (var i = 0; i < expandedCells.length; i++) {
        var row = expandedCells[i].pos.i
        var col = expandedCells[i].pos.j
        gBoard[row][col].isShown = false
        console.log(expandedCells[i].originPos)
    }
    gBoard[expandedCells[0].originPos.i][expandedCells[0].originPos.j].isShown = false
    renderBoard()
    gUserOperations.pop()

}

function addOperation(cell, pos, hints = gUserHints, lives = gUserLives) {

    // console.log(cell.isMine)

    var operation = {}
    operation.hints = gUserHints
    operation.lives = gUserLives
    operation.cell = {
        minesAroundCount: cell.minesAroundCount,
        isShown: cell.isShown,
        isMine: cell.isMine,
        isMarked: cell.isMarked,
        pos: { i: pos.i, j: pos.j }
    },
        operation.expandedCells = gExpendedCells


    gUserOperations.push(operation)

}