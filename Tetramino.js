const config = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]
]

class Tetramino {
    constructor(type) {
        this.shape = config[type]
        this.pos = {
            x: 3,
            y: 0
        }
        if (type === 5) {
            this.pos.x = 4
        }

        this.r = Math.floor(random(0, 256))
        this.g = Math.floor(random(0, 256))
        this.b = Math.floor(random(0, 256))
    }

    collideBorders() {
        let collide = false
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    if (Math.floor(this.pos.x + x) < 0
                        || Math.floor(this.pos.x + x) >= GRID_WIDTH) {
                        collide = true;
                        return
                    }
                }
            })
        })
        return collide
    }

    elementCollide(grid) {
        let collide = false
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    if (grid[(Math.floor(this.pos.y + y))][Math.floor(this.pos.x + x)].value === 1) {
                        collide = true
                        return
                    }
                }
            })
        })
        return collide
    }

    collideBottom() {
        let collide = false
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    if (Math.floor(this.pos.y + y) >= GRID_HEIGHT) {
                        collide = true
                        return
                    }
                }
            })
        })
        return collide
    }

    drawShape() {
        //row rappresente ogni lista, in questo caso 4
        //y è l'indice
        this.shape.forEach((row, y) => {
            //per ogni valore della lista (row), visualizzo solo quelli con all'interno 1
            //x è l'indice
            row.forEach((value, x) => {
                if (value === 1) {
                    fill(this.r, this.g, this.b, 255)
                    rect(Math.floor(this.pos.x + x) * cellSize, Math.floor((this.pos.y + y)) * cellSize, cellSize, cellSize)
                }
            })
        })
    }

    move(grid, time) {
        //spostamento in basso continuo
        this.pos.y += 0.02
        let dir = 0;

        //spostamento
        if (keyIsDown(LEFT_ARROW)) {
            this.pos.x -= 0.18
            dir = -1
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.pos.x += 0.18
            dir = 1
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.pos.y += 0.18
            dir = 0
        }

        //controllo bordi
        if (this.collideBorders()) {
            this.returnBack(grid)
        }
        if (this.collideBottom()) {
            this.placeTetramino(grid)
            return null
        }
        if (this.elementCollide(grid)) {
            if (this.gameOver()) {
                ctx.clearRect(Math.floor(constant * 10), Math.floor(constant * 150), Math.floor(constant * 200), Math.floor(constant * 50))
                drawText("SCORE: " + score, Math.floor(constant * 20), Math.floor(constant * 200))
                hightime = time
                ctx.clearRect(0, Math.floor(constant * 265), Math.floor(constant * 200), Math.floor(constant * 60))
                drawText(highscore + " " + hightime, Math.floor(constant * 20), Math.floor(constant * 280))
                noLoop()
                return
            }
            if (dir === 0) {
                this.placeTetramino(grid)
                return null
            }
            else if (dir === 1) {
                this.pos.x -= 0.18
            }
            else if (dir === -1) {
                this.pos.x += 0.18
            }
        }
    }

    returnBack() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    //console.log(Math.floor(this.pos.x + x))
                    if (Math.floor(this.pos.x + x) < 0) {
                        this.pos.x += 1
                    }
                    else if (Math.floor(this.pos.x + x) >= GRID_WIDTH) {
                        this.pos.x -= 1
                    }
                }
            })
        })
    }

    placeTetramino(grid) {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    grid[(Math.floor(this.pos.y + y)) - 1][Math.floor(this.pos.x + x)].value = 1
                    grid[(Math.floor(this.pos.y + y)) - 1][Math.floor(this.pos.x + x)].color = color(this.r, this.g, this.b)
                }
            })
        })
    }

    getValue(posY, posX) {
        return this.shape[posY][posX]
    }

    setValue(v, posY, posX) {
        this.shape[posY][posX] = v
    }

    transpose() {
        for (let i = 0; i < this.shape.length; i++) {
            for (let j = 0; j < i; j++) {
                let temp = this.getValue(i, j)
                this.setValue(this.getValue(j, i), i, j)
                this.setValue(temp, j, i)
            }
        }
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].reverse()
        }
    }

    rotate() {
        this.transpose()
        if (this.collideBorders())
            this.returnBack()
        //console.log(Math.floor(this.pos.x),Math.floor(this.pos.y))
    }

    drawStreet(grid) {
        //disegno le linee
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value === 1) {
                    stroke(this.r, this.g, this.b)
                    line((Math.floor(this.pos.x + x) * cellSize), (Math.floor(this.pos.y + 1 + y) * cellSize), (Math.floor(this.pos.x + x) * cellSize), (GRID_HEIGHT * cellSize))
                    line((Math.floor(this.pos.x + 1 + x) * cellSize), (Math.floor(this.pos.y + 1 + y) * cellSize), (Math.floor(this.pos.x + 1 + x) * cellSize), (GRID_HEIGHT * cellSize))

                    stroke(0)
                    rect((Math.floor(this.pos.x + x) * cellSize), (Math.floor(this.pos.y + y) * cellSize), cellSize, cellSize)
                }
            })
        })

        //ritocca ridesegnare i tetramini piazzati solo con i bordi neri
        //in modo che le linee del percorso non attraversino i tetramini
        noFill()
        for (let i in grid) {
            for (let j in grid[i]) {
                if (grid[i][j].value === 1) {
                    stroke(0)
                    rect(j * cellSize, i * cellSize, cellSize, cellSize)
                }
            }
        }
    }

    getShape() {
        return this.shape
    }

    gameOver() {
        if (this.pos.y < 1) {
            drawText("GAME OVER", Math.floor(constant * 20), Math.floor(CANVAS_HEIGHT - 50))
            drawText("LOSER!", Math.floor(constant * 20), Math.floor(CANVAS_HEIGHT - 30))
            return true
        }
        return false
    }
}

