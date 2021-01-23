'use strict'


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

//show all negs aroung point click
function revealNgs(pos) {
    var ngs = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            if (!currCell.isMarked) {
                if (currCell.isShown) continue //prevent hiding later already opened cells
                currCell.isShown = true

                var elCell = getIdByPosition({ i, j })


                if (currCell.isMine) {
                    elCell.innerText = MINE
                    elCell.classList.add("bomb")
                } else {
                    elCell.innerText = currCell.minesAroundCount
                    elCell.classList.add("expand")
                }

                var cell = { cell: currCell, position: { i, j } }
                ngs.push(cell)



            }
        }
    }


    // renderBoard()

    setTimeout(() => {
        for (var i = 0; i < ngs.length; i++) {
            ngs[i].cell.isShown = false
            var elCell = getIdByPosition({ i: ngs[i].position.i, j: ngs[i].position.j })
            elCell.innerText = ""
            elCell.classList.remove(`${ngs[i].cell.isMine ? "bomb" : "expand"}`)
        }
        // renderBoard()
        gIsHintClicked = false
        document.querySelector(".bulb-indication").style.display = "none"
        renderHints()
    }, 1000);
}