'use strict'



const MINE = "#"
const FLAG = "@"


var SmileyState = {
    Normal: "😀",
    Win: "😎",
    Lose: "🤯"
}

var gBoard
// var gCell
var gLevel = {
    size: 4,
    mines: 2
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0

} // will be implemented later, currenty the game perfectly working without it


//demo
var cell = {
    minesAroundCount: 4,
    isShown: false,
    isMine: false,
    isMarked: false
}


var gIsFirstClick
var gUserLives
var gUserHints
var gSmileyState


//when page loads
function initGame() {
    gBoard = buildBoard()
    gIsFirstClick = true
    gUserLives = 3
    gUserHints = 3
    gSmileyState = SmileyState.Normal
    console.log(gSmileyState)
    randomizeMines()
    renderBoard()
    // randomizeMines()
    renderLives()
    renderSmiley()
    renderHints()
    setMinesNegsCount()
}

//random mines location on board
function randomizeMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        var cell = gBoard[getRandomInt(0, gLevel.size)][getRandomInt(0, gLevel.size)]
        cell.isMine = true
    }
}

//random single mine location on board
function randomizeMine() {

    var isMine = true
    var cell = null

    //TOOD: more efficent while, get rid of isMine bool
    while (isMine) {
        var rndI = getRandomInt(0, gLevel.size)
        var rngJ = getRandomInt(0, gLevel.size)
        cell = gBoard[rndI][rngJ]
        if (!cell.isMine) isMine = false
    }
    cell.isMine = true
}



/**
 * 
 * Builds the board
 * Set mines at random locations
 * Call setMinesNegsCount()
 * Return the created board
 * 
 * **/
function buildBoard() {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var cell = { minesAroundCount: 0, isShown: false, isMine: false, isMarked: false }
            board[i][j] = cell
        }
    }
    // board[3][3].isMine = true
    // board[1][3].isMine = true
    console.table(board)
    return board
}

