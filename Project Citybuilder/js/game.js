let tilesize = {x:48,y:24}
let gameUI,bars,gameStats
let audio = document.getElementById("mainSong");
function game() {
    gameUI = getElementById(hidden,"gameUi")
    bars = getElementById(getElementById(gameUI,"row1"),"bars")
    gameStats = {}
    for (let i in stats)
        gameStats[i] = 0
}
let gameSystem
let barInterv = []

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
        b.innerText = trackValue
    })
    barOut.addEventListener("mouseleave",(e) => {
        b.innerText = ""
    })
    let indexer = 0;
    let interval = setInterval(() => {
        let track = gameStats[trackValue]
        let name = trackValue

        if (track < 0)
        {
            if (track < dangerLimit[name] )
            {
                indexer++;
                indexer%=2;
                barIn.style = "background-color: #" + (indexer == 0 ? "ff0000" : "ff4444") +" !important; margin-left:auto ;margin-right:0"
                barIn.style.width = track * -1 + "%"
            }
            else {
                barIn.style = "background-color: #ff0000 !important; margin-left:auto ;margin-right:0"
                barIn.style.width = track * -1 + "%"
            }
        }
        else
        {
            barIn.style = "background-color: #" + barIn.color + ";"
            barIn.style.width = track + "%"
        }
    },100)
    barInterv.push(interval)
    barIn.color = function(colorstring)
    {
        this.style = "background-color: #" + colorstring + ";"
        this.color = colorstring
    }
    return barIn
}

class Grid2D
{
    constructor(size,cons,...args)
    {
        this.list = []
        this.width = size;
        if (cons == null) {
            for(let i = size*size;i > 0;i--)
                this.list.push(null)
        } else {
            for(let i = size*size;i > 0;i--)
                if(args.length > 0) 
                    this.list.push(new cons(args))
                else {
                    if (typeof cons == "function")
                        this.list.push(new cons())
                    else if (typeof cons == "object") {
                        let obj = {}
                        for(let ci in cons)
                            obj[ci] = cons[ci]
                        this.list.push(obj)
                    } else {
                        this.list.push(cons)
                    }
                }
        }
    }

    get(x,y)
    {
        return this.list[x+y*this.width];
    }

