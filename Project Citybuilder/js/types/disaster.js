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
        this.fx = pos2[0];
        this.fy = pos2[1];
        this.drawBase = "./img/disasters/" + this.source.name + "/" + this.source.name
        this.uElem = drawer.addDraw((drawing,args) => {
            this.frame = (this.frame+1) % this.source.frames
            drawImage(drawing,this.drawBase + "-" + (this.frame+1) + ".png",this.x,this.y)
            let Length = Math.sqrt((this.x-this.fx)*(this.x-this.fx)+(this.y-this.fy)*(this.y-this.fy))
            let tx = (this.fx-this.x)/Length
            let ty = (this.fy-this.y)/Length
            this.x+=tx;
            this.y+=ty;
            if (Length <= 2)
                drawer.remove(this.uElem.id)
        },null)
    }
}