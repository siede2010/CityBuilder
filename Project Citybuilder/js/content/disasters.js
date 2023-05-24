let tornado
function disasters()
{
    tornado = new DisasterType("tornado",20,6)
    tornado.drawLogic = (elem) => {
        let Length = Math.sqrt((elem.x-elem.fx)*(elem.x-elem.fx)+(elem.y-elem.fy)*(elem.y-elem.fy))
        let tx = (elem.fx-elem.x)/Length
        let ty = (elem.fy-elem.y)/Length
        elem.x+=tx + Math.random() - 0.5;
        elem.y+=ty + Math.random() - 0.5;
        if (Length < 2)
            elem.arr = true;
    }
}