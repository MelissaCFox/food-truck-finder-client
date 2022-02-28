import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const TruckLocationRepository = {

    async getTruckLocationsWithParams(params) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations${params}`)
    },


    
    async getTruckLocationsByDay(dayId) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations?dayId=${dayId}`)
    },

    async getTruckLocationsByTruck(truckId) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations?truckId=${truckId}`)
    },

    async getTruckLocationsByTruckAndDay(truckId, dayId) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations?dayId=${dayId}&truckId=${truckId}`)
    },

    async getTruckLocationsByNeighborhood(neighborhoodId) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations?neighborhoodId=${neighborhoodId}`)
    },

    async getTruckLocationsByNeighborhoodAndDay(neighborhoodId, dayId) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations?neighborhoodId=${neighborhoodId}&dayId=${dayId}`)
    },

    async add(truckLocation) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations`, "POST", JSON.stringify(truckLocation))
    },

    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations/${id}`, "DELETE")
    },

    async update(truckLocationId, newTruckLocationObj) {
        return await fetchIt(`${Settings.remoteURL}/truckLocations/${truckLocationId}`, "PUT", JSON.stringify(newTruckLocationObj))
    },

    async getAllDays() {
        return await fetchIt(`${Settings.remoteURL}/days`)
    }
}

export default TruckLocationRepository