let apartment
function buildings()
{
    apartment = new BuildingType("apartment")
    .setStat(stats.food,-1)
    .setStat(stats.polution,1)
    .setStat(stats.energy,-1)
    .setStat(stats.cost,3)
    apartment.heightDiff = 32
}