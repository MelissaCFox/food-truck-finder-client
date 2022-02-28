import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const TruckRepository = {

    async getBasic(id) {
        return await fetchIt(`${Settings.remoteURL}/trucks/${id}`)
    },

    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/trucks/${id}`)
    },
    
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/trucks`)
    },

    async add(truck) {
        return await fetchIt(`${Settings.remoteURL}/trucks`, "POST", JSON.stringify(truck))
    },

    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/trucks/${id}`, "DELETE")
    },

    async update(truckId, newTruckObj) {
        return await fetchIt(`${Settings.remoteURL}/trucks/${truckId}`, "PUT", JSON.stringify(newTruckObj))
    },

    async getOwnerTrucks() {
        return await fetchIt(`${Settings.remoteURL}/trucks?owner=true`)
    }

}

export default TruckRepository