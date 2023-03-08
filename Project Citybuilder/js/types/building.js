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
    getStat(stat)
    {
        return this.stats.filter(p => p[0] == stat)[0]
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
        if (this.position.x != 0)
            c = gameSystem.tileGridUnder[this.position.x-1][this.position.y]
        if (this.position.x > 0 && c != null && c.source == this.source)
            i+=1
        c = null
        if (this.position.y != 0)
            c = gameSystem.tileGridUnder[this.position.x][this.position.y-1]
        if (this.position.y > 0 && c != null && c.source == this.source)
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
    getSprite = function(r)
    {
        return "./img/road/" + this.name + "-3.png"
    }
    build = function(r,position)
    {
        return new Road(this,position)
    }
}