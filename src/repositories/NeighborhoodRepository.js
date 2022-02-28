import Settings from "./Settings";
import { fetchIt } from "./Fetch";

const NeighborhoodRepository = {

    async getAll() {
        return await fetchIt(`${Settings.remoteURL}/neighborhoods`)
    },

    async get(neighborhoodId) {
        return await fetchIt(`${Settings.remoteURL}/neighborhoods/${neighborhoodId}`)
    }
}

export default NeighborhoodRepository