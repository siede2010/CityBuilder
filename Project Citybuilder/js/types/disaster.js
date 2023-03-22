function disaster()
{
    
}

class DisasterType{
    constructor(name,fps,frames)
    {
        this.name = name
        this.speed = Math.floor(1000/fps)
        this.frames = frames
    }
    create()
    {
        return new Disaster(this,gameSystem.canvas.getContext("2d"))
    }
}
class Disaster{
    constructor(source,drawer)
    {
        this.source = source
        this.drawer = drawer
        this.frame = 0
        this.x = 0
        this.y = 0
        this.drawInterval = setInterval(this.drawUpdate,this.source.speed,this)
    }
    drawUpdate(self)
    {
        self.draw()
    }
    draw()
    {
        this.frame = (this.frame+1) % this.source.frames
        gameSystem.drawImage(this.drawer,"./img/disasters/" + this.source.name + "/" + this.source.name + (this.frames == 0 ? "" : "-" + this.frame+1),this.x,this.y)
    }
}