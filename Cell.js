class Cell{
    constructor(y,x,r,g,b){
        this.x = x
        this.y = y
        this.value = 0
        this.color = color(r,g,b)
    }

    drawCell(){
        if(this.value === 0){
            this.color = 15
        }
        fill(this.color)
        stroke(0)
        //strokeWeight(0.2)
        rect(this.x*cellSize, this.y*cellSize, cellSize,cellSize)
    }

}