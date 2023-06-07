let stats = {
    happiness:"happiness",
    population:"population",
    nature:"nature",
    safety:"safety",
    work:"work",
    food:"food",
    economics:"economics",
    energy:"energy",
    healthCare:"healthCare",
    education:"education",
    cost:"cost",
    trust:"trust"
}
let optionSetting = {}
function addOption(elem = document.createElement("input"))
{
    optionSetting[elem.id] = 0;
    switch(elem.tagName.toLowerCase()) {
        case "select":
            elem.addEventListener("change",() => {
                optionSetting[elem.id] = elem.selectedIndex
            })
            if (elem.attributes.default == undefined)
                elem.selectedIndex = 0;
            else {
                elem.selectedIndex = parseInt(elem.attributes.default.nodeValue)
                optionSetting[elem.id] = elem.selectedIndex
            }
            break;
        case "input":
            if (elem.type == "checkbox") {
                elem.addEventListener("change",() => {
                    optionSetting[elem.id] = elem.checked ? 1 : 0
                })
                optionSetting[elem.id] = elem.checked ? 1 : 0
            } else if (elem.type == "range") {
                elem.addEventListener("change",() => {
                    optionSetting[elem.id] = parseFloat(elem.value);
                })
                optionSetting[elem.id] = parseFloat(elem.value);
            }
            break;
        default:
            break;
    }
}
let o = document.getElementsByClassName("option")
for(let oi = 0;oi<o.length;oi++)
    addOption(o[oi])

let numberStat = [
    "happiness",
    "population",
    "nature",
    "safety",
    "work",
    "food",
    "economics",
    "energy",
    "healthCare",
    "education",
    "cost",
    "trust"
]
let statStartValue = {
    happiness:0,
    population:0,
    nature:40,
    safety:0,
    work:0,
    food:50,
    economics:0,
    energy:0,
    healthCare:0,
    education:0,
    cost:100,
    trust:0
}
let colors = {
    blue : "",
    lime : " bg-success",
    turkis : " bg-info",
    yellow : " bg-warning",
    red : "bg-danger",
    dark : "bg-dark"
}
let type = {
    security : "security",
    nature : "nature",
    population : "population",
    work : "work",
    happiness : "happiness",
    none : "none"
}
let defeatStatement = {
    happiness:"Happiness got too low",
    population:"Underpopulated",
    nature:"People didnt see any Nature",
    safety:"the town was a wasteland due to the lack of Safety",
    work:"too many people were homeless due to a lack of Work",
    food:"Hunger has grown into a large issue of your city.",
    economics:"Economics could not have crashed harder than this.",
    energy:"A lack of Energy left many people to desert the town.",
    healthCare:"even 'free' HealthCare was too expensive for you. wasnt it.",
    education:"too little Education left many people not understanding basic maths.",
    cost:"You were in too deep of a debt and lost the city in a bid to pay off the debt.",
    trust:"the people of the city had no Trust in you and left it due to fear."
}
let gameOverStats = {
    happiness:-100,
    population:-50,
    nature:-100,
    safety:-100,
    work:-150,
    food:-200,
    economics:-50,
    energy:-250,
    healthCare:-100,
    education:-100,
    cost:-999999,
    trust:-100
}
let dangerLimit = {
    happiness:-50,
    population:0,
    nature:-50,
    safety:-50,
    work:-100,
    food:-100,
    economics:0,
    energy:-100,
    healthCare:-50,
    education:-50,
    cost:0,
    trust:-50
}