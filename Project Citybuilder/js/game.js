let tilesize = {x:48,y:24}
let gameUI,bars,gameStats
function game() {
    gameUI = getElementById(hidden,"gameUi")
    bars = getElementById(getElementById(gameUI,"row1"),"bars")
    gameStats = []
    for (let i in stats)
        gameStats.push([stats[i],new GlobalVar(statStartValue[stats[i]]).setName(stats[i])])
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
    barOut.style = "margin:4px;"
    barIn.className = "progress-bar progress-bar-striped "
    let b = document.createElement("b")
    barIn.append(b)
    barOut.addEventListener("mouseenter",(e) => {
        b.innerText = trackValue.name
    })
    barOut.addEventListener("mouseleave",(e) => {
        b.innerText = ""
    })
    barUpdates.push([setInterval(updateBar,100),trackValue,barIn,0])
    barIn.color = function(colorstring)
    {
        this.style = "background-color: #" + colorstring + ";"
        this.color = colorstring
    }
    return barIn
}
function updateBar()
{

    if (barUpdates[barIndex][1].getVar() < 0)
    {
        if (barUpdates[barIndex][1].getVar() < dangerLimit[barUpdates[barIndex][1].name] )
        {
            barUpdates[barIndex][2].style = "background-color: #" + (barUpdates[barIndex][3] == 0 ? "ff0000" : "ff4444") +" !important; margin-left:auto ;margin-right:0"
            barUpdates[barIndex][2].style.width = barUpdates[barIndex++][1].getVar() * -1 + "%"
        }
        else {
            barUpdates[barIndex][2].style = "background-color: #ff0000 !important; margin-left:auto ;margin-right:0"
            barUpdates[barIndex][2].style.width = barUpdates[barIndex++][1].getVar() * -1 + "%"
        }
    }
    else
    {
        barUpdates[barIndex][2].style = "background-color: #" + barUpdates[barIndex][2].color + ";"
        barUpdates[barIndex][2].style.width = barUpdates[barIndex++][1].getVar() + "%"
    }
    barIndex%=barUpdates.length
}

class Grid2D
{
    constructor(size,cons)
    {
        this.list = []
        this.width = size;
        if (cons == null) {
            for(let i = size*size;i > 0;i--)
                this.list.push(null)
        } else {
            for(let i = size*size;i > 0;i--)
            this.list.push(new cons())
        }
    }

    get(x,y)
    {
        return this.list[x+y*this.width];
    }

    set(x,y,value)
    {
        this.list[x+y*this.width] = value;
    }

    index(i)
    {
        return this.list[i];
    }

    forEach(cons)
    {
        this.list.forEach(cons);
    }
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
        this.buildrotation = 0
        this.particles = []
        this.clickPos = [0,0]
        this.timer = 240
        this.gridSelected = {
            x:-1,
            y:-1
        }
        this.parent = vessel;
        gameSystem = this
        this.selectedArrow = 0
        this.selectableTool = [
            [14,16,"security"],
            [60,16,"nature"],
            [108,16,"population"],
            [156,16,"work"],
            [202,16,"happiness"],
        ]
        this.typeOrder = [
            type.security,
            type.nature,
            type.population,
            type.work,
            type.happiness
        ]
        this.towers = {
            security : getBuildingsOfType(type.security),
            nature : getBuildingsOfType(type.nature),
            population : getBuildingsOfType(type.population),
            work : getBuildingsOfType(type.work),
            happiness : getBuildingsOfType(type.happiness)
        }
        this.selectedTower = {
            security : 0,
            nature : 0,
            population : 0,
            work :  0,
            happiness : 0
        }
        this.hoverIndex = -1
        this.selectedIndex = -1
        this.offset = [24,96]

        //Normal Ground Tile Set
        this.tileGrid = new Grid2D(size,noBuild)

        this.gameSize = { x:size*tilesize.x, 
                          y:size*tilesize.y}

        //Floor Ground Tile Set
        this.tileGridUnder = new Grid2D(size,noBuild)

        //PlayField
        this.canvas = document.createElement("canvas")
        this.canvas.width = canvasX;
        this.canvas.height = canvasY;
        getElementById(this.parent,"row1").append(this.canvas)

    

