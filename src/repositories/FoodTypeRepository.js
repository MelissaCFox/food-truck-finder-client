import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const FoodTypeRepository = {

    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/foodtypes`)
    },


    async get(foodTypeId) {
        return await fetchIt(`${Settings.remoteURL}/foodtypes/${foodTypeId}`)
    },


    async add(foodTypeObj) {
        return await fetchIt(`${Settings.remoteURL}/foodtypes`, "POST", JSON.stringify(foodTypeObj))
    }
}

export default FoodTypeRepository