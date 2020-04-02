class Grid {
    constructor() {
        this.grid = []
        this.fillGrid()
    }

    getGrid() {
        return this.grid
    }

    fillGrid() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
            let row = []
            for (let j = 0; j < GRID_WIDTH; j++) {
                row.push(new Cell(i, j, 0, 0, 0))
            }
            this.grid.push(row)
        }
    }

    drawGrid() {
        fill(255)
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j++) {
                this.grid[i][j].drawCell()
            }
        }
    }

    findRowToDelete() {
        for(let i = this.grid.length-1; i > 0; i--){
            let c = 0;
            let tmp = this.grid[i]
            //let s = ""
            for (let j = 0; j < tmp.length; j++) {
                //s += tmp[j].value + " "
                if(tmp[j].value === 1){
                    c++;
                }
            }
            //console.log(s)
            if(c === tmp.length){
                this.deleteRow(i)
            }
        }
    }

    deleteRow(lineToDel) {
        for (let j = 0; j < this.grid[lineToDel].length; j++) {         
            this.grid[lineToDel][j].value = 0
        }
        
        ctx.clearRect(Math.floor(constant*95),Math.floor(constant*200),Math.floor(constant*100),Math.floor(constant*40))
        score += 100
        this.shiftRows(lineToDel)
    }

    shiftRows(start){
        for (let i = start; i > 1; i--){
            for(let j in this.grid[i]){
                this.grid[i][j].value = this.grid[i-1][j].value
                this.grid[i][j].color = this.grid[i-1][j].color
            }
        }
    }

    print() {
        this.grid.forEach((row, i) => {
            row.forEach((v,j) => {
                console.log(v)
            })
            console.log()
        })
    }
}