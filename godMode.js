
function onGodModeClicked() {
    var strHTML = ""
    console.log("here")
    gIsGodMode = true
    restartGame()
    var elGodModeP = document.querySelector(".play")
    var elGodModeE = document.querySelector(".exit")

    elGodModeP.classList.remove("hide")
    elGodModeE.classList.remove("hide")


}

function createMine(i, j) {
    console.log("creating...", { i, j })

    var elCell = document.getElementById(`${i},${j}`)
    if (elCell.innerText === MINE) return //prevent messing with mines cnt
    elCell.innerText = MINE
    gGodModeMines.push({ i, j })

    console.log(gGodModeMines)
}

function exitGodMode() {
    gIsGodMode = false
    var elGodModeP = document.querySelector(".play")
    var elGodModeE = document.querySelector(".exit")

    elGodModeP.classList.add("hide")
    elGodModeE.classList.add("hide")
    restartGame()
}



function createMines() {
    console.log("creating mines...", gGodModeMines)

    for (var i = 0; i < gGodModeMines.length; i++) {
        console.log(gGodModeMines[i])
        var cell = gBoard[gGodModeMines[i].i][gGodModeMines[i].j]
        cell.isMine = true
    }

    //TODO: Extract to function
    renderBoard()
    setMinesNegsCount()
    gLevel.mines = gGodModeMines.length
    gIsGodMode = false
    // document.querySelector(".godmode-message").classList.add("hide")
}