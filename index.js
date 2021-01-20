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
var gIsHintClicked
var gTimerInterval
var gSafeButtonClicks
var gIsSafeButtonClicked

var gIsGodMode = false

var gGodModeMines = []


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

    gGame.isOn = true,
        gGame.shownCount = 0,
        gGame.markedCount = 0,
        gGame.secsPassed = 0


    renderContent()

}

function renderContent() {
    console.log(gSmileyState)
    randomizeMines()
    renderBoard()
    // randomizeMines()
    renderLives()
    renderSmiley()
    renderHints()
    renderAvailableClicks()
    setBestScore()
    setMinesNegsCount()
}

//random mines location on board
function randomizeMines() {
    for (var i = 0; i < gLevel.mines; i++) {
        var rndI = getRandomInt(0, gLevel.size)
        var rngJ = getRandomInt(0, gLevel.size)
        console.log("before")

        //if they're equal
        while (rndI === rngJ) {
            rndI = getRandomInt(0, gLevel.size)
            rngJ = getRandomInt(0, gLevel.size)
            console.log("in while")
        }

        console.log("after")

        var cell = gBoard[rndI][rngJ]
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
                strHTML += `<td id="${i},${j}" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${FLAG}</td>`
            }
            else if (cell.isMine) {
                strHTML += `<td id="${i},${j}" mouseup="mouseUp()" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this, ${i},${j},event)"  >${cell.isShown ? "#" : ""}</td>`
            }
            else if (cell.isMarked) {
                strHTML += `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j},event)" >${FLAG}</td>`
            } else {
                strHTML += `<td id="${i},${j}" onclick="onCellClicked(this,${i},${j}, event)" oncontextmenu="onCellMarked(this,${i},${j}, event)" >${cell.isShown ? cell.minesAroundCount : ""}</td>`
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

    if (!gGame.isOn) return
    if (gIsGodMode) {
        createMine(i, j)
        return
    }


    var cell = gBoard[i][j]

    if (gIsHintClicked) {
        console.log("gIsHintClicked")
        revealNgs({ i, j })
        renderHintMessage(false)
        return
    }

    if (gIsFirstClick) {
        gIsFirstClick = false
        if (cell.isMine) changeMineLocation(elCell, i, j)
        gTimerInterval = setInterval(startTimer, 1000)
    }

    if (cell.isMarked || cell.isShown) return //prevent click on cells

    //both mine and 0 lives
    if (cell.isMine && !gUserLives) {
        onMineClicked()
        return
    } else if (cell.isMine && gUserLives) {
        gUserLives--
        !gUserLives ? onMineClicked() : renderLives()
        // renderWarning(i,j)
    }

    //psuedo code 
    // if it's a mine AND user lives > 0
    // reveal the mine and cointinue play
    //problem to solve: counters on checkGameover (cell count == -2 in the end, should be 0) maybe add check if cell is mine --> continue

    cell.isShown = true

    if (!cell.minesAroundCount && !cell.isMine) expandShown(gBoard, elCell, i, j)

    renderBoard() //TODO: Reduce unnecessary rendering use innerText/html instead
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

// TODO: DON'T implement end game logic inside renderMessage() func
function renderMessage(isWin) {
    gSmileyState = isWin ? SmileyState.Win : SmileyState.Lose
    renderSmiley()
    var elBoard = document.querySelector('.message');
    elBoard.innerHTML = `<p>${isWin ? `YOU WON with ${gUserLives} ${gUserLives > 1 ? "lives" : "life"} left` : "YOU LOST"}</p>`
    gGame.isOn = false
    clearInterval(gTimerInterval)
    storeScore()
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

//only reveal mine when live > 0 - X
function revealMine() {
    // gBoard[i][j].isShown = true
}


// Called on right click to mark a
// cell (suspected to be a mine)
// Search the web (and
// implement) how to hide the
// context menu on right click
function onCellMarked(elCell, i, j, e) {
    if (!gGame.isOn) return
    e.preventDefault()
    var cell = gBoard[i][j]
    console.log(cell.isShown)
    if (cell.isShown) return //prevent click on cells
    if (cell.isMarked) {
        cell.isMarked = !cell.isMarked
        gGame.markedCount--
    } else {
        cell.isMarked = true
        gGame.markedCount++
    }
    console.log("adssadsad")
    checkGameOver() // case where we reveal all the non-mines cells but we didn't marked the mines yet
    renderBoard()
}




// Game ends when all mines are
// marked, and all the other cells
// are shown
function checkGameOver() {
    var mines = gLevel.mines
    var cellCnt = gBoard.length * gBoard.length - mines


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
    console.log(cellCnt, mines)
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
            if (!currCell.isMarked) currCell.isShown = true
        }
    }
}


function onLevelClicked(size) {
    switch (size) {
        case 4:
            gLevel.size = size
            gLevel.mines = 2
            restartGame()
            break;
        case 8:
            gLevel.size = size
            gLevel.mines = 8
            restartGame()
            break;
        case 12:
            gLevel.size = size
            gLevel.mines = 12
            restartGame()
            break;

        default:
            console.log("Well, you have big problem if you ended up here")
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
    elSmiley.innerText = `${gSmileyState}`
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
     * 
     * 
     * Logic is done
     * **/
    if (!gUserHints) return
    gIsHintClicked = true
    renderHintMessage(true)
}

function renderHintMessage(isHintMode) {
    document.querySelector(".hint-message").innerText = `${isHintMode ? "Hint mode is active" : ""} `
}

function revealNgs(pos) {
    var ngs = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            if (!currCell.isMarked) {
                currCell.isShown = true
                ngs.push(currCell)
            }
        }
    }

    renderBoard()
    setTimeout(() => {
        for (var i = 0; i < ngs.length; i++) {
            ngs[i].isShown = false
        }
        renderBoard()
        gIsHintClicked = false
        gUserHints--
        renderHints()
    }, 1000);
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

    if (!gSafeButtonClicks || gIsSafeButtonClicked) return //no clicka or already active
    console.log("hereweew")

    const availableCells = []

    gIsSafeButtonClicked = true

    var elCell = null
    // var rndI = getRandomInt(0, gLevel.size)
    // var rngJ = getRandomInt(0, gLevel.size)
    // var cell = gBoard[rndI][rngJ]

    //for completely random cell
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
    elSafeButtonTxt.innerText = `${gSafeButtonClicks} clicks available`
}




