function effect()
{

}

//Base Effects ----------------------------
class TextEffectType
{
    static lis = [];
    static create(x = 0,y = 0,text = "")
    {
        this.lis.push(new TextEffect(x,y,text))
        return this.lis[this.lis.length-1]
    }
    static clear()
    {
        for(let i in this.lis)
            this.lis[i].end = true
        this.lis = [];
    }
}
class TextEffect
{
    constructor(x,y,txt)
    {
        this.text = txt
        this.x = x
        this.y = y
        this.initDrawer()
        this.end = false;
    }
    initDrawer()
    {
        let d = drawer.addDraw((draw,args) => {
            drawer.textStyle(22,"serif","#000000")
            drawer.drawText(this.x,this.y,this.text)
            if (this.end)
                drawer.remove(d.id)
        },null)
    }
}


//Weather Effect --------------------------
class RainType
{
    constructor(sprite,spriteLand,landSprites,rainSpeed)
    {
        this.rainSpeed = rainSpeed
        this.landSprites = landSprites
        this.rainSprite = sprite
        this.splashSprite = spriteLand
        this.currain = null
    }
    create(intensity,duration)
    {
        if (this.currain == null || this.currain.ended == true)
            return this.currain = new Rain(intensity,duration,this)
        else {
            this.currain.ticksLeft = duration * 30
            return this.currain
        }
    }
}
class Rain
{
    constructor(intensity,duration,src)
    {
        this.rainSpeed = src.rainSpeed
        this.rainSprite = src.rainSprite
        this.splashSprite = src.splashSprite
        this.landS = src.landSprites
        this.maxRain = Math.floor(intensity*100)
        this.ticksLeft = duration * 30;
        this.ended = false;
        this.rainList = []
        this.landedRain = []
        this.rainDraw = drawer.addDraw((drawer,args) => {
            this.tick(drawer)
        },null)
    }

    tick(drawer)
    {
        this.ticksLeft--;
        if(this.ticksLeft <= 0) {this.ended = true}
        if (!this.ended)
            for(let i = 0;i<=this.maxRain/100;i++)
                if (this.rainList.length < this.maxRain)
                {
                    this.rainList.push({
                        x:Math.random()*gameSystem.canvas.width,
                        y:Math.random()*this.rainSpeed,
                        hy:Math.random()*gameSystem.canvas.height
                    })
                }
        let newRain = []
        drawer.globalAlpha = 0.6
        for(let i in this.rainList)
        {
            let cRain = this.rainList[i];
            if (cRain.y < cRain.hy) {
                drawImage(drawer,this.rainSprite,cRain.x,cRain.y)
                cRain.y+=this.rainSpeed
                newRain.push(cRain)
            } else
                this.landedRain.push({
                    x:cRain.x,
                    y:cRain.y,
                    f:0
                })
        }
        let newLand = []
        for(let i in this.landedRain)
        {
            let cDrop = this.landedRain[i]
            if (cDrop.f++ < this.landS)
            {
                drawImage(drawer,this.splashSprite+"-"+cDrop.f+".png",cDrop.x,cDrop.y)
                newLand.push(cDrop)
            }
        }
        drawer.globalAlpha = 1
        this.landedRain = newLand
        this.rainList = newRain
        if (this.ended && this.rainList.length+this.landedRain.length <= 0)
            this.breakRain()
    }
    breakRain()
    {
        drawer.remove(this.rainDraw.id)
    }
}
class Flash
{
    static create(duration)
    {
        if (optionSetting.flash == 0) return;
        let a = drawer.addDraw((drawElem,args) => {
            drawFill(drawElem,0,0,gameSystem.canvas.width,gameSystem.canvas.height,"rgba(255,255,255,"+ (args[0][0]--/args[0][1]) +")")
            if (args[0][0] <= 0)
                drawer.remove(a.id)
        },[duration,duration])
    }
}
class CloudsType extends RainType
{
    constructor(sprite)
    {
        super(sprite,null,null,null)
    }
    create = function(intensity,duration)
    {
        return new Cloud(duration)
    }
}
class Cloud 
{
    constructor(duration)
    {
        this.duration = duration;
    }
}