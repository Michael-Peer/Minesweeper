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
    console.log(shouldRestart)

    if (shouldRestart) restartGame()
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