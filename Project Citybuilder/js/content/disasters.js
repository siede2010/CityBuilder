let tornado,badweather
function disasters()
{
    tornado = new DisasterType("tornado",20,6)
    tornado.drawLogic = (elem,drawer) => {
        let Length = Math.sqrt((elem.x-elem.fx)*(elem.x-elem.fx)+(elem.y-elem.fy)*(elem.y-elem.fy))
        let tx = (elem.fx-elem.x)/Length
        let ty = (elem.fy-elem.y)/Length
        elem.x+=tx + Math.random() - 0.5;
        elem.y+=ty + Math.random() - 0.5;
        let tilesNear = gameSystem.tilesNear(elem.x,elem.y+46,20)
        for(let i in tilesNear)
            gameSystem.tileGrid.index(tilesNear[i]).remove()
        if (Length < 2)
            elem.arr = true;
    }
    tornado.initLogic = (elem) => {
        rain.create(1,30);
    }
    badweather = new DisasterType("lightning",12,6,true,32,64)
    badweather.drawLogic = (elem,drawer) => {
        if (elem.frame >= elem.source.frames-1){
            elem.x = gameSystem.canvas.width * Math.random()
            elem.y = gameSystem.canvas.width * Math.random()
            if (Math.random() < 0.2)
                Flash.create(5)
        }
        if (elem.data.rainElem.ended)
            elem.arr = true;
    }
    badweather.initLogic = (elem) => {
        elem.x = gameSystem.canvas.width * Math.random()
        elem.y = gameSystem.canvas.width * Math.random()
        elem.data.rainElem = rain.create(3,15)
    }
}