function effect()
{

}

//Base Effects ----------------------------
class EffectType
{
    constructor(sprite)
    {
        this.sprite = sprite;
    }
    creat(x = 0,y = 0)
    {
        return new Effect(this.sprite,x,y)
    }
}
class Effect
{
    constructor(picture,x,y)
    {
        this.pic = picture
        this.x = x
        this.y = y
        this.initDrawer()
    }
    initDrawer()
    {
        drawer.addDraw((drawer,args) => {
            drawImage(drawer,this.pic,this.x,this.y)
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
    }
    create(intensity,duration)
    {
        return new Rain(intensity,duration,this)
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