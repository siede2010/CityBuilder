class Drawer
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.drawer = this.canvas == null ? null : this.canvas.getContext("2d")
        this.gId = 0;
        this.drawElements = [];
        this.drawImportant = [];
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

    getNextId() //used by regular Drawer to get the id of it.
    {
        this.drawElements.push({
            draw:null,
            args:[],
            id:this.gId
        });
        return this.gId++;
    }

    clearDraw() //clears the normal DrawElements not the UI ones.
    {
        this.drawElements = [];
        this.drawImportant = [];
        this.gId = 0;
    }

    textStyle(size,font,color) //sets the style of the text
    {
        this.drawer.font = size + "px " + font
        this.drawer.fillStyle = color;
    }

    drawText(x,y,text) //draws text
    {
        let texts = text.split("\n")
        for(let i in texts)
            this.drawer.fillText(texts[i],x,y-this.font.size*i)
    }

    setDraw(cons,id,...args) //sets the drawer to something else
    {
        this.drawElements[id].draw = cons;
        this.drawElements[id].args = args;
    }

    addDraw(cons,...args) //regular Drawer
    {
        let id = this.getNextId()
        this.drawElements[id].draw = cons;
        this.drawElements[id].args = args;
        return this.drawElements[id]; //Returns drawElements due to the possibility of the id to change.
    }
    addDrawUI(cons,...args) //Drawing UI cannot be removed.
    {
        let id = this.drawImportant.length
        this.drawImportant.push({
            draw:cons,
            args:args
        })
        return id; //Returns id cuz no element is to be deleted
    }

    remove(id) //removes the normal Drawer using the id it has.
    {
        this.drawElements = this.drawElements.filter(e => e.id != id)
        this.drawElements.forEach(e => {if (e.id > id)e.id--})
        this.gId--
    }

    update() //called every Tick to update the screen.
    {
        this.drawElements.forEach(e => {if(e.draw!=null)e.draw(this.drawer,e.args)})
        this.drawImportant.forEach(e => {if(e.draw!=null)e.draw(this.drawer,e.args)})
    }
}

let drawer = new Drawer(null);
function draw()
{
}

function drawFill(drawer,x,y,w,h,color)
{
    drawer.fillStyle = color
    drawer.fillRect(x,y,w,h)
}
function drawFrame(drawer,img,x,y,w,h,index)
{
    let spriteSheet = new Image();
    spriteSheet.src = img;
    drawer.drawImage(spriteSheet,0,h*index,w,h,x,y,w,h)
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