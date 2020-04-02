//LEGGERE PRIMA IL README
//LEGGERE PRIMA IL README
//LEGGERE PRIMA IL README
//LEGGERE PRIMA IL README

const constant = 1.4

//DOS
const secondCanvas = document.getElementById("myCanvas")
const ctx = secondCanvas.getContext("2d")
const image = document.getElementById("logo")

const CANVAS_WIDTH = 200 * constant
const CANVAS_HEIGHT = 400 * constant
const value = 20 * constant

const GRID_WIDTH = Math.floor(CANVAS_WIDTH / (value))
const GRID_HEIGHT = Math.floor(CANVAS_HEIGHT / value)
const cellSize = Math.floor(CANVAS_HEIGHT / GRID_HEIGHT)

let matrix
let element
let shape

let score
//let highscore = 0

let time

let pathBtnActivated

let highscore = 0
let hightime = ""

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT)

    //impostazione scritte: SCORE e TIMER
    score = 0
    time = {
        cSec: 0,
        dSec: 0,
        min: 0
    }

    drawText("SCORE: " + score, Math.floor(constant * 20), Math.floor(constant * 200))
    let s = time.min + ":" + time.dSec + "" + time.cSec
    drawText("TIMER: " + s, Math.floor(constant * 20), Math.floor(constant * 230))
    drawText("HIGHSCORE: " + highscore, Math.floor(constant * 20), Math.floor(constant * 230))
    drawText(highscore + " " + s, Math.floor(constant * 20), Math.floor(constant * 280))


    //impostazione DOS
    styleSetting()

    //creazione griglia
    matrix = new Grid()

    //creazione s
    shape = Math.floor(random(0, 7))
    element = new Tetramino(shape)

    //trovo già la nuova forma per mostrarla in anticipo sul secondo canvas
    shape = Math.floor(random(0, 7))
    viewNextShape()

    pathBtnActivated = false

    if (score > highscore) {
        highscore = score
    }
}

function draw() {
    background(255, 220, 0)

    drawText("SCORE: " + score, Math.floor(constant * 20), Math.floor(constant * 200))
    let s = time.min + ":" + time.dSec + "" + time.cSec
    drawText("TIMER: " + s, Math.floor(constant * 20), Math.floor(constant * 230))
    drawText("HIGHSCORE: ", Math.floor(constant * 20), Math.floor(constant * 260))
    drawText(highscore + " " + hightime, Math.floor(constant * 20), Math.floor(constant * 280))

    //se frameCount è 60, è passato un secondo
    if (frameCount % 60 == 0) {
        ctx.clearRect(Math.floor(constant * 70), Math.floor(constant * 200), Math.floor(constant * 200), Math.floor(constant * 50))
        timer()
    }

    //visualizzazione griglia
    matrix.drawGrid()

    //visualizzazione tetramini
    element.drawShape()

    //movimento
    if (element.move(matrix.getGrid(), s) === null) {
        newTetramino()
    }

    //rotazione nella funzione keyPressed
    //e il comando "space"

    //cancellazione
    matrix.findRowToDelete()

    //disegna i percorsi
    if (pathBtnActivated) {
        element.drawStreet(matrix.getGrid())
    }

    if (score > highscore) {
        highscore = score
        ctx.clearRect(0, Math.floor(constant * 265), Math.floor(constant * 200), Math.floor(constant * 60))
    }
}


function keyPressed() {
    //pausa
    if(keyCode === 80){
        pause("icon")
    }

    //rotazione
    if (keyCode === 38) {
        element.rotate()
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
        return
    }
    //SPACEBAR
    if (keyCode === 32) {
        ctx.clearRect(Math.floor(constant * 100), Math.floor(constant * 150), Math.floor(constant * 200), Math.floor(constant * 50))
        score += 30
        while (!element.elementCollide(matrix.getGrid())) {
            element.pos.y += 0.50
        }
    }
}