//duplicate demo
// function expandAround(pos) {

//     for (var i = pos.i - 1; i <= pos.i + 1; i++) {
//         if (i < 0 || i > gBoard.length - 1) continue
//         for (var j = pos.j - 1; j <= pos.j + 1; j++) {
//             if (j < 0 || j > gBoard[0].length - 1) continue
//             if (i === pos.i && j === pos.j) continue
//             var currCell = gBoard[i][j]
//             currCell.isShown = true
//         }
//     }
// }



/**
 * 
 * If we enter to this mode:
 * check in [onCellClicked()] if we're in god mode, if we are:
 * go outside from the regular flow
 * create [setMines()] function, save the mines and the position in array(?)
 * keep adding to the array while we're in god moe AND user click on cells
 * add button - set mines, when clicked:
 * call/create(?) [createMines()] func, set the mines based on array items
 * exit god mode, render(how to not render the regulat random mines?) and play
 * 
 * **/
function onGodModeClicked() {
    var strHTML = ""
    console.log("here")
    gIsGodMode = true
    restartGame()//TODO: check if godMode when we call randomizeMines()
    var elGodMose = document.querySelector(".godmode-message")

    strHTML += `<p class="god-mode-text" >You're in god mode</p>`
    strHTML += `<button onclick="exitGodMode()">EXIT</button>`
    elGodMose.innerHTML = strHTML
}

function createMine(i, j) {
    console.log("creating...", { i, j })

    var elCell = document.getElementById(`${i},${j}`)
    elCell.innerText = MINE
    gGodModeMines.push({ i, j })

    console.log(gGodModeMines)
}

function exitGodMode() {
    gIsGodMode = false
    document.querySelector(".godmode-message").classList.add("hide")
    restartGame()
}