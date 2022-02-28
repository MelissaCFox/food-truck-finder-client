import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const UserRepository = {

    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/users/${id}`)
    },

    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/users`)
    },

    async addTruckOwner(truckOwner) {
        return await fetchIt(`${Settings.remoteURL}/truckOwners`, "POST", JSON.stringify(truckOwner))
    },

    async getAllTruckOwners() {
        return await fetchIt(`${Settings.remoteURL}/truckOwners`)
    }


}

export default UserRepository