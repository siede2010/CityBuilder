let m = getElementById(hidden,"mainMenue")

let start = getElementById(m,"Start")
let tutorial = getElementById(m,"Tutorial")
class GlobalVar
{
    constructor(startVar)
    {
        this.var = startVar
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
}