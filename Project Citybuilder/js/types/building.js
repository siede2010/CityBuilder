function building()
{

}
function getBuildingsOfType(selectedType)
{
    return allBuildings.filter(building => building.type == selectedType)
}
let allBuildings = []
class Building
{
    constructor(source,position)
    {
        this.name = source.name
        this.source = source
        this.position = position
        this.rotation = 0
        this.extraStats = {}
        for(let i in stats)
            this.extraStats[i] = 0
    }

    spriteOffset = function()
    {
        return this.source.spriteOffset()
    }

    getStat(stat)
    {
        return this.source.stats[stat] + this.extraStats[stat]
    }
    
    getAllStats()
    {
        let allStats = []
        for(let i in this.source.stats)
            allStats.push(this.source.stats[i])
        this.extraStats.forEach(s => allStats.filter(f => f[0] == s[0])[0][1] += s[1])
        return allStats
    }
    changeStat(stat,value)
    {
        this.extraStats.filter(f => f[0] == stat)[0][1] += value
        return this
    }

    getSprite()
    {
        if (this.source.turnable)
            return "./img/buildings/" + this.name + "/" + this.name + "-" + this.rotation + ".png"
        return "./img/buildings/" + this.name + "/" + this.name + ".png"
    }

    update()
    {
        gameStats.food += this.getStat(stats.food)/30
    }

    deconstruct() {
        gameStats["cost"] -= this.source.stats["cost"] * 0.5;
        this.remove();
    }

    remove() {
        for(let i in this.source.stats)
            gameStats[i] -= this.source.stats[i]
        gameStats["cost"] += this.source.stats["cost"]
        let grid = this.source.floor ? gameSystem.tileGridUnder : gameSystem.tileGrid
        grid.set(this.position,new noBuild([this.source.floor]))
    }

}
class BuildingType
{
    constructor(name)
    {
        this.name = name
        this.heightDiff = 0
        this.stats = {}
        this.type = type.none
        this.floor = false
        this.turnable = false
        this.rotations = 4;
        this.score = 0;
        for(let i in stats)
            this.stats[i] = 0
        allBuildings.push(this)
    }
    canPlace(x,y)
    {
        let grid = this.floor ? gameSystem.tileGridUnder : gameSystem.tileGrid
        return grid.get(x,y) instanceof noBuild
    }

    getStat(stat)
    {
        return this.stats[stat]
    }

    spriteOffset()
    {
        return [4,0]
    }

    setStat(stat,value)
    {
        this.stats[stat] = value
        return this
    }

    getThis(executable)
    {
        executable.call(null,this)
        return this
    }

    getSprite(rotation)
    {
        if (this.turnable)
            return "./img/buildings/" + this.name + "/" + this.name + "-"+rotation%this.rotations+".png"
        return "./img/buildings/" + this.name + "/" + this.name + ".png"
    }

    getIcon()
    {
        if (this.turnable)
            return "./img/buildings/" + this.name + "/" + this.name + "-0.png"
        return "./img/buildings/" + this.name + "/" + this.name + ".png"
    }

    build()
    {
        return new Building(this)
    }
    build(rotation,pos)
    {
        this.pay();
        let build = new Building(this,pos)
        if (this.turnable)
            build.rotation = rotation%this.rotations
        return build
    }
    pay()
    {
        endScore += this.score;
        for (let stat in this.stats)
        {
            gameStats[stat] += this.stats[stat]
        }
    }
}
//road
class Road extends Building
{
    constructor(source,position)
    {
        super(source,position)
        this.connections = 0;
        this.position = {
            x: position%gameSystem.tileGrid.width,
            y: Math.floor(position/gameSystem.tileGrid.width)
        } 
    }