        //Events
        this.canvas.addEventListener("mousedown",(e) => {
            this.clickPos = this.getMousePosition(this.canvas,e)
            
            if (this.gridSelected.x != -1 && this.gridSelected.y != -1 && this.selectedIndex != -1)
            {
                let tower = this.towers[this.typeOrder[this.selectedIndex]][this.selectedTower[this.typeOrder[this.selectedIndex]]]
                if (tower.floor == true)
                    this.tileGridUnder[this.gridSelected.x][this.gridSelected.y] = tower.build(this.buildrotation,this.gridSelected.y * this.tileGrid.length + this.gridSelected.x)
                else 
                    this.tileGrid[this.gridSelected.x][this.gridSelected.y] = tower.build(this.buildrotation,this.gridSelected.y * this.tileGrid.length + this.gridSelected.x)
            }
            //Index Select
            if (this.hoverIndex != -1)
                if (this.hoverIndex == this.selectedIndex)
                    this.selectedIndex = -1
                else
                    this.selectedIndex = this.hoverIndex
            if (this.selectedIndex == -1)
            {
                if (this.selectedArrow == 1)
                {
                    for (let i in this.selectedTower)
                    {
                        this.selectedTower[i] = ++this.selectedTower[i] % this.towers[i].length
                    }
                }
                else if (this.selectedArrow == 2)
                {
                    for (let i in this.selectedTower)
                    {
                        this.selectedTower[i] = --this.selectedTower[i] < 0 ? this.towers[i].length-1 : this.selectedTower[i]
                    }
                }
            }
            else {
                if (this.selectedArrow == 1)
                {
                    this.selectedTower[this.typeOrder[this.selectedIndex]] = ++this.selectedTower[this.typeOrder[this.selectedIndex]] % this.towers[this.typeOrder[this.selectedIndex]].length
                }
                else if (this.selectedArrow == 2)
                {
                    this.selectedTower[this.typeOrder[this.selectedIndex]] = --this.selectedTower[this.typeOrder[this.selectedIndex]] < 0 ? this.towers[this.typeOrder[this.selectedIndex]].length-1 : this.selectedTower[this.typeOrder[this.selectedIndex]]
                }
            }
        this.drawPlace = this.selectedIndex != -1;
        })

        document.addEventListener("keypress",(e) => {
            if (e.key == "e") {
                this.buildrotation += 1
                this.buildrotation %= 4
            }
            else if (e.key == "q") {
                this.buildrotation -= 1
                if (this.buildrotation < 0)
                    this.buildrotation = 3
            }
        })

        this.MousePos = [0,0]
        this.canvas.addEventListener("mousemove",(e) => {
            this.MousePos = this.getMousePosition(this.canvas,e)
        })

        this.canvas.addEventListener("mouseleave",(e) => {
            this.MousePos = [0,0]
            this.gridSelected.x = -1
            this.gridSelected.y = -1
        })

        this.floor = this.canvas.height-64

        //drawSystem
        drawer.setCanvas(this.canvas)
        drawer.addDraw((drawer,args) => {
            drawFill(drawer,0,0,canvasX,canvasY,"#4db938")
        },null)
        //Bottom
        let offsetFSide = (this.canvas.width-this.gameSize.x)/2
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
                {
                    let ind = ix+iy*size;
                    let x = (ix-iy-1) * tilesize.x/2 +
                    this.canvas.width/2

                    let y = 25 + (iy+ix) * tilesize.y/2

                    drawer.addDraw((drawer,args) => {
                        let index = args[0];
                        let fx = args[1];
                        let fy = args[2];
                        drawImage(drawer,this.tileGridUnder.index(index).getSprite(),fx,fy)
                    },ind,x,y)
                }
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
                {
                    let ind = ix+iy*size;
                    let x = (ix-iy-1) * tilesize.x/2 +
                    this.canvas.width/2

                    let y = 25 + (iy+ix) * tilesize.y/2

                    drawer.addDraw((drawer,args) => {
                        let index = args[0];
                        let fx = args[1];
                        let fy = args[2];
                        drawImage(drawer,this.tileGrid.index(index).getSprite(),fx,fy)
                    },ind,x,y)
                }

