let tilesize = {x:48,y:24}
let gameUI,bars,gameStats
function game() {
    gameUI = getElementById(hidden,"gameUi")
    bars = getElementById(getElementById(gameUI,"row1"),"bars")
    gameStats = []
    for (let i in stats)
        gameStats.push([stats[i],new GlobalVar(50).setName(stats[i])])
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
    barOut.addEventListener("mouseenter",(e) => {
        barIn.innerText = trackValue.name
    })
    barOut.addEventListener("mouseleave",(e) => {
        barIn.innerText = ""
    })
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
        //Static variables
        this.gameStats = stats
        let canvasX = Math.max(size*tilesize.x,320);
        let canvasY = size*tilesize.y+64+64;
        this.margin = margin;
        this.drawPlace = false
        this.clickPos = [0,0]
        this.parent = vessel;
        gameSystem = this
        this.selectableTool = [
            [14,16],
            [60,16],
            [108,16],
            [156,16],
            [202,16],
        ]
        this.hoverIndex = -1
        this.selectedIndex = -1
        this.offset = [24,64]

        //Normal Ground Tile Set
        this.tileGrid = []
        for(let iy = 0;iy<size;iy++)
        {
            this.tileGrid.push([])
            for(let ix = 0;ix<size;ix++)
                this.tileGrid[this.tileGrid.length-1].push(null)
        }
        this.gameSize = { x:this.tileGrid.length*tilesize.x, 
                          y:this.tileGrid[0].length*tilesize.y}

        //Floor Ground Tile Set
        this.tileGridUnder = []
        for(let iy = 0;iy<size;iy++)
        {
            this.tileGridUnder.push([])
            for(let ix = 0;ix<size;ix++)
                this.tileGridUnder[this.tileGridUnder.length-1].push(null)
        }

        //PlayField
        this.canvas = document.createElement("canvas")
        this.canvas.width = canvasX;
        this.canvas.height = canvasY;
        getElementById(this.parent,"row1").append(this.canvas)

        //Events
        this.canvas.addEventListener("mousedown",(e) => {
            this.clickPos = this.getMousePosition(this.canvas,e)
            if (this.hoverIndex != -1)
                if (this.hoverIndex == this.selectedIndex)
                    this.selectedIndex = -1
                else
                    this.selectedIndex = this.hoverIndex
        this.placeDraw(this.selectedIndex != -1)
        })

        this.toolPos = [0,0]
        this.canvas.addEventListener("mousemove",(e) => {
            this.toolPos = this.getMousePosition(this.canvas,e)
        })

        this.canvas.addEventListener("mouseleave",(e) => {
            this.toolPos = [0,0]
        })

        this.floor = this.canvas.height-64

        //animation
        this.updateGrid()
        this.toolAnimateInterval = setInterval(this.toolAnimate,64)
        this.animateInterval = setInterval(this.animate,1000)
    }
    toolAnimate()
    {
        gameSystem.toolUpdate()
    }

    toolUpdate()
    {
        let toolDraw = this.canvas.getContext("2d")
        this.drawImageWithScale(toolDraw,"./img/ui/Toolbar.png",0,this.floor,320,64)
        let found = false
        if (this.selectedIndex != -1)
            this.drawImageWithScale(toolDraw,"./img/ui/selected.png",this.selectableTool[this.selectedIndex][0],this.selectableTool[this.selectedIndex][1]+this.floor,40,40)
        for (let i in this.selectableTool)
        {
            let pos = this.selectableTool[i]
            
            if (withinBounds(pos[0],pos[1]+this.floor,40,40,this.toolPos[0],this.toolPos[1])) {
                this.drawImageWithScale(toolDraw,"./img/ui/hover.png",this.selectableTool[i][0],this.selectableTool[i][1]+this.floor,40,40)
                this.hoverIndex = i
                found = true
            }
        }
        if (!found)
            this.hoverIndex = -1
    }

    animate()
    {
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
        this.toolUpdate()
        let sideOffset = (this.canvas.width-this.gameSize.x)/2
        console.log(sideOffset)
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
            {
                let x = ((tilesize.x/2)*(size-2)+(tilesize.x/2)*ix-tilesize.y*iy+this.offset[0]+sideOffset)
                let y = ((tilesize.y/2)*ix+(tilesize.y/2)*iy-tilesize.x+this.offset[1])
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
    drawImageWithScale(drawer,img,x,y,w,h)
    {
        let image = document.createElement("img")
        image.src = img
        drawer.drawImage(image,x,y,w,h)
    }
}
function withinBounds(x,y,w,h,px,py)
{
    return px > x && 
        px < x+w &&
        py > y && 
        py < y+h
        
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
    addBar(bars,gameStats[1][1]).className += colors.turkis
    addBar(bars,gameStats[2][1]).className += colors.lime
    addBar(bars,gameStats[3][1]).className += colors.red
    addBar(bars,gameStats[4][1]).className += colors.yellow
    addBar(bars,gameStats[5][1]).className += colors.yellow
    addBar(bars,gameStats[6][1]).className += colors.turkis
    addBar(bars,gameStats[7][1]).className += colors.blue
    addBar(bars,gameStats[8][1]).className += colors.lime
    addBar(bars,gameStats[9][1]).className += colors.yellow
    addBar(bars,gameStats[11][1]).className += colors.lime
}