//start
let scripts = []
let directorys = ["."]
let loadedScripts = 0
let hidden = document.getElementById("startHidden")
hidden.remove()
function getElementById(div,id)
{
    for(let i in div.children)
        if (div.children[i].id == id)
            return div.children[i]
    return null
}
function addDirectory(directory)
{
    directorys.push(directory)
}
function require(script)
{
    for(let i in directorys)
    {
        let s = document.createElement("script")
        s.src = "./js/"+directorys[i]+"/"+script+".js"
        s.index = scripts.length
        scripts.push(script)
        s.addEventListener("error",() => {
            s.remove();
            let done = false;
            scripts = scripts.filter(p=>{
                if (!done && p == script)
                {
                    done = true;
                    return false;
                }
                return true;
            })
        })
        s.addEventListener("load",() => {loadedScripts++})
        document.body.append(s)
    }
}
function loaded() {
    for(let i in scripts)
        try{
        this[scripts[i]]()
        }
        catch{}
}
let loadProgress = document.getElementById("loadProgress")
// ------------------------------------------------ //
//                Start of Content                  // 
// ------------------------------------------------ //
addDirectory("content")// \
addDirectory("types")  //  > the Directory's it will look for the scripts in.
addDirectory("draw")   // /
//Stuff gets loaded from top to bottom.
require("main")
//types
require("effect")
require("building")
require("disaster")
//content
require("effects")
require("buildings")
require("disasters")
//draw
require("draw");
//extra
require("game")

//End
let intervalVal
function waitTillload()
{
    let progress = loadedScripts/scripts.length * 100
    console.log(progress)
    loadProgress.style = "width:" + progress + "%";
    if (progress == 100)
    {
        clearInterval(intervalVal)
        loaded()
        document.getElementById("loadMain").remove()
    }
}
intervalVal = setInterval(waitTillload,100)