        let toolOffset = (this.canvas.width - 320)/2
        drawer.addDraw((drawer,args) => {
            drawImageWithScale(drawer,"./img/ui/Toolbar.png",toolOffset,this.floor,320,64)
        },null);
        for(let s in this.selectableTool)
        {
            let x = this.selectableTool[s][0];
            let y = this.selectableTool[s][1];
            drawer.addDraw((drawer,args) => {
                let tower = this.towers[args[0]][this.selectedTower[args[0]]]
                drawImage(drawer,tower.getIcon(),args[1]+tower.spriteOffset()[0],args[2]+tower.spriteOffset()[1],64,64)
            },this.selectableTool[s][2],x+toolOffset,this.floor+y)
        }

        drawer.addDraw((drawer,args) => {
            if (this.selectedIndex > -1)
                drawImageWithScale(drawer,"./img/ui/selected.png",toolOffset+this.selectableTool[this.selectedIndex][0],this.floor+this.selectableTool[this.selectedIndex][1],320,64)
        },null);

        drawer.addDraw((drawer,args) => {
            drawImageWithScale(drawer,"./img/ui/Toolbar-lowBar.png",toolOffset,this.floor,320,64)
        },null);


        //animation
        this.animateInterval = setInterval(() => {
            this.update();
            drawer.update();
        },32)
    }
    toolAnimate()
    {
        gameSystem.toolUpdate()
    }

    timerUp(string)
    {
        this.canvas.remove()
        barUpdates.forEach(u => clearInterval(u))
        score(0,string)
    }

    update()
    {

    }

    /*
    toolUpdate()
    {
        //Static Variables
        let toolDraw = this.canvas.getContext("2d")
        let toolOffset = (this.canvas.width - 320)/2
        let arrowOffset = 256
        let i = 0
        let found = false
        //DrawToolbar
        drawImageWithScale(toolDraw,"./img/ui/Toolbar.png",toolOffset,this.floor,320,64)

        //drawBuilding
        this.typeOrder.forEach(type => {
            if (this.towers[type].length > 0) {
                drawImage(
                    toolDraw,
                    this.towers[type][this.selectedTower[type]].getIcon(),
                    this.selectableTool[i][0] + toolOffset + 4,
                    this.selectableTool[i][1] + this.floor
                )
            }
            i++
        })

        //Selected Draw
        if (this.selectedIndex != -1)
            drawImageWithScale(toolDraw,"./img/ui/selected.png",this.selectableTool[this.selectedIndex][0]+toolOffset,this.selectableTool[this.selectedIndex][1]+this.floor,40,40)
        for (let i in this.selectableTool)
        {
            let pos = this.selectableTool[i]
            
            if (withinBounds(pos[0]+toolOffset,pos[1]+this.floor,40,40,this.MousePos[0],this.MousePos[1])) {
                drawImageWithScale(toolDraw,"./img/ui/hover.png",this.selectableTool[i][0]+toolOffset,this.selectableTool[i][1]+this.floor,40,40)
                this.hoverIndex = i
                found = true
            }
        }

        //Draw Arrows
        if (!found)
            this.hoverIndex = -1
        let arrowIcon = this.floor > this.MousePos[1] || 
            toolOffset + arrowOffset > this.MousePos[0] || 
            toolOffset + 320 < this.MousePos[0] ? null :
            this.floor + 32 > this.MousePos[1] ?
                "./img/ui/Toolbar-arrow-up.png" :
                "./img/ui/Toolbar-arrow-down.png"
        if (arrowIcon != null)
        {
            if (arrowIcon == "./img/ui/Toolbar-arrow-up.png")
                this.selectedArrow = 1
            else
                this.selectedArrow = 2
            drawImageWithScale(toolDraw,arrowIcon,toolOffset,this.floor,320,64)
        }
        else
            this.selectedArrow = 0

        //Cut off buildings
        drawImageWithScale(toolDraw,"./img/ui/Toolbar-lowBar.png",toolOffset,this.floor,320,64)
    }

    drawSelect()
    {
        let selDraw = this.canvas.getContext("2d")

        selDraw.font = "18px serif";
        let x = (this.MousePos[0] - (this.canvas.width-this.gameSize.x)/2 - this.tileGrid.length * tilesize.x/2)
        let y = this.MousePos[1] - this.margin - tilesize.y
        let gridX = Math.floor((x/2 + y) / (tilesize.x/2))
        let gridY = Math.floor((-x/2 + y) / (tilesize.x/2))
        let gridSize = this.tileGrid.length
        if (
            gridX >= 0 && 
            gridY >= 0 && 
            gridX < gridSize && 
            gridY < gridSize && 
            this.selectedIndex != -1
            ) {
                let block = this.towers[this.typeOrder[this.selectedIndex]][this.selectedTower[this.typeOrder[this.selectedIndex]]]
                if (
                    (
                        block != null 
                        && 
                        !block.floor 
                        &&
                        block.canPlace(gridX,gridY)
                    ) 
                    || 
                    (
                        block != null 
                        && 
                        block.floor
                        &&
                        block.canPlace(gridX,gridY)
                    )
                   )
                {
                    selDraw.globalAlpha = 0.6
                    drawImage(selDraw,block.getSprite(this.buildrotation),(this.canvas.width-this.gameSize.x)/2 + this.tileGrid.length * tilesize.x/2+gridX*tilesize.x/2 - gridY *tilesize.x/2 - tilesize.x/2+block.spriteOffset()[0],this.margin+gridY * tilesize.y/2 + gridX * tilesize.y/2+tilesize.y-6-block.heightDiff-block.spriteOffset()[1])
                    // ---------------------------------Debug tool----------------------------------------- //
                    // selDraw.strokeText("["+ gridX + "|" + gridY+"]", this.MousePos[0], this.MousePos[1]) //
                    // ------------------------------------------------------------------------------------ //
                    selDraw.globalAlpha = 1
                    this.gridSelected.x = gridX
                    this.gridSelected.y = gridY
                }
                else
                {
                    this.gridSelected.x = -1
                    this.gridSelected.y = -1
                }
            }
            else
            {
                this.gridSelected.x = -1
                this.gridSelected.y = -1
            }
    }
    */

    isGameOver()
    {
        return gameStats.filter(p => p[1].var <= gameOverStats[p[0]]).length != 0
    }

    destroy()
    {
        clearInterval(this.animateInterval)
        clearInterval(this.toolAnimateInterval)
    }

    getMousePosition(canvas,click)
    {
        let rect = canvas.getBoundingClientRect()
        return [click.clientX - rect.left,click.clientY - rect.top]
    }
        /*
        let drawer = this.canvas.getContext("2d")
        let size = this.tileGrid.length
        drawer.font = "18px serif";
        drawer.fillStyle = "#4db938"
        drawer.fillRect(0,0,this.canvas.width,this.canvas.height)
        this.toolUpdate()
        let sideOffset = (this.canvas.width-this.gameSize.x)/2
        let towerFloor = false
        if (this.drawPlace)
            towerFloor = this.towers[this.typeOrder[this.selectedIndex]][this.selectedTower[this.typeOrder[this.selectedIndex]]].floor
        //Draw Sea
        for(let i1 = 0;i1<size-1;i1++)
            for(let i2 = 0;i2<2*i1-1;i2++)
            {
                let x = i1 * tilesize.x - i2 * (tilesize.x / 2) - sideOffset - (tilesize.x / 2) - tilesize.x
                let y = i2 * (tilesize.y / 2) - (tilesize.y / 2) - 2 - tilesize.y
                switch (size-i1-2)
                {
                    case 0:
                        drawImage(drawer,"./img/environment/sea-land.png",x,y)
                        break;
                    case 1:
                        drawImage(drawer,"./img/environment/sea-deep1.png",x,y)
                        break;
                    case 2:
                        drawImage(drawer,"./img/environment/sea-deep2.png",x,y)
                        break;
                    default:
                        drawImage(drawer,"./img/environment/sea-deep-max.png",x,y)
                        break;
                }
            }
        //Bottom
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
                {
                    let x = ((tilesize.x/2)*(size-2)+(tilesize.x/2)*ix-tilesize.y*iy+this.offset[0]+sideOffset)
                    let y = ((tilesize.y/2)*ix+(tilesize.y/2)*iy-tilesize.x+this.offset[1])
                    if (this.tileGridUnder[ix][iy] == null) {
                        if (this.drawPlace && towerFloor) 
                            drawImage(drawer,"./img/buildings/empty.png",x,y)
                    }
                    else
                        drawImage(drawer,this.tileGridUnder[ix][iy].getSprite(),x+this.tileGridUnder[ix][iy].spriteOffset()[0],y-this.tileGridUnder[ix][iy].source.heightDiff+this.tileGridUnder[ix][iy].spriteOffset()[1])
                }
        //Top
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
            {
                let x = ((tilesize.x/2)*(size-2)+(tilesize.x/2)*ix-tilesize.y*iy+this.offset[0]+sideOffset)
                let y = ((tilesize.y/2)*ix+(tilesize.y/2)*iy-tilesize.x+this.offset[1])
                if (this.tileGrid[ix][iy] == null) {
                    if (this.drawPlace && !towerFloor) 
                        drawImage(drawer,"./img/buildings/empty.png",x,y)
                }
                else
                    drawImage(drawer,this.tileGrid[ix][iy].getSprite(),x+this.tileGrid[ix][iy].spriteOffset()[0],y-this.tileGrid[ix][iy].source.heightDiff+this.tileGrid[ix][iy].spriteOffset()[1])
            }
        drawer.fillStyle = "#000000"
        drawer.fillText("Time Left : " + Math.floor(this.timer/60) + ":" + this.timer%60, this.canvas.width-125, 20)
        drawer.fillText("Money : " + gameStats.filter(g=>g[0] == "Cost")[0][1].getVar(), 10, 20)
        if (this.MousePos.filter(i => i==0).length == 0)
            this.drawSelect()
            */

        /*
        this.tutorialCanvas = document.createElement("canvas")
        this.tutorialCanvas.width = this.canvas.width
        this.tutorialCanvas.height = this.canvas.height
        this.canvas.parentElement.append(this.tutorialCanvas)
        this.canvas.remove()
        let tutDraw = this.tutorialCanvas.getContext("2d")
        let tempTime = this.timer
        let texts = text.split('\n')
        this.timer = 9999999
        tutDraw.font = "18px serif"
        tutDraw.fillStyle = "#4db938"
        tutDraw.fillRect(0,0,this.tutorialCanvas.width,this.tutorialCanvas.height)
        tutDraw.fillStyle = "#000000"
        for(let i = 0;i<texts.length;i++)
            tutDraw.fillText(texts[i],this.tutorialCanvas.width/2-texts[i].length*4,this.tutorialCanvas.height/2 + i * 15 - texts.length * 7.5)
        tutDraw.fillText("Press anywhere to continue",10,this.tutorialCanvas.height-10)   
        this.tutorialCanvas.addEventListener("click",(e) => {
            this.tutorialCanvas.parentElement.append(this.canvas)
            this.tutorialCanvas.remove()
            this.timer = tempTime
        })

    placeDraw(bool)
    {
        this.drawPlace = bool
        this.updateGrid()
    }
    */
}

