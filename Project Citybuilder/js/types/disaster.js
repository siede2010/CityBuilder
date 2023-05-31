let disasterList = []
function disaster()
{
}

class DisasterType{
    constructor(name,fps,frames,spritesheet = false,sWidth = 32,sHeight = 32)
    {
        this.name = name
        this.speed = Math.floor(1000/fps)
        this.frames = frames
        this.spritesheet = spritesheet;
        disasterList.push(this);
        this.drawLogic = (elem,drawer) => {}
        this.initLogic = (elem) => {}
        this.dim = {w:sWidth,h:sHeight}
    }
    create()
    {
        return new Disaster(this)
    }
}
class Disaster{
    constructor(source = new DisasterType("",0,0))
    {
        this.source = source
        this.frame = 0
        this.data = {}
        let pos = gameSystem.randBorderPos();
        this.x = pos[0];
        this.y = pos[1];
        let pos2 = gameSystem.randBorderPos();
        this.drawLogic = this.source.drawLogic
        this.initLogic = this.source.initLogic
        this.fx = pos2[0];
        this.fy = pos2[1];
        this.arr = false;
        if (this.source.spritesheet == false)
            this.drawBase = "./img/disasters/" + this.source.name + "/" + this.source.name
        else
            this.drawBase = "./img/disasters/" + this.source.name
        this.initLogic(this)
        this.uElem = drawer.addDraw((drawing,args) => {
            if (this.source.spritesheet)
            {
                drawFrame(drawing,this.drawBase + ".png",this.x,this.y,this.source.dim.w,this.source.dim.h,this.frame++)
                this.frame%=this.source.frames
            }
            else {
                this.frame = ++this.frame % this.source.frames
                drawImage(drawing,this.drawBase + "-" + (this.frame+1) + ".png",this.x,this.y)
            }
            this.drawLogic(this,drawing);
            if (this.arr)
                drawer.remove(this.uElem.id)
        },null)
        Flash.create(15);
    }
}