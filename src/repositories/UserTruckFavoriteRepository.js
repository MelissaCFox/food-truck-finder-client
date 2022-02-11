import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const userTruckFavorites = {

    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/userTruckFavorites/${id}`)
        // return await fetchIt(`${Settings.remoteURL}/userTruckFavorites/${id}?_expand=user&_expand=truck`)
    },
    
    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/userTruckFavorites`)
        // return await fetchIt(`${Settings.remoteURL}/userTruckFavorites?_expand=user&_expand=truck`)
    },

    async getForUserAndTruck(truckId) {
        return await fetchIt(`${Settings.remoteURL}/userTruckFavorites?truckId=${truckId}`)
    },

    async add(favorite) {
        return await fetchIt(`${Settings.remoteURL}/userTruckFavorites`, "POST", JSON.stringify(favorite))
    },

    async delete(id) {
        return await fetchIt(`${Settings.remoteURL}/userTruckFavorites/${id}`, "DELETE")
    }
}

export default userTruckFavorites