function viewNextShape() {
    ctx.clearRect(0, 0, Math.floor(constant * 200), Math.floor(constant * 200))
    ctx.restore()
    let el = config[shape]
    let offsetX = 3
    if (shape === 5) {
        offsetX = 4
    }
    let offsetY = 3

    ctx.save()
    for (let i in el) {
        for (let j in el[i]) {
            if (el[i][j] === 1) {
                ctx.beginPath()
                ctx.fillStyle = "rgb(245,222,200)"
                ctx.fillRect((j * cellSize) + offsetX * cellSize, (i * cellSize) + offsetY * cellSize, cellSize, cellSize)

                ctx.moveTo((j * cellSize) + (offsetX * cellSize), (i * cellSize) + (offsetY * cellSize))
                ctx.lineTo((j * cellSize) + (offsetX * cellSize), (i * cellSize) + ((offsetY + 1) * cellSize))

                ctx.moveTo((j * cellSize) + (offsetX * cellSize), (i * cellSize) + ((offsetY + 1) * cellSize))
                ctx.lineTo((j * cellSize) + ((offsetX + 1) * cellSize), (i * cellSize) + ((offsetY + 1) * cellSize))

                ctx.moveTo((j * cellSize) + ((offsetX + 1) * cellSize), (i * cellSize) + ((offsetY + 1) * cellSize))
                ctx.lineTo((j * cellSize) + ((offsetX + 1) * cellSize), (i * cellSize) + ((offsetY) * cellSize))

                ctx.moveTo((j * cellSize) + ((offsetX + 1) * cellSize), (i * cellSize) + (offsetY * cellSize))
                ctx.lineTo((j * cellSize) + (offsetX * cellSize), (i * cellSize) + (offsetY * cellSize))
                ctx.closePath()

                ctx.strokeStyle = "rgb(0,0,0)"
                ctx.stroke()
            }
        }
    }
}

function styleSetting() {
    let s = "" + CANVAS_WIDTH * 2 + "px"
    document.getElementById("ctn").style.maxWidth = s

    secondCanvas.setAttribute("width", CANVAS_WIDTH)
    secondCanvas.setAttribute("height", CANVAS_HEIGHT)

    document.getElementById("images").style.maxWidth = s
    document.getElementById("images").style.maxHeight = "75px"

    document.getElementById("logo").style.paddingLeft = "" + (50 + (200 * (constant - 1))) + "px"

    document.getElementById("restart-btn").style.left = "" + (Math.floor(CANVAS_WIDTH) * 2) - 73 + "px"
    document.getElementById("restart-btn").style.top = "" + Math.floor(CANVAS_HEIGHT + 57) + "px"

    document.getElementById("path-btn").style.left = "" + (Math.floor(CANVAS_WIDTH) * 2) - 45 + "px"
    document.getElementById("path-btn").style.top = "" + Math.floor(CANVAS_HEIGHT + 29) + "px"
    
    document.getElementById("cmd-btn").style.left = "" + (Math.floor(CANVAS_WIDTH) * 2) - 39 + "px"
    document.getElementById("cmd-btn").style.top = "" + Math.floor(CANVAS_HEIGHT+1) + "px"
    
    document.getElementById("cmd").style.opacity = "0"

    document.getElementById("pause-btn").style.left = "" + (Math.floor(CANVAS_WIDTH) * 2) - 37 + "px"
    document.getElementById("pause-btn").style.top = "" + Math.floor(CANVAS_HEIGHT-35) + "px"

}

function drawText(text, x, y) {
    ctx.font = "30px pixel_font"
    ctx.strokeStyle = "black"
    ctx.lineWidth = 4
    ctx.strokeText(text, x, y)
    ctx.fillText(text, x, y)
    ctx.fillStyle = "white"
}

function timer() {
    time.cSec++;
    if (time.cSec % 10 === 0) {
        time.dSec++
        time.cSec = 0
    }
    if (time.dSec === 5 && time.cSec === 9) {
        time.min++
        time.dSec = 0
        time.cSec = 0
    }
}

function activePath() {
    if (pathBtnActivated) {
        pathBtnActivated = false
    } else {
        pathBtnActivated = true
    }
    document.getElementById("path-btn").blur()
}

function restartGame() {
    setup()
    loop()
    document.getElementById("restart-btn").blur()
}

function newTetramino() {
    element = new Tetramino(shape)
    shape = Math.floor(random(0, 7))
    viewNextShape()
}

function showCmd(imgID){
    if(document.getElementById(imgID).style.opacity === "0"){
        document.getElementById(imgID).style.opacity = "100"
    }else{
        document.getElementById(imgID).style.opacity = "0"
    }

    document.getElementById("cmd-btn").blur()
}

function pause(iconID){
    if(document.getElementById(iconID).innerHTML === "pause"){
        document.getElementById(iconID).innerHTML = "play_arrow"
        noLoop()
    }else{
        document.getElementById(iconID).innerHTML = "pause"
        loop()
    }
    document.getElementById("pause-btn").blur()
}
