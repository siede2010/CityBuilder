let m = getElementById(hidden,"mainMenue")
let opt = getElementById(hidden,"optionScreen")
let inf = getElementById(hidden,"infoScreen")
let cre = getElementById(hidden,"creditScreen")

let start = getElementById(m,"Start")
let tutorial = getElementById(m,"Tutorial")
let options = getElementById(m,"Options")
let info = getElementById(m,"Info")
let credits = getElementById(m,"Credits")
class GlobalVar
{
    constructor(startVar)
    {
        this.var = startVar
        this.name = ""
    }

    setName(newName)
    {
        this.name = newName
        return this
    }

    getVar()
    {
        return this.var
    }
    setVar(newVar)
    {
        this.var = newVar
    }
}
function main()
{
    document.body.append(m)
    
    start.addEventListener("click",() => {initiateGame()})
    tutorial.addEventListener("click",() => {initiateTutorial()})
    options.addEventListener("click",() => {optionScreen()})
    info.addEventListener("click",() => {infoScreen()})
    credits.addEventListener("click",() => {creditScreen()})
}
function score(s,string)
{
    let scroe = document.createElement("b")
    let p = getElementById(getElementById(gameUI,"row1"),"bars")
    p.append(scroe)
    scroe.append(document.createTextNode(string))
    scroe.append(document.createElement("br"))
    scroe.append(document.createTextNode("Final Score :"))
    scroe.append(document.createTextNode(s))
    let ret = document.createElement("div")
    p.append(document.createElement("br"))
    p.append(ret)
    ret.className = "btn btn-success"
    ret.innerText = "Return"
    ret.style = "font-weight:bold"
    ret.addEventListener("click",() => {
        p.innerText = ""
        goMain()
    })
}
function goMain()
{
    document.body.innerText = ""
    document.body.append(m)
}
function optionScreen()
{
    m.remove()
    document.body.append(opt)
}
function infoScreen()
{
    m.remove()
    document.body.append(inf)
}
function creditScreen()
{
    m.remove()
    document.body.append(cre)
}