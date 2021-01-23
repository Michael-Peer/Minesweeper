'use strict'



// Clicking the Safe-Click button will mark a random covered cell
// (for a few seconds) that is safe to click (does not contain a
// MINE).
function onSafeButtonClicked() {

    if (!gSafeButtonClicks || gIsSafeButtonClicked || gIsGodMode || !gGame.isOn) return //no clicka or already active

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
    }, 2500);

}

function renderAvailableClicks() {
    var elSafeButtonTxt = document.querySelector(".safe-button-text")
    elSafeButtonTxt.innerText = `${gSafeButtonClicks} clicks left`
}