    set(x,y,value = undefined)
    {
        if (value == undefined)
            this.list[x] = y;
        else
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
    constructor(size,margin,vessel,stats,startTimer = 240)
    {
        //Static variables
        audio.currentTime = 0;
        endScore = 0;
        audio.volume = optionSetting.volume
        audio.play();
        this.lastU = 0;
        this.gameStats = stats
        let canvasX = Math.max(size*tilesize.x,380);
        let canvasY = size*tilesize.y+64+64;
        this.margin = margin;
        this.drawPlace = false
        this.buildrotation = 0
        this.disasterI = 0
        this.disasterC = 0
        this.particles = []
        this.clickPos = [0,0]
        this.intervalBetween = 30;
        if (startTimer > 60)
            this.intervalBetween = [60,30,30,15][optionSetting.diff]
        this.timer = startTimer;
        this.gridSelected = {
            x:-1,
            y:-1
        }
        this.parent = vessel;
        gameSystem = this
        this.selectedArrow = 0
        this.selectableTool = [
            [74,16,"security"],
            [120,16,"nature"],
            [168,16,"population"],
            [216,16,"work"],
            [262,16,"happiness"]
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
        this.interV = 0;
        this.offset = [24,96]

        //Normal Ground Tile Set
        this.tileGrid = new Grid2D(size,noBuild,false)

        this.gameSize = { x:size*tilesize.x, 
                          y:size*tilesize.y}

        this.tileGridPos = new Grid2D(size,{x:0,y:0})

        //Floor Ground Tile Set
        this.tileGridUnder = new Grid2D(size,noBuild,true)

        //PlayField
        this.canvas = document.createElement("canvas")
        this.canvas.width = canvasX;
        this.canvas.height = canvasY;
        this.towerSelected = null;
        getElementById(this.parent,"row1").append(this.canvas)

    

        //Events
        this.canvas.addEventListener("mousedown",(e) => {
            this.clickPos = this.getMousePosition(this.canvas,e)
            
            if (this.gridSelected.x != -1 && this.gridSelected.y != -1 && this.selectedIndex != -1)
            {
                let tower = this.towers[this.typeOrder[this.selectedIndex]][this.selectedTower[this.typeOrder[this.selectedIndex]]]
                if (tower.floor == true)
                    this.tileGridUnder.set(this.gridSelected.x,this.gridSelected.y,tower.build(this.buildrotation,this.gridSelected.y * this.tileGrid.width + this.gridSelected.x))
                else 
                    this.tileGrid.set(this.gridSelected.x,this.gridSelected.y,tower.build(this.buildrotation,this.gridSelected.y * this.tileGrid.width + this.gridSelected.x))
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
                let selType = this.typeOrder[this.selectedIndex]
                this.towerSelected = this.towers[selType][this.selectedTower[selType]]
                if (this.selectedArrow == 1)
                {
                    this.selectedTower[selType] = ++this.selectedTower[selType] % this.towers[selType].length
                }
                else if (this.selectedArrow == 2)
                {
                    this.selectedTower[selType] = --this.selectedTower[selType] < 0 ? this.towers[selType].length-1 : this.selectedTower[selType]
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
            let found = false;
            for (let i in this.selectableTool)
            {
                let pos = this.selectableTool[i]
                
                if (withinBounds(pos[0]+toolOffset,pos[1]+this.floor,40,40,this.MousePos[0],this.MousePos[1])) {
                    this.hoverIndex = i
                    found = true
                }
            }
            if (!found)
                this.hoverIndex = -1;
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
        //water
        drawer.addDraw((drawer,args)=>{
            drawImageWithScale(drawer,"./img/polyWater.png",0,0,args[0],args[1])
        },(size+1)*tilesize.x/2,(size+1)*tilesize.y/2)

        let listOfRockPos = []
        for(let y = this.canvas.height/2;y>=-tilesize.y*2;y-=tilesize.y/2)
            for(let x = this.canvas.width/1.6;y+x<=this.canvas.width;x+=tilesize.x)
            {
                let cX = x + y*2;
                listOfRockPos.push({x:cX,y:y})
            }
        listOfRockPos = listOfRockPos.reverse()
        drawer.addDraw((drawer,args)=>{ //rockDrawer
            let list = args[0]
            for(let i in list)
                drawImage(drawer,"./img/Rock.png",list[i].x,list[i].y)
        },listOfRockPos)

        //Bottom
        let offsetFSide = (this.canvas.width-this.gameSize.x)/2
        for(let ix = 0;ix<size;ix++)
            for(let iy = 0;iy<size;iy++)
                {
                    let ind = ix+iy*size;
                    let x = (ix-iy-1) * tilesize.x/2 +
                    this.canvas.width/2

                    let y = 25 + (iy+ix) * tilesize.y/2
                    this.tileGridPos.set(ind,{x:x,y:y})
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
                    this.canvas.width/2 + 4

                    let y = 25 + (iy+ix) * tilesize.y/2

                    drawer.addDraw((drawer,args) => {
                        let index = args[0];
                        let fx = args[1];
                        let fy = args[2];
                        let tile = this.tileGrid.index(index)
                        let offset = tile.spriteOffset()
                        drawImage(drawer,tile.getSprite(),fx+offset[0],fy+offset[1]-tile.source.heightDiff)
                    },ind,x,y)
                }

        let toolOffset = (this.canvas.width - 380)/2
        drawer.addDrawUI((drawer,args) => {
            drawImageWithScale(drawer,"./img/ui/Toolbar.png",toolOffset,this.floor,380,64)
        },null);
        for(let s in this.selectableTool)
        {
            let x = this.selectableTool[s][0];
            let y = this.selectableTool[s][1];
            drawer.addDrawUI((drawer,args) => {
                let tower = this.towers[args[0]][this.selectedTower[args[0]]]
                drawImage(drawer,tower.getIcon(),args[1]+ (tower instanceof MultiBlockType ? 0 : 4),args[2],64,64)
            },this.selectableTool[s][2],x+toolOffset,this.floor+y)
        }

        drawer.addDrawUI((drawer,args) => {
            if (this.hoverIndex > -1) {
                let pos = this.selectableTool[this.hoverIndex]
                drawImageWithScale(drawer,"./img/ui/hover.png",toolOffset+pos[0],this.floor+pos[1],40,40)
            }
        },null);

        drawer.addDrawUI((drawer,args) => {
            if (this.selectedIndex > -1) {
                let pos = this.selectableTool[this.selectedIndex]
                drawImageWithScale(drawer,"./img/ui/selected.png",toolOffset+pos[0],this.floor+pos[1],40,40)
            }
        },null);

        drawer.addDrawUI((drawer,args) => {
            drawImageWithScale(drawer,"./img/ui/Toolbar-lowBar.png",toolOffset,this.floor,380,64)
        },null);
        drawer.addDrawUI((drawer,args) => {
            let arrowIcon = this.floor > this.MousePos[1] || 
                toolOffset + 316 > this.MousePos[0] || 
                toolOffset + 380 < this.MousePos[0] ? null :
                this.floor + 32 > this.MousePos[1] ?
                    "up" :
                    "down"
            if (arrowIcon != null)
            {
                if (arrowIcon == "up")
                    this.selectedArrow = 1
                else
                    this.selectedArrow = 2
                drawImageWithScale(drawer,"./img/ui/Toolbar-arrow-"+arrowIcon+".png",toolOffset+60,this.floor,320,64)
            } else {
                this.selectedArrow = 0;
            }
        },null)

        let c1sel = (this.canvas.width-this.gameSize.x)/2
        drawer.addDraw((drawer,args) => {
            let halfTileSizeX = tilesize.x/2
            let halfTileSizeY = tilesize.y/2
            let x = this.MousePos[0] - args[0] - this.tileGrid.width * halfTileSizeX
            let y = this.MousePos[1] - this.margin - tilesize.y
            let gridX = Math.floor((x/2 + y) / halfTileSizeX)+1
            let gridY = Math.floor((-x/2 + y) / halfTileSizeX)+1
            let block = null;
            if (this.selectedIndex != -1)
                block = this.towers[this.typeOrder[this.selectedIndex]][this.selectedTower[this.typeOrder[this.selectedIndex]]]
            let gridSize = this.tileGrid.width
            if (
                gridX >= 0 && 
                gridY >= 0 && 
                gridX < gridSize && 
                gridY < gridSize && 
                block != null &&
                block.canPlace(gridX,gridY)
                ) {
                    drawer.globalAlpha = 0.6
                    let offset = block.spriteOffset()
                    drawImage(drawer,block.getSprite(this.buildrotation),args[1]+(gridX-gridY)*halfTileSizeX+offset[0]+4,args[2]+offset[1]+(gridY+gridX)*halfTileSizeY-block.heightDiff)
                    drawer.globalAlpha = 1
                    this.gridSelected.x = gridX
                    this.gridSelected.y = gridY
                    
                }
                else
                {
                    this.gridSelected.x = -1
                    this.gridSelected.y = -1
                }
        },c1sel,this.canvas.width/2-tilesize.x/2,tilesize.y)

        drawer.addDrawUI((drawer,args)=>{
            drawFill(drawer,5,5,args[0],10,"#000000")
            let colors = (this.timer/startTimer) > 0.4 ? ["#33aaff","#aaffff"] : ["#ffaa33","#ffffaa"]
            drawFill(drawer,6,6,(args[0]-3) * (this.timer/startTimer),8,colors[0])
            drawFill(drawer,Math.max((args[0]-3) * (this.timer/startTimer)-15,6),7,20,3,colors[1])
            for(let ti = 1;ti < args[1];ti++)
                drawFill(drawer,args[0] * ti/args[1],5,2,10,"#000000")
        },this.canvas.width-10,startTimer/this.intervalBetween);
        drawer.addDrawUI((draw,args)=>{
            drawFrame(draw,"./img/testSprite.png",10,20,32,32,args[0][1]++ == 0 ? args[0][0]++ : args[0][0])
            args[0][0]%=8;
            args[0][1]%=4;
            let st = gameStats.cost
            drawer.textStyle(22,"serif","#000000")
            drawer.drawText(40,50,st + "")
            drawer.textStyle(20,"serif","#ffffaa")
            drawer.drawText(42,49,st + "")
        },[0,0])


        //animation
        this.animateInterval = setInterval(() => {
            this.intervalupdate();
            drawer.update();
        },32)
    }
    toolAnimate()
    {
        gameSystem.toolUpdate()
    }

    randBorderPos()
    {
        switch(Math.floor(Math.random()*4))
        {
            case 0: //Left
                return [0,Math.random()*this.canvas.height]
            case 1: //Right
                return [this.canvas.width,Math.random()*this.canvas.height]
            case 2: //Top
                return [Math.random()*this.canvas.width,0]
            case 3: //Bottom
                return [Math.random()*this.canvas.width,this.canvas.height]
        }
    }

    tilesNear(x,y,range = 16)
    {
        let tilesInRange = []
        let ind = 0;
        this.tileGridPos.forEach(cPos => {
            let cDis = {x:cPos.x-x,y:cPos.y-y}
            let tDis = Math.abs(cDis.x) + Math.abs(cDis.y/2)
            if (tDis <= range)
                tilesInRange.push(ind)
            ind++
        })
        return tilesInRange;
    }

    timerUp(string)
    {
        this.canvas.remove()
        barInterv.forEach(b=>clearInterval(b))
        score(endScore,string)
        audio.pause();
    }

    intervalupdate() {gameSystem.update()}

    update()
    {
        let dif = audio.currentTime - this.lastU;
        this.timer-=dif;
        this.interV+=dif;
        this.lastU = audio.currentTime;
        if (audio.currentTime == audio.duration) this.timer = 0;
        if (this.interV > this.intervalBetween)
        {
            if (this.disasterI++ == 1) {
                this.disasterC++;
                this.disasterI %= 2;
            }
            for(let i = this.disasterC;i>0;i--)
                disasterList[Math.floor(Math.random()*disasterList.length)].create(1,30)
            this.interV%= this.intervalBetween;
            gameStats.cost += Math.round(gameStats.economics * 0.2 * gameStats.work + gameStats.work)
        }
        if (this.timer <= 0)
        {
            this.timerUp("You Won.");
            this.destroy();
            return;
        }
        this.tileGrid.forEach((t) => {t.update()})
        this.tileGridUnder.forEach((t) => {t.update()})
        if(this.isGameOver())
        {
            for(let name in gameStats)
                if (gameStats[name] <= gameOverStats[name])
                {
                    this.timerUp("Defeat : " + defeatStatement[name]);
                    break;
                }
            this.destroy()
        }
    }

    isGameOver()
    {
        for (let name in gameStats)
        {
            if (gameStats[name] <= gameOverStats[name]) 
                return true
        }
        return false;
    }

    destroy()
    {
        clearInterval(this.animateInterval)
        clearInterval(this.toolAnimateInterval)
        drawer.clearDraw();
    }

    getMousePosition(canvas,click)
    {
        let rect = canvas.getBoundingClientRect()
        return [click.clientX - rect.left,click.clientY - rect.top]
    }
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
    audio.currentTime = 256 - 240
    gameSystem.lastU = 256 - 240
    loadBars()
}
function initiateTutorial()
{
    m.remove()
    document.body.append(gameUI)
    gameSystem = new GameSystem(4,30,gameUI,gameStats,60)
    gameSystem.tileGrid.set(0,0,forest.build(0))
    loadBars()
    gameStats.cost = 1000
}
function loadBars()
{
    for (let i in gameStats)
        gameStats[i] = statStartValue[stats[i]]
    addBar(bars,numberStat[0]).className += colors.lime
    addBar(bars,numberStat[1]).className += colors.turkis
    addBar(bars,numberStat[2]).className += colors.lime
    addBar(bars,numberStat[3]).className += colors.red
    addBar(bars,numberStat[4]).className += colors.yellow
    addBar(bars,numberStat[5]).className += colors.yellow
    addBar(bars,numberStat[6]).className += colors.turkis
    addBar(bars,numberStat[7]).className += colors.blue
    addBar(bars,numberStat[8]).className += colors.lime
    addBar(bars,numberStat[9]).color("00DD99")
    addBar(bars,numberStat[11]).className += colors.lime
}