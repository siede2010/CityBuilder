let apartment,forest,road,smallHospital,house,solarPannel
function buildings()
{
    
    apartment = new BuildingType("apartment").getThis((self) => {
        self.setStat(stats.food,-1)
        self.setStat(stats.population,1)
        self.setStat(stats.energy,-1)
        self.setStat(stats.cost,-3)
        self.type = type.population
        self.turnable = true
        self.heightDiff = 32
    })
    forest = new BuildingType("forest").getThis((self) => {
        self.setStat(stats.food,1)
        self.setStat(stats.cost,-2)
        self.setStat(stats.happiness,1)
        self.setStat(stats.nature,2)
        self.type = type.nature
        self.turnable = false
    })
    smallHospital = new BuildingType("small-hospital").getThis((self) => {
        self.setStat(stats.healthCare,3)
        self.setStat(stats.food,-1)
        self.setStat(stats.cost,-4)
        self.setStat(stats.happiness,1)
        self.setStat(stats.work,2)
        self.turnable = false
        self.type = type.security
        self.heightDiff = 14
    })
    house = new MultiBlockType("house").getThis((self) => {
        self.setStat(stats.cost,-2)
        self.setStat(stats.food,-2)
        self.setStat(stats.population,3)
        self.setStat(stats.energy,-1)
        self.turnable = true
        self.type = type.population
        self.heightDiff = 16
        self.height = 2
        self.width = 1
    })
    road = new RoadType("road").getThis((self) => {
        self.setStat(stats.cost,-1)
        self.type = type.security
    })
    solarPannel = new BuildingType("solar-pannel").getThis((self) => {
        self.setStat(stats.cost,-2)
        self.setStat(stats.energy,2)
        self.type = type.work
        self.turnable = false
    })
}