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

} // will be implemented later, currenty the game perfectly working without it



var gIsFirstClick
var gUserLives
var gUserHints
var gSmileyState
var gIsHintClicked
var gTimerInterval
var gSafeButtonClicks
var gIsSafeButtonClicked

var gIsGodMode = false

var gGodModeMines = []
var gUserOperations = []
var gExpendedCells = []

var operation = {
    hints: gUserLives,
    lives: gUserLives,
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
    // randomizeMines()
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

    gExpendedCells = [] // whcih cells expanded - undo impl

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
        // renderWarning(i,j) ??
    }

    cell.isShown = true

    if (!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, elCell, i, j) //expanding negs

    addOperation(cell, { i, j })

    renderBoard() //TODO: Reduce unnecessary rendering use innerText/html instead
    checkGameOver()

}

function onMineClicked() {
    renderMessage(false)
    revealAllMines()
}

// TODO: DON'T implement end game logic inside renderMessage() func
function renderMessage(isWin) {
    gSmileyState = isWin ? SmileyState.Win : SmileyState.Lose
    renderSmiley()
    var elMessage = document.querySelector('.message');
    elMessage.innerHTML = `<p>${isWin ? `YOU WON with ${gUserLives} ${gUserLives > 1 ? "lives" : "life"} left` : "YOU LOST"}</p>`
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
        gGame.markedCount--
        elCell.innerHTML = `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" ></td>`
    } else {
        cell.isMarked = true
        gGame.markedCount++
        elCell.innerHTML = `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`

    }
    checkGameOver() // case where we reveal all the non-mines cells but we didn't marked the mines yet

    // renderBoard()
}


// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    var mines = gLevel.mines
    var cellCnt = gBoard.length * gBoard.length - mines
    // console.log("before", cellCnt, mines)


    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j]
            /**
             * 
             * here we're handling the "regular" case where mines are flagged AND the case where mine revealed by losing life.
             * 
             * **/
            if (cell.isMine && (cell.isMarked || cell.isShown)) mines--
            else if (cell.isShown && !cell.isMine) cellCnt--
        }
    }
    // console.log("after", cellCnt, mines)
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
    // renderBoard() //TODO:  render only the relevent cells!!!!
}

function expandAround(pos) {
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
                        currCell.isShown = true
                        // var elCell = document.getElementById(`${i},${j}`)
                        // elCell.innerHTML =  `<td id="${i},${j}" class="expand" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ""}</td>`
                        if (currCell.minesAroundCount > 0) continue
                        expandAround({ i, j })
                    }
                }
            }
        }
    }
}


function onLevelClicked(size, el) {
    switch (size) {
        case 4:
            gLevel.size = size
            gLevel.mines = 2
            restartGame()

            changeBtnClass(el, ButtonState.EASY)


            break;
        case 8:
            gLevel.size = size
            gLevel.mines = 12
            restartGame()

            changeBtnClass(el, ButtonState.MEDIUM)

            break;
        case 12:
            gLevel.size = size
            gLevel.mines = 30
            restartGame()

            changeBtnClass(el, ButtonState.HARD)


            break;

        default:
            console.log("Well, you have big problem if you ended up here")
            break;
    }
}

function changeBtnClass(el, className) {
    document.getElementById(gPreviousSizeBtn).classList.remove("size-btn")
    document.getElementById(gPreviousSizeBtn).classList.add("small-size-btn")
    el.classList.add("size-btn")
    el.classList.remove("small-size-btn")

    gPreviousSizeBtn = className
}

//maybe there is small bug with i,j  - fixed
function changeMineLocation(elCell, i, j) {
    randomizeMine({ i, j })
    gBoard[i][j].isMine = false
    setMinesNegsCount()
}

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

function renderSmiley() {
    var elSmileyL = document.querySelector('.smiley-left');
    var elSmileyR = document.querySelector('.smiley-right');

    elSmileyL.innerText = `${gSmileyState}`
    elSmileyR.innerText = `${gSmileyState}`

}

function renderHints() {
    var hints = ""
    switch (gUserHints) {
        case 3:
            hints = " 💡 💡 💡 "
            break;
        case 2:
            hints = " 💡 💡 "

            break;
        case 1:
            hints = " 💡 "
            break;
        default:
            break;
    }

    var elHints = document.querySelector('.hints');
    elHints.innerHTML = `<p>Hints ${hints}</p>`
}

function onHintClicked() {

    if (!gUserHints || gIsGodMode || !gGame.isOn) return
    if (!gIsHintClicked) {
        var elBulb = document.querySelector(".bulb-indication")
        elBulb.style.display = "inline-block"
        gUserHints--
        renderHints()
    }
    gIsHintClicked = true
}


function startTimer() {
    var elTimer = document.querySelector(".timer")
    gGame.secsPassed++
    elTimer.innerText = gGame.secsPassed

}


function restartGame() {
    console.log("restartGame")
    clearInterval(gTimerInterval)
    // gIsGodMode = false
    initGame()
    renderStartingSecs()
    document.querySelector(".message").innerText = ""
}

function renderStartingSecs() {
    var elTimer = document.querySelector(".timer")
    elTimer.innerText = 0
}


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


// Clicking the Safe-Click button will mark a random covered cell
// (for a few seconds) that is safe to click (does not contain a
// MINE).
function onSafeButtonClicked() {

    if (!gSafeButtonClicks || gIsSafeButtonClicked || gIsGodMode) return //no clicka or already active
    console.log("hereweew")

    const availableCells = []

    gIsSafeButtonClicked = true

    var elCell = null

    //random cells
    for (var i = 0; i < gLevel.size; i++) {
        for (var j = 0; j < gLevel.size; j++) {
            var cell = gBoard[i][j]
            if (!cell.isMine && !cell.isShown && !cell.isMarked) {
                availableCells.push({ pos: { i, j } })
            }
        }
    }

    //no cells
    if (!availableCells.length) {
        gIsSafeButtonClicked = false
        return
    }

    var cell = availableCells[getRandomInt(0, availableCells.length)]

    console.log(gBoard[cell.pos.i][cell.pos.j], "safe click")
    elCell = document.getElementById(`${cell.pos.i},${cell.pos.j}`)
    elCell.classList.add("safe")

    gSafeButtonClicks--
    renderAvailableClicks()

    setTimeout(() => {
        elCell.classList.remove("safe")
        gIsSafeButtonClicked = false
    }, 5000);

}

function renderAvailableClicks() {
    var elSafeButtonTxt = document.querySelector(".safe-button-text")
    elSafeButtonTxt.innerText = `${gSafeButtonClicks} clicks left`
}