// Render the board as a <table>
// to the page
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="" >`
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]

            //TODO: Convert to switch? or more efficent approach
            //TODO: Pass data instead of ${i, j} - save code
            if (cell.isMine && cell.isMarked) {
                strHTML += `<td mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${FLAG}</td>`
            }
            else if (cell.isMine) {
                strHTML += `<td mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? "#" : ""}</td>`
            }
            else if (cell.isMarked) {
                strHTML += `<td onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`
            } else {
                strHTML += `<td onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.isShown ? cell.minesAroundCount : ""}</td>`
            }
        }
        strHTML += `</tr>`
    }

    var elCells = document.querySelector('.board');
    elCells.innerHTML = strHTML;

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
            // cell.isShown = true

            // console.log(`CNT: ${cellNegsCnt}, pos: ${i}, ${j}`)
            // console.log(cell)
        }
    }

    renderBoard()


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



// Called when a cell (td) is
// clicked
function onCellClicked(elCell, i, j, e) {


    var cell = gBoard[i][j]

    if (gIsFirstClick) {
        gIsFirstClick = false
        if (cell.isMine) changeMineLocation(elCell, i, j)
    }


    if (cell.isMarked || cell.isShown) return //prevent click on cells

    //both mine and 0 lives
    if (cell.isMine && !gUserLives) {
        onMineClicked()
        return
    } else if (cell.isMine && gUserLives) {
        gUserLives--
        !gUserLives ? onMineClicked() : renderLives()

    }

    //psuedo code 
    // if it's a mine AND user lives > 0
    // reveal the mine and cointinue play
    //problem to solve: counters on checkGameover (cell count == -2 in the end, should be 0) maybe add check if cell is mine --> continue

    cell.isShown = true

    if (!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, elCell, i, j)

    renderBoard()
    checkGameOver()
}


function onMineClicked() {
    // if (!gUserLives) {
    //     revealMine(i, j)
    //     return
    // }
    renderMessage(false)
    revealAllMines()
}

function renderMessage(isWin) {
    gSmileyState = isWin ? SmileyState.Win : SmileyState.Lose
    renderSmiley()
    var elBoard = document.querySelector('body');
    elBoard.innerHTML += `<p>${isWin ? "YOU WON" : "YOU LOST"}</p>`
}

function revealAllMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if (cell.isMine) {
                cell.isMarked = false
                cell.isShown = true
            }
        }
    }

    renderBoard() //TODO: Reduce unnecessary rendering
}

//only reveal mine when live > 0
function revealMine() {
    // gBoard[i][j].isShown = true
}


// Called on right click to mark a
// cell (suspected to be a mine)
// Search the web (and
// implement) how to hide the
// context menu on right click
function onCellMarked(elCell, i, j, e) {
    console.log("adssadsad")
    e.preventDefault()
    var cell = gBoard[i][j]
    if (cell.isShown) return //prevent click on cells
    cell.isMarked = true
    checkGameOver() // case where we reveal all the non-mines cells but we didn't marked the mines yet
    renderBoard()
}




// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    var mines = 2 //will come from gGame.minesCount later
    var cellCnt = gBoard.length * gBoard.length - mines  //same
    // console.log(cellCnt)
    // var markedCells = 0

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            if ((cell.isMine && cell.isMarked) || (cell.isMine && cell.isShown)) mines--
            else if (cell.isShown && !cell.isMine) cellCnt--
        }
    }
    console.log(cellCnt, mines)
    //TODO: prevent clicks after  message rendered.
    if (!cellCnt && !mines) renderMessage(true)
}



// When user clicks a cell with no
// mines around, we need to open
// not only that cell, but also its
// neighbors.
// NOTE: start with a basic
// implementation that only opens
// the non-mine 1
// st degree
// neighbors
// BONUS: if you have the time
// later, try to work more like the
// real algorithm (see description
// at the Bonuses section below)
function expandShown(board, elCell, i, j) {
    // console.log("herevvvv")
    expandAround({ i, j })
    renderBoard() //TODO:  render only the relevent cells!!!!
}

//TODO: Think how to merge this and the neg count func, it's basically the same function - maybe a bool that determine the purpose
function expandAround(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            currCell.isShown = true
        }
    }
}


function onLevelClicked(size) {
    switch (size) {
        case 4:
            gLevel.size = size
            gLevel.mines = 2
            initGame()
            break;
        case 8:
            gLevel.size = size
            gLevel.mines = 8
            initGame()
            break;
        case 12:
            gLevel.size = size
            gLevel.mines = 12
            initGame()
            break;

        default:
            console.log("Well, you have big problem if you are here")
            break;
    }
}

function changeMineLocation(elCell, i, j) {
    randomizeMine()
    gBoard[i][j].isMine = false
    setMinesNegsCount()
}

function renderLives() {
    var lives = ""
    switch (gUserLives) {
        case 3:
            lives = " * * * "
            break;
        case 2:
            lives = " * * "

            break;
        case 1:
            lives = " * "
            break;
        default:
            break;
    }
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = `<p>${lives} lives</p>`
}

function renderSmiley() {

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerHTML = `<p>${gSmileyState}</p>`
}

function renderHints() {
    var hints = ""
    switch (gUserHints) {
        case 3:
            hints = " % % % "
            break;
        case 2:
            hints = " % % "

            break;
        case 1:
            hints = " % "
            break;
        default:
            break;
    }
    var elHints = document.querySelector('.hints');
    elHints.innerHTML = `<p>${hints} hints</p>`
}

function onHintClicked() {
    /**
     * 
     * TODO:
     * when start stying there are 2 approaches:
     * 1) create 3 different emojis/images and based on this we know to which on we should change color
     * nthChild(n)
     * 2) if all three are like lives, we can count length -1 - spaces
     * 
     * 
     * psudeo:
     * when hint click I need to save hintClciked = true
     * then onCell click I check if hintClicked
     * basd on that I call exapndAroung, and  should probably set timeout to currCell.isShown = false
     * **/
}

//duplicate demo
function expandAround(pos) {
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            currCell.isShown = true
        }
    }
}
