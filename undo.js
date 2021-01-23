'use strict'

function undo() {

    if (!gUserOperations.length || !gGame.isOn || gIsGodMode) return

    var lastOperation = gUserOperations[gUserOperations.length - 1]
    undoOperation(lastOperation)
}

function undoOperation(operation) {

    undoHints(operation)
    undoSafeButton(operation)

    if (operation.cell.isMarked) {
        undoFlag(operation)
        return
    }

    if (operation.cell.isMine) {
        undoMine(operation)
        return
    }

    var expandedCells = operation.expandedCells
    if (!expandedCells.length) {
        undoSingleCell(operation)
        return
    }

    undoExpandedCells(expandedCells)

}


function getIdByPosition(pos) {
    return document.getElementById(`${pos.i},${pos.j}`)
}

function undoFlag(operation) {
    var isMarked = gBoard[operation.cell.pos.i][operation.cell.pos.j].isMarked
    gBoard[operation.cell.pos.i][operation.cell.pos.j].isMarked = !isMarked

    var elCell = getIdByPosition({ i: operation.cell.pos.i, j: operation.cell.pos.j })
    elCell.innerText = ""

    // renderBoard()
    gUserOperations.pop()
}

function undoMine(operation) {
    gBoard[operation.cell.pos.i][operation.cell.pos.j].isShown = false
    gUserLives++

    var elCell = getIdByPosition({ i: operation.cell.pos.i, j: operation.cell.pos.j })
    elCell.innerText = ""
    elCell.classList.remove("bomb")

    renderLives()
    // renderBoard()
    gUserOperations.pop()
}


function undoHints(operation) {
    gUserHints = operation.hints
    renderHints()
}

function undoSafeButton(operation) {
    gSafeButtonClicks = operation.safe
    renderAvailableClicks()
}

function undoSingleCell(operation) {
    gBoard[operation.cell.pos.i][operation.cell.pos.j].isShown = false


    var elCell = getIdByPosition({ i: operation.cell.pos.i, j: operation.cell.pos.j })
    elCell.innerText = ""
    elCell.classList.remove("expand")


    // renderBoard()
    gUserOperations.pop()
}


function undoExpandedCells(expandedCells) {
    for (var i = 0; i < expandedCells.length; i++) {
        var row = expandedCells[i].pos.i
        var col = expandedCells[i].pos.j
        gBoard[row][col].isShown = false

        var elCell = getIdByPosition({ i: row, j: col })
        elCell.innerText = ""
        elCell.classList.remove("expand")

        console.log(expandedCells[i].originPos)
    }

    gBoard[expandedCells[0].originPos.i][expandedCells[0].originPos.j].isShown = false
    
    var elCell = getIdByPosition({ i: expandedCells[0].originPos.i, j: expandedCells[0].originPos.j })
    elCell.innerText = ""
    elCell.classList.remove("expand")

    // renderBoard()
    gUserOperations.pop()
}

function addOperation(cell, pos) {

    var operation = {}
    operation.hints = gUserHints
    operation.lives = gUserLives
    operation.safe = gSafeButtonClicks
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