withinBounds = (x,y,w,h,x2,y2) =>
{
    return x2 > x && 
        x2 < x+w &&
        y2 > y && 
        y2 < y+h
        
}

function initiateGame()
{
    m.remove()
    document.body.append(gameUI)
    gameSystem = new GameSystem(10,30,gameUI,gameStats)
    loadBars()
}
function initiateTutorial()
{
    m.remove()
    document.body.append(gameUI)
    gameSystem = new GameSystem(4,30,gameUI,gameStats)
    gameSystem.timer = 30
    gameSystem.tutorialText("Click on icon to select it.\nThe Arrows on the Right allows you\nto scroll through the selected category.\nthe arrows on the right will\nscroll through ALL CATEGORY'S\nif nothing was selected\nFood will NOT remain static\nlike the other things.\nGoodluck =)")
    gameSystem.tileGrid[0][0] = forest.build(0)
    loadBars()
}
function loadBars()
{
    for (let i in stats)
        gameStats.find(p=> p[0] == stats[i])[1] = new GlobalVar(statStartValue[stats[i]]).setName(stats[i])
    addBar(bars,gameStats[0][1]).className += colors.lime
    addBar(bars,gameStats[1][1]).className += colors.turkis
    addBar(bars,gameStats[2][1]).className += colors.lime
    addBar(bars,gameStats[3][1]).className += colors.red
    addBar(bars,gameStats[4][1]).className += colors.yellow
    addBar(bars,gameStats[5][1]).className += colors.yellow
    addBar(bars,gameStats[6][1]).className += colors.turkis
    addBar(bars,gameStats[7][1]).className += colors.blue
    addBar(bars,gameStats[8][1]).className += colors.lime
    addBar(bars,gameStats[9][1]).color("00DD99")
    addBar(bars,gameStats[11][1]).className += colors.lime
}