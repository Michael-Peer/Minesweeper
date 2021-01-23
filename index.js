'use strict'


const MINE = "💣"
const FLAG = "🏁"


const SmileyState = {
    Normal: "😀",
    Win: "😎",
    Lose: "🤯"
}

const ButtonState = {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard"
}

var gBoard

var gLevel = {
    size: 8,
    mines: 12
}

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

var gUserLives
var gUserHints
var gSmileyState
var gSafeButtonClicks

var gTimerInterval

var gIsFirstClick
var gIsHintClicked
var gIsSafeButtonClicked
var gIsGodMode = false

var gGodModeMines = []
var gUserOperations = []
var gExpendedCells = []

var operation = {
    hints: gUserLives,
    lives: gUserLives,
    safe: gSafeButtonClicks,
    cell: {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        pos: {
            i: null,
            j: null
        }
    },
    elCell: null,
    expandedCells: []
}

var gPreviousSizeBtn = ButtonState.MEDIUM

//when page loads
function initGame() {

    gBoard = buildBoard()

    gIsFirstClick = true
    gIsHintClicked = false
    gIsSafeButtonClicked = false

    gUserLives = 3
    gUserHints = 3
    gSafeButtonClicks = 3

    gSmileyState = SmileyState.Normal

    gGodModeMines = []

    //undo
    gUserOperations = []


    gGame.isOn = true,
        gGame.shownCount = 0,
        gGame.markedCount = 0,
        gGame.secsPassed = 0


    renderContent()

}

function renderContent() {
    if (!gIsGodMode) randomizeMines()
    renderBoard()
    renderLives()
    renderSmiley()
    renderHints()
    renderAvailableClicks()
    setBestScore()
    setMinesNegsCount()
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
    console.table(board)
    return board
}