    getSprite = function()
    {
        let i = 0
        let top = gameSystem.tileGrid.get(this.position.x,this.position.y)
        let blocked = [false,false]
        if (top instanceof Reference) {
            if (top.getRef().position.x > this.position.x)
                blocked[1] = true
            if (top.getRef().position.y > this.position.y)
                blocked[0] = true
        }
        let c = null
        if (this.position.x != 0)
            c = gameSystem.tileGridUnder.get(this.position.x-1,this.position.y)
        if (!blocked[0] && this.position.x > 0 && c != null && c.source == this.source)
            i+=1
        c = null
        if (this.position.y != 0)
            c = gameSystem.tileGridUnder.get(this.position.x,this.position.y-1)
        if (!blocked[1] && this.position.y > 0 && c != null && c.source == this.source)
            i+=2
        if (i != 0 && i != this.connections)
        {
            this.connections = i;
            this.source.connectEvent(this)
        }
        return "./img/road/" + this.name + "-" + i + ".png"
    }
}
class RoadType extends BuildingType
{
    constructor(name)
    {
        super(name)
        this.floor = true
        this.turnable = false
        this.connectEvent = (building) => {}
    }
    getIcon = function()
    {
        return "./img/road/" + this.name + "-icon.png"
    }
    spriteOffset = function()
    {
        return [-4,0]
    }
    getSprite = function(r)
    {
        return "./img/road/" + this.name + "-3.png"
    }
    build = function(r,position)
    {
        this.pay();
        return new Road(this,position)
    }
}
class MultiBuilding extends Building
{
    constructor(source,position,rotation)
    {
        super(source,rotation)
        this.rotation = rotation
        let other = this.rotation%2 == 0
        this.tiles = []
        this.position = {
            x: position%gameSystem.tileGrid.width,
            y: Math.floor(position/gameSystem.tileGrid.width)
        } 
        this.dim = {
            w: other ? this.source.width : this.source.height,
            h: other ? this.source.height : this.source.width
        }
        for(let ix = 0;ix < this.dim.w;ix++)
            for(let iy = 0;iy < this.dim.h;iy++)
            {
                if (gameSystem.tileGrid.get(this.position.x - ix,this.position.y - iy) == this) continue
                gameSystem.tileGrid.set(this.position.x - ix,this.position.y - iy,new Reference(this))
                this.tiles.push({x:this.position.x - ix,y:this.position.y - iy})
            }
    }

    spriteOffset = function()
    {
        let diff = Math.abs(this.source.width-this.source.height)
        if (this.source.turnable)
            return [(this.rotation%2*-24) * diff + this.source.xOffset,0]
        return [-24 + this.source.xOffset,0]
    }

    getSprite = function()
    {
        if (this.source.turnable)
            return "./img/buildings/" + this.name + "/" + this.name + "-" + this.rotation + ".png"
        return "./img/buildings/" + this.name + "/" + this.name + ".png"
    }
    remove = function() {
        for(let i in this.source.stats)
            gameStats[i] -= this.source.stats[i]
        let grid = this.source.floor ? gameSystem.tileGridUnder : gameSystem.tileGrid
        grid.set(this.position,new noBuild([this.source.floor]))
        for(let tile in this.tiles)
            grid.set(this.tiles[tile].x,this.tiles[tile].y,new noBuild([this.source.floor]))
    }
}
class MultiBlockType extends BuildingType
{
    constructor(name)
    {
        super(name)
        this.width = 1
        this.height = 1
        this.xOffset = 0;
    }
    canPlace = function(x,y)
    {
        let cx = gameSystem.buildrotation % 2 == 0 ? this.width : this.height
        let cy = gameSystem.buildrotation % 2 == 0 ? this.height : this.width
        let grid = this.floor ? gameSystem.tileGridUnder : gameSystem.tileGrid
        for(let ix = 0;ix < cx;ix++)
            for(let iy = 0;iy < cy;iy++)
                if (!(grid.get(x-ix,y-iy) instanceof noBuild) || x-ix < 0 || y-iy < 0)
                    return false
        return true
    }
    spriteOffset = function()
    {
        let diff = Math.abs(this.width-this.height)
        if (this.turnable)
            return [(gameSystem.buildrotation%2*-24) * diff + this.xOffset,0]
        return [-24 + this.xOffset,0]
    }
    getIcon = function()
    {
        return "./img/buildings/" + this.name + "/" + this.name + "-icon.png"
    }
    build = function(rotation,position)
    {
        this.pay();
        return new MultiBuilding(this,position,rotation%this.rotations)
    }
}
class Reference
{
    constructor(ref)
    {
        this.source = ref.source
        this.ref = ref
    }
    getRef()
    {
        return this.ref
    }
    update() {return}
    getSprite() {return ""}
    spriteOffset() {return [0,0]}
    remove() {
        this.ref.remove()
    }
    deconstruct() {
        this.ref.deconstruct()
    }
}
class noBuild
{
    constructor(args)
    {
        this.floor = args[0]
        this.source = this;
        this.heightDiff = 0
    }
    getSprite() {
        if(gameSystem.drawPlace && gameSystem.towerSelected.floor != !this.floor)
        {
            return "./img/buildings/empty.png"
        }
        return ""
    }
    spriteOffset() {return [-4,0]}
    update() {}
    remove() {}
    deconstruct() {}
}