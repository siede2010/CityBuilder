function loadAlt()
{
    document.getElementById("boots").remove()
    let style = document.createElement("link")
    style.rel = "stylesheet"
    style.href = "./css/bootsAlt.css"
    document.head.append(style)
}