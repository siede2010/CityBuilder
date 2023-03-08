let apartment,forest,road,smallHospital,house
function buildings()
{
    
    apartment = new BuildingType("apartment").getThis((self) => {
        self.setStat(stats.food,-1)
        self.setStat(stats.polution,1)
        self.setStat(stats.energy,-1)
        self.setStat(stats.cost,3)
        self.type = type.population
        self.turnable = true
        self.heightDiff = 32
    })
    forest = new BuildingType("forest").getThis((self) => {
        self.setStat(stats.food,0)
        self.type = type.nature
        self.turnable = false
    })
    smallHospital = new BuildingType("small-hospital").getThis((self) => {
        self.turnable = false
        self.type = type.security
        self.heightDiff = 14
    })
    house = new MultiBlockType("house").getThis((self) => {
        self.turnable = true
        self.type = type.population
        self.heightDiff = 16
        self.height = 2
    })
    road = new RoadType("road").getThis((self) => {
        self.type = type.security
    })
}