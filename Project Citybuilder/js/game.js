let tilesize = {x:48,y:24}
let gameUI,bars,gameStats
function game() {
    gameUI = getElementById(hidden,"gameUi")
    bars = getElementById(gameUI,"bars")
    gameStats = []
    for (let i in stats)
        gameStats.push([stats[i],new GlobalVar(50)])
}
let gameSystem

let barUpdates = []
let barIndex = 0
function addBar(ui,trackValue)
{
    let barOut = document.createElement("div")
    let barIn = document.createElement("div")
    barOut.append(barIn)
    ui.append(barOut)
    barOut.className = "progress progress-bar-striped bg-dark"
    barOut.style = "margin:4px"
    barIn.className = "progress-bar progress-bar-striped "
    barUpdates.push([setInterval(updateBar,100),trackValue,barIn])
    return barIn
}
function updateBar()
{
    barUpdates[barIndex][2].style = "width :" + barUpdates[barIndex++][1].getVar() + "%"
    barIndex%=barUpdates.length
}

class GameSystem
{
    constructor(size,margin,vessel,stats)
    {
        this.gameStats = stats
        let canvasX = size*tilesize.x+margin;
        let canvasY = size*tilesize.y+margin+64;
        this.margin = margin;
        let animationFrame = 0
        this.drawPlace = false
        this.clickPos = [0,0]
        this.parent = vessel;
        gameSystem = this
        this.tileGrid = []
        for(let iy = 0;iy<size;iy++)
        {
            this.tileGrid.push([])
            for(let ix = 0;ix<size;ix++)
                this.tileGrid[this.tileGrid.length-1].push(null)
        }
        this.tileGridUnder = []
        for(let iy = 0;iy<size;iy++)
        {
            this.tileGridUnder.push([])
            for(let ix = 0;ix<size;ix++)
                this.tileGridUnder[this.tileGridUnder.length-1].push(null)
        }
        this.canvas = document.createElement("canvas")
        this.canvas.width = canvasX;
        this.canvas.height = canvasY;
        this.parent.append(this.canvas)
        this.canvas.addEventListener("mousedown",(e) => {
            this.clickPos = this.getMousePosition(this.canvas,e)
        })
        this.animate()
        this.animateInterval = setInterval(this.animate,1000)
    }

    animate()
    {
        gameSystem.animationFrame++
        gameSystem.animationFrame%=2
        gameSystem.updateGrid()
    }

    getMousePosition(canvas,click)
    {
        let rect = canvas.getBoundingClientRect()
        return [click.clientX - rect.left,click.clientY - rect.top]
    }

    updateGrid()
    {
        let drawer = this.canvas.getContext("2d")
        let size = this.tileGrid.length
        drawer.fillStyle = "#4db938"
        drawer.fillRect(0,0,this.canvas.width,this.canvas.height)
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
            {
                let x = ((tilesize.x/2)*(size-2)+(tilesize.x/2)*ix-tilesize.y*iy+this.margin)
                let y = ((tilesize.y/2)*ix+(tilesize.y/2)*iy+this.margin-tilesize.x+64)
                if (this.tileGrid[ix][iy] == null) {
                    if (this.drawPlace) 
                        this.drawImage(drawer,"./img/buildings/empty.png",x,y)
                }
                else
                    this.drawImage(drawer,this.tileGrid[ix][iy].getSprite(),x+8,y-this.tileGrid[ix][iy].source.heightDiff)
            }
    }

    placeDraw(bool)
    {
        this.drawPlace = bool
        this.updateGrid()
    }

    drawImage(drawer,img,x,y)
    {
        let image = document.createElement("img")
        image.src = img
        drawer.drawImage(image,x,y)
    }
}

function initiateGame()
{
    m.remove()
    document.body.append(gameUI)
    gameSystem = new GameSystem(10,30,gameUI,gameStats)
}
function initiateTutorial()
{
    m.remove()
    document.body.append(gameUI)
    gameSystem = new GameSystem(4,30,gameUI,gameStats)
    addBar(bars,gameStats[0][1]).className += colors.lime
    addBar(bars,gameStats[1][1])
}