let apartment,forest
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
        self.setStat(stats.food,-1)
        self.setStat(stats.polution,1)
        self.setStat(stats.energy,-1)
        self.setStat(stats.cost,3)
        self.type = type.nature
        self.turnable = false
        })
}