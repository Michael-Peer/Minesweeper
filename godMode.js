'use strict'

function onGodModeClicked() {
    var strHTML = ""
    console.log("here")
    renderGodModeButtons()
    gIsGodMode = true
    restartGame()

}

function renderGodModeButtons() {

    if (gIsGodMode) return //prevent double click and toogle on main button
    var elGodModeP = document.querySelector(".play")
    var elGodModeE = document.querySelector(".exit")

    elGodModeP.classList.toggle("hide")
    elGodModeE.classList.toggle("hide")
}

function createMine(i, j) {
    console.log("creating...", { i, j })

    var elCell = document.getElementById(`${i},${j}`)
    if (elCell.innerText === MINE) return //prevent messing with mines cnt
    elCell.innerText = MINE
    // elCell.classList.add("bomb")
    gGodModeMines.push({ i, j })

    console.log(gGodModeMines)
}

function exitGodMode(shouldRestart) {
    gIsGodMode = false


    renderGodModeButtons()

    if (shouldRestart) { //init curr level

        var levelEl = getCurrLevelEl()
        var size

        switch (levelEl.id) {
            case ButtonState.EASY:
                size = 4
                break;
            case ButtonState.MEDIUM:
            default:
                size = 8
                break;
            case ButtonState.HARD:
                size = 12
                break;
        }

        onLevelClicked(size, levelEl)
    }
}


function getCurrLevelEl() {
    return document.querySelector(".size-btn")
}

function createMines() {
    console.log("creating mines...", gGodModeMines)

    for (var i = 0; i < gGodModeMines.length; i++) {
        console.log(gGodModeMines[i])
        var cell = gBoard[gGodModeMines[i].i][gGodModeMines[i].j]
        cell.isMine = true
    }

    initGodModeGame()
}

function initGodModeGame() {
    renderBoard()
    setMinesNegsCount()
    gLevel.mines = gGodModeMines.length
    exitGodMode(false)
    // document.querySelector(".godmode-message").classList.add("hide")
}