// Render the board as a <table>
// to the page
function renderBoard() {

    console.log("rendering....")
    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="" >`
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]

            //TODO:  more efficent approach
            //TODO: Pass data instead of ${i, j} - save code
            if (cell.isMine && cell.isMarked) {
                strHTML += `<td id="${i},${j}" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${FLAG}</td>`
            } else if (cell.isMine && cell.isShown) {
                strHTML += `<td id="${i},${j}" class="bomb" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? MINE : ""}</td>`
            }
            else if (cell.isMine) {
                strHTML += `<td id="${i},${j}"  mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? MINE : ""}</td>`
            }
            else if (cell.isMarked) {
                strHTML += `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`
            } else if (cell.isShown) {
                strHTML += `<td id="${i},${j}" class="expand" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.minesAroundCount > 0 ? cell.minesAroundCount : ""}</td>`
            }

            else {
                strHTML += `<td id="${i},${j}"  onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.isShown ? cell.minesAroundCount : ""}</td>`
            }
        }
        strHTML += `</tr>`
    }

    var elCells = document.querySelector('.board');
    elCells.innerHTML = strHTML;

}


// function renderHtml(elCell, cell, i, j) {
//     console.log(cell)

//     console.log(elCell)
//     if (cell.isMine && cell.isMarked) {
//         elCell.innerHTML = `<td id="${i},${j}" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${FLAG}</td>`
//     } else if (cell.isMine && cell.isShown) {
//         elCell.innerHTML = `<td id="${i},${j}" class="bomb" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? MINE : ""}</td>`
//     }
//     else if (cell.isMine) {
//         console.log("ismineqweqeqeqeq")
//         elCell.innerHTML = `<td id="${i},${j}"  mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? MINE : ""}</td>`
//     }
//     else if (cell.isMarked) {
//         elCell.innerHTML = `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`
//     } else if (cell.isShown) {
//         elCell.innerHTML = `<td id="${i},${j}" class="expand" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.minesAroundCount > 0 ? cell.minesAroundCount : ""}</td>`
//     }

//     else {
//         strHTML += `<td id="${i},${j}"  onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.isShown ? cell.minesAroundCount : ""}</td>`
//     }
// }



// Called when a cell (td) is
// clicked
function onCellClicked(elCell, i, j, e) {

    gExpendedCells = [] // whcih cells expanded init - undo impl

    if (!gGame.isOn) return
    console.log(gIsGodMode)

    if (gIsGodMode) {
        createMine(i, j)
        return
    }

    var cell = gBoard[i][j]

    if (gIsHintClicked) {
        revealNgs({ i, j })
        return
    }

    if (gIsFirstClick) {
        gIsFirstClick = false
        if (cell.isMine) changeMineLocation(elCell, i, j)
        gTimerInterval = setInterval(startTimer, 1000)
    }

    if (cell.isMarked || cell.isShown) return //prevent click on cells

    if (cell.isMine && !gUserLives) {
        onMineClicked(cell, { i, j })
        return
    } else if (cell.isMine && gUserLives) {
        gUserLives--
        !gUserLives ? onMineClicked() : renderLives()
        gGame.markedCount++
        elCell.innerText = MINE
        elCell.classList.add("bomb")
        // renderWarning(i,j) ??
    }

    cell.isShown = true
    if (!cell.isMine) gGame.shownCount++


    if (!cell.minesAroundCount && !cell.isMine) {
        
    console.log(elCell)

    elCell.innerText = ""
    elCell.classList.add("expand")

    expandShown(gBoard, elCell, i, j) //expanding negs
    } else if(!cell.isMine) {
        elCell.innerText = `${cell.minesAroundCount > 0 ? cell.minesAroundCount : ""}`
        elCell.classList.add("expand")
    }

    addOperation(cell, { i, j })

    // renderBoard() //TODO: Reduce unnecessary rendering use innerText/html instead
    checkGameOver()

}

function onMineClicked() {
    renderLives()
    renderMessage(false)
    revealAllMines()
}

// TODO: DON'T implement end game logic inside renderMessage() func
function renderMessage(isWin) {
    gSmileyState = isWin ? SmileyState.Win : SmileyState.Lose
    renderSmiley()
    var elMessage = document.querySelector('.message');
    elMessage.innerHTML = `<p>${isWin ? `YOU WON<br><br> ${gUserLives} ${gUserLives > 1 ? "lives" : "life"} left` : "YOU LOST"}</p>`
    elMessage.style.display = "inline-block"
    gGame.isOn = false
    clearInterval(gTimerInterval)
    storeScore()
}



// Called on right click to mark a
// cell (suspected to be a mine)
// Search the web (and
// implement) how to hide the
// context menu on right click
function onCellMarked(elCell, i, j, e) {
    if (!gGame.isOn || gIsGodMode) return
    e.preventDefault()
    var cell = gBoard[i][j]
    console.log(cell.isShown)
    if (cell.isShown) return //prevent click on cells
    if (cell.isMarked) {
        cell.isMarked = !cell.isMarked
        addOperation(cell, { i, j })
        if (cell.isMine && !gIsFirstClick && gGame.markedCount) { // && gGame.markedCount - when we first mark, then first click and un mark again
            console.log("cell.isMine", cell.isMine, { i, j })
            gGame.markedCount--
        }

        elCell.innerHTML = `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" ></td>`
    } else {
        cell.isMarked = true
        addOperation(cell, { i, j })
        if (cell.isMine && !gIsFirstClick) {
            console.log("cell.isMine", cell.isMine, { i, j })
            gGame.markedCount++
        }
        elCell.innerHTML = `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`

    }
    checkGameOver() // case where we reveal all the non-mines cells but we didn't marked the mines yet

    // renderBoard()
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
    expandAround({ i, j }, elCell)
    // renderBoard() //TODO:  render only the relevent cells!!!!
}

function expandAround(pos, elCell) {


    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            if (!currCell.isMarked) {
                if (!currCell.isShown) {
                    if (!currCell.isMine) {
                        if (!currCell.isShown) gExpendedCells.push({ currCell, pos: { i, j }, originPos: pos })
                        gGame.shownCount++
                        currCell.isShown = true
                        // var elCell = document.getElementById(`${i},${j}`)
                        // elCell.innerHTML =  `<td id="${i},${j}" class="expand" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ""}</td>`
                        var elCell = getIdByPosition({ i, j })
                        // console.log(elCell)
                        elCell.innerText = `${currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ""}`
                        elCell.classList.add("expand")

                        if (currCell.minesAroundCount > 0) continue
                        expandAround({ i, j })
                    }
                }
            }
        }
    }
}



