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
    constructor(source)
    {
        this.name = source.name
        this.source = source
        this.rotation = 0
        this.extraStats = []
        for(let i in stats)
            this.extraStats.push([stats[i],0])
    }

    spriteOffset = function()
    {
        return this.source.spriteOffset()
    }

    getStat(stat)
    {
        return [stat,this.source.stats.filter(p => p[0] == stat)[0][1] + this.extraStats.filter(p => p[0] == stat)[0][1]]
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
        gameStats.filter(p => p[0] == this.stats.filter(s => s[0] == "food")[0][0])[0][1].var += this.stats.filter(s => s[0] == stats.food)[0][1]
    }

}
class BuildingType
{
    constructor(name)
    {
        this.name = name
        this.heightDiff = 0
        this.stats = []
        this.type = type.none
        this.floor = false
        this.turnable = false
        for(let i in stats)
            this.stats.push([stats[i],0])
        allBuildings.push(this)
    }
    canPlace(x,y)
    {
        if (this.floor)
            return gameSystem.tileGridUnder[x][y] == null
        return gameSystem.tileGrid[x][y] == null
    }

    getStat(stat)
    {
        return this.stats.filter(p => p[0] == stat)[0]
    }

    spriteOffset()
    {
        return [8,0]
    }

    setStat(stat,value)
    {
        this.getStat(stat)[1] = value
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
            return "./img/buildings/" + this.name + "/" + this.name + "-"+rotation+".png"
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
        this.stats.forEach(a =>
            {
                gameStats.filter(p => p[0] == a[0])[0][1].var += a[1]
            }
            )
        let build = new Building(this)
        if (this.turnable)
            build.rotation = rotation
        return build
    }
}
//road
class Road extends Building
{
    constructor(source,position)
    {
        super(source)
        this.position = {
            x: position%gameSystem.tileGrid.length,
            y: Math.floor(position/gameSystem.tileGrid.length)
        } 
        console.log(this.position)
    }

    getSprite = function()
    {
        let i = 0
        let c = null
        let top = gameSystem.tileGrid[this.position.x][this.position.y]
        let blocked = [false,false]
        if (top != null) {
            if (top instanceof Reference) {
                if (top.getRef().position.x > this.position.x)
                    blocked[1] = true
                if (top.getRef().position.y > this.position.y)
                    blocked[0] = true
            }
        }
        if (this.position.x != 0)
            c = gameSystem.tileGridUnder[this.position.x-1][this.position.y]
        if (!blocked[0] && this.position.x > 0 && c != null && c.source == this.source)
            i+=1
        c = null
        if (this.position.y != 0)
            c = gameSystem.tileGridUnder[this.position.x][this.position.y-1]
        if (!blocked[1] && this.position.y > 0 && c != null && c.source == this.source)
            i+=2
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
    }
    getIcon = function()
    {
        return "./img/road/" + this.name + "-1.png"
    }
    spriteOffset = function()
    {
        return [0,0]
    }
    getSprite = function(r)
    {
        return "./img/road/" + this.name + "-3.png"
    }
    build = function(r,position)
    {
        return new Road(this,position)
    }
}
class MultiBuilding extends Building
{
    constructor(source,position,rotation)
    {
        super(source)
        this.rotation = rotation
        let other = this.rotation%2 == 0
        this.position = {
            x: position%gameSystem.tileGrid.length,
            y: Math.floor(position/gameSystem.tileGrid.length)
        } 
        this.dim = {
            w: other ? this.source.width : this.source.height,
            h: other ? this.source.height : this.source.width
        }
        for(let ix = 0;ix < this.dim.w;ix++)
            for(let iy = 0;iy < this.dim.h;iy++)
            {
                console.log(ix+"|"+iy)
                if (gameSystem.tileGrid[this.position.x - ix][this.position.y - iy] == this) continue
                gameSystem.tileGrid[this.position.x - ix][this.position.y - iy] = new Reference(this)
            }
    }

    spriteOffset = function()
    {
        return [this.rotation%2*-24,0]
    }

    getSprite = function()
    {
        if (this.source.turnable)
            return "./img/buildings/" + this.name + "/" + this.name + "-" + this.rotation + ".png"
        return "./img/buildings/" + this.name + "/" + this.name + ".png"
    }
}
class MultiBlockType extends BuildingType
{
    constructor(name)
    {
        super(name)
        this.width = 1
        this.height = 1
    }
    canPlace = function(x,y)
    {
        let cx = gameSystem.buildrotation % 2 == 0 ? this.width : this.height
        let cy = gameSystem.buildrotation % 2 == 0 ? this.height : this.width
        let grid = this.floor ? gameSystem.tileGridUnder : gameSystem.tileGrid
        console.log(x + "|" + y)
        for(let ix = 0;ix < cx;ix++)
            for(let iy = 0;iy < cy;iy++)
                if (grid[x-ix][y-iy] != null || x-ix < 0 || y-iy < 0)
                    return false
        return true
    }
    spriteOffset = function()
    {
        return [gameSystem.buildrotation%2*-24,0]
    }
    getIcon = function()
    {
        return "./img/buildings/" + this.name + "/" + this.name + "-icon.png"
    }
    build = function(rotation,position)
    {
        return new MultiBuilding(this,position,rotation)
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
    getSprite() {return ""}
    spriteOffset() {return [0,0]}
}