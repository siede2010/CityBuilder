let drawer
function draw()
{
    drawer = new Drawer(null)
}
class Drawer
{
    constructor(canvas)
    {
        this.canvas = canvas;
        this.gId = 0;
        this.time = 0;
        this.drawElements = [];
    }

    setCanvas(canvas)
    {
        this.canvas = canvas;
    }

    getNextId()
    {
        this.drawElements.push(null);
        return gId++;
    }

    setDraw(cons,id)
    {
        this.drawElements[id] = cons;
    }

    update()
    {
        this.drawElements.forEach(e => {e()})
    }


}