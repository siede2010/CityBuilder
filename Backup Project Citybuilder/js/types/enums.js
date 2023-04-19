let stats = {
    happiness:"Happiness",
    population:"Population",
    nature:"Nature",
    safety:"Safety",
    work:"Work",
    food:"Food",
    economics:"Economics",
    energy:"Energy",
    healthCare:"HealthCare",
    education:"Education",
    cost:"Cost",
    trust:"Trust"
}
let statStartValue = {
    Happiness:0,
    Population:0,
    Nature:40,
    Safety:0,
    Work:0,
    Food:50,
    Economics:0,
    Energy:0,
    HealthCare:0,
    Education:0,
    Cost:100,
    Trust:0
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