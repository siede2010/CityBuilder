class Drawer
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.drawer = this.canvas == null ? null : this.canvas.getContext("2d")
        this.gId = 0;
        this.drawElements = [];
        this.font = {
            size:12,
            font:"serif",
            color:"#000000"
        }
    }

    setCanvas(canvas)
    {
        this.canvas = canvas;
        this.drawer = this.canvas.getContext("2d")
    }

    getNextId()
    {
        this.drawElements.push({
            draw:null,
            args:[]
        });
        return this.gId++;
    }

    clearDraw()
    {
        this.drawElements = [];
    }

    textStyle(size,font,color)
    {
        let changes = {size:size,font:font,color:color}
        changes.forEach(([name,value]) => {
            if (value != null)
                this.font[name] = value;
        })
    }

    drawText(x,y,text)
    {
        this.drawer.font = this.font.size+"px "+this.font.font;
        this.drawer.fillStyle = this.font.color;
        this.texts = text.split("\n")
        for(let i in texts)
            this.drawer.fillText(texts[i],x,y-this.font.size*i)
    }

    setDraw(cons,id,...args)
    {
        this.drawElements[id].draw = cons;
        this.drawElements[id].args = args;
    }

    addDraw(cons,...args)
    {
        let id = this.getNextId()
        this.drawElements[id].draw = cons;
        this.drawElements[id].args = args;
    }

    update()
    {
        this.drawElements.forEach(e => {if(e.draw!=null)e.draw(this.drawer,e.args)})
    }
}

let drawer = new Drawer(null);
function draw()
{
}

function drawFill(drawer,x,y,w,h,color)
{
    drawer.fillStyle = color
    drawer.fillRect(x,y,x+w,y+h)
}
function drawImage(drawer,img,x,y)
{
    let image = document.createElement("img")
    image.src = img
    drawer.drawImage(image,x,y)
}
function drawImageWithScale(drawer,img,x,y,w,h)
{
    let image = document.createElement("img")
    image.src = img
    drawer.drawImage(image,x,y,w,h)
}