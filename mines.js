'use strict'

//random mines location on board
function randomizeMines() {

    for (var i = 0; i < gLevel.mines; i++) {

        var rndI = getRandomInt(0, gLevel.size)
        var rngJ = getRandomInt(0, gLevel.size)
        var isMine = gBoard[rndI][rngJ].isMine

        //prevent 2 mines on same spot
        while (isMine) {
            rndI = getRandomInt(0, gLevel.size)
            rngJ = getRandomInt(0, gLevel.size)
            isMine = gBoard[rndI][rngJ].isMine
        }

        var cell = gBoard[rndI][rngJ]
        console.log({ rndI, rngJ })
        cell.isMine = true
    }



    console.log(gBoard)

}

//random Single mine location on board(run if first click is mine)
function randomizeMine(pos) {

    var isMine = true
    var cell = null

    //TOOD: more efficent while, get rid of isMine bool
    while (isMine) {
        var rndI = getRandomInt(0, gLevel.size)
        var rngJ = getRandomInt(0, gLevel.size)
        if (rndI === pos.i && rngJ === pos.j) continue
        cell = gBoard[rndI][rngJ]
        if (!cell.isMine) isMine = false
    }

    cell.isMine = true
}


// Count mines around each cell
// and set the cell's
// minesAroundCount.
function setMinesNegsCount(board) {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {

            var cell = gBoard[i][j]
            if (gBoard[i][j].isMine) continue

            var cellNegsCnt = countNegs({ i, j })
            cell.minesAroundCount = cellNegsCnt

        }
    }
    // renderBoard()
}



function countNegs(pos) {
    var count = 0
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            if (currCell.isMine) count++
        }
    }
    return count
}



//reveal mines on lose
function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                console.log(cell.isMine)
                cell.isMarked = false
                cell.isShown = true
                var elCell = document.getElementById(`${i},${j}`)
                console.log("Revelaing...")
                elCell.innerText = MINE
                elCell.classList.add("bomb")
            }
        }
    }

    // renderBoard() //TODO: Reduce unnecessary rendering
}


//change location on first click if it's a mine
function changeMineLocation(elCell, i, j) {
    randomizeMine({ i, j })
    gBoard[i][j].isMine = false
    setMinesNegsCount()
}
