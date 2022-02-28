import Settings from "./Settings";
import { fetchIt } from "./Fetch";
import TruckRepository from "./TruckRepository";

const ReviewRepository = {

    async getBasic(id) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews/${id}`)
    },

    async get(id) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews/${id}`)
    },

    async getAllForTruck(truckId) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews?truckId=${truckId}`)
    },

    async getAllForUser(userId) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews?userId=${userId}`)
    },

    async add(reviewObj) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews`, "POST", JSON.stringify(reviewObj))
    },

    async delete(reviewId) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews/${reviewId}`, "DELETE")
    },

    async update(reviewId, newReviewObj) {
        return await fetchIt(`${Settings.remoteURL}/userTruckReviews/${reviewId}`, "PUT", JSON.stringify(newReviewObj))
    },


}

export default ReviewRepository