/**
 * 
 * Lives
 * 
 * **/
function renderLives() {
    var lives = ""
    switch (gUserLives) {
        case 3:
            lives = " 💖 💖 💖 "
            break;
        case 2:
            lives = " 💖 💖 "

            break;
        case 1:
            lives = " 💖 "
            break;
        default:
            break;
    }
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = `<p>${lives} Lives</p>`
}



/**
 * 
 * Game conditions
 * 
 * **/


// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    var mines = gLevel.mines //should be equal to marked count
    var cellCnt = gBoard.length * gBoard.length - mines //should be equal to shown count
    // console.log("before", cellCnt, mines)

    console.log(gGame.shownCount, "gGame.shownCount")
    console.log(gGame.markedCount, "gGame.markedCount")
    console.log(gUserLives, "gUserLives")

    if (cellCnt === gGame.shownCount && mines === gGame.markedCount) renderMessage(true)


    // for (var i = 0; i < gBoard.length; i++) {
    //     for (var j = 0; j < gBoard[0].length; j++) {
    //         var cell = gBoard[i][j]
    //         /**
    //          * 
    //          * here we're handling the "regular" case where mines are flagged AND the case where mine revealed by losing life.
    //          * 
    //          * **/
    //         if (cell.isMine && (cell.isMarked || cell.isShown)) mines--
    //         else if (cell.isShown && !cell.isMine) cellCnt--
    //     }
    // }
    // // console.log("after", cellCnt, mines)
    // if (!cellCnt && !mines) renderMessage(true)
}


function restartGame() {
    console.log("restartGame")
    clearInterval(gTimerInterval)
    // gIsGodMode = false
    initGame()
    renderStartingSecs()
    document.querySelector(".message").innerText = ""
}

function renderSmiley() {
    var elSmileyL = document.querySelector('.smiley-left');
    var elSmileyR = document.querySelector('.smiley-right');

    elSmileyL.innerText = `${gSmileyState}`
    elSmileyR.innerText = `${gSmileyState}`

}

/**
 * 
 * Timer
 * 
 * **/

function startTimer() {
    var elTimer = document.querySelector(".timer")
    gGame.secsPassed++
    elTimer.innerText = gGame.secsPassed
}

function renderStartingSecs() {
    var elTimer = document.querySelector(".timer")
    elTimer.innerText = 0
}

/**
 * 
 * Local storage
 * 
 * **/

//local storage
function storeScore() {
    var bestScore = localStorage.getItem("bestScore") // null if empty
    if (!bestScore || gGame.secsPassed < bestScore) {
        localStorage.setItem("bestScore", `${gGame.secsPassed}`)
        renderBestScore(gGame.secsPassed)
    }
}


//TODO: Render best score based on size
function renderBestScore(score) {
    var elBestScore = document.querySelector(".best-score")
    elBestScore.innerText = `Best score is: ${score}`
}

function setBestScore() {
    var bestScore = localStorage.getItem("bestScore") // null if empty
    if (bestScore) renderBestScore(bestScore)
}

/**
 * 
 * Level settings
 * 
 * **/

function onLevelClicked(size, el) {
    switch (size) {
        case 4:

            setLevelAndRestart(size, 2)
            changeBtnClass(el, ButtonState.EASY)

            break;

        case 8:

            setLevelAndRestart(size, 12)
            changeBtnClass(el, ButtonState.MEDIUM)

            break;

        case 12:

            setLevelAndRestart(size, 30)
            changeBtnClass(el, ButtonState.HARD)

            break;

        default:

            setLevelAndRestart(size, 12)
            changeBtnClass(el, ButtonState.MEDIUM)

            break;
    }
}

function setLevelAndRestart(size, mines) {
    gLevel.size = size,
        gLevel.mines = mines
    restartGame()
}

function changeBtnClass(el, className) {

    document.getElementById(gPreviousSizeBtn).classList.remove("size-btn")
    document.getElementById(gPreviousSizeBtn).classList.add("small-size-btn")
    el.classList.add("size-btn")
    el.classList.remove("small-size-btn")

    gPreviousSizeBtn = className
}













