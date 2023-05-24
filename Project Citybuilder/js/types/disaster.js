let disasterList = []
function disaster()
{
}

class DisasterType{
    constructor(name,fps,frames)
    {
        this.name = name
        this.speed = Math.floor(1000/fps)
        this.frames = frames
        disasterList.push(this);
    }
    create()
    {
        return new Disaster(this)
    }
}
class Disaster{
    constructor(source)
    {
        this.source = source
        this.frame = 0
        let pos = gameSystem.randBorderPos();
        this.x = pos[0];
        this.y = pos[1];
        let pos2 = gameSystem.randBorderPos();
        this.drawLogic = (d) => {}
        this.fx = pos2[0];
        this.fy = pos2[1];
        this.arr = false;
        this.drawBase = "./img/disasters/" + this.source.name + "/" + this.source.name
        rain.create(1,30)
        this.uElem = drawer.addDraw((drawing,args) => {
            this.frame = (this.frame+1) % this.source.frames
            drawImage(drawing,this.drawBase + "-" + (this.frame+1) + ".png",this.x,this.y)
            this.source.drawLogic(this);
            if (this.arr)
                drawer.remove(this.uElem.id)
        },null)
        Flash.create(15);
    }
}