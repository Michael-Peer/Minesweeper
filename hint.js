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



function revealNgs(pos) {
    var ngs = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === pos.i && j === pos.j) continue
            var currCell = gBoard[i][j]
            if (!currCell.isMarked) {
                if (currCell.isShown) continue //prevent hiding already opened cells
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
        document.querySelector(".bulb-indication").style.display = "none"
        renderHints()
    }, 1000);
}