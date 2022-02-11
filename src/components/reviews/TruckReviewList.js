import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReviewRepository from "../../repositories/ReviewRepository"
import TruckRepository from "../../repositories/TruckRepository"
import { Review } from "./Review"
import './Reviews.css';



export const TruckReviewList = () => {
    const { truckId } = useParams()
    const [reviews, setReviews] = useState([])
    const [newInfo, setNewInfo] = useState(false)
    const editedReview = () => setNewInfo(!newInfo)


    useEffect(() => {
        ReviewRepository.getAllForTruck(truckId).then(setReviews)
    }, [newInfo, truckId])

    return (
        <div className="truck-reviews">
            <h2 className="heading ">{reviews[0]?.truck.name} -- Reviews</h2>
            <div className="truck-reviews-all">

                {
                    reviews.length > 0
                        ? reviews.map(review => <Review key={review.id} review={review} allReviewsList={true} editedReview={editedReview} />)
                        : <div>No Reviews Yet</div>
                }

            </div>
        </div>
    )
}