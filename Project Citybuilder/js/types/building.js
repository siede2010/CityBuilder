function building()
{

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
        if (turnable)
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
    }

    build()
    {
        return new Building(this)
    }
    build(rotation)
    {
        let build = new Building(this)
        if (this.turnable)
            build.rotation = rotation
        return build
    }
}