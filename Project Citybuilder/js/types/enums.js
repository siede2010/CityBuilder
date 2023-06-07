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
function addOption(elem)
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
    Happiness:"Happiness got too low",
    Population:"Underpopulated",
    Nature:"People didnt see any Nature",
    Safety:"the town was a wasteland due to the lack of Safety",
    Work:"too many people were homeless due to a lack of Work",
    Food:"Hunger has grown into a large issue of your city.",
    Economics:"Economics could not have crashed harder than this.",
    Energy:"A lack of Energy left many people to desert the town.",
    HealthCare:"even 'free' HealthCare was too expensive for you. wasnt it.",
    Education:"too little Education left many people not understanding basic maths.",
    Cost:"You were in too deep of a debt and lost the city in a bid to pay off the debt.",
    Trust:"the people of the city had no Trust in you and left it due to fear."
}
let gameOverStats = {
    Happiness:-100,
    Population:-50,
    Nature:-100,
    Safety:-100,
    Work:-150,
    Food:-200,
    Economics:-50,
    Energy:-250,
    HealthCare:-100,
    Education:-100,
    Cost:-999999,
    Trust:-100
}
let dangerLimit = {
    Happiness:-50,
    Population:0,
    Nature:-50,
    Safety:-50,
    Work:-100,
    Food:-100,
    Economics:0,
    Energy:-100,
    HealthCare:-50,
    Education:-50,
    Cost:0,
    Trust:-50
}