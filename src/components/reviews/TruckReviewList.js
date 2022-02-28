import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router-dom"
import TruckRepository from "../../repositories/TruckRepository"
import { Review } from "./Review"
import './Reviews.css';



export const TruckReviewList = () => {
    const { truckId } = useParams()
    const [truck, setTruck] = useState({})
    const [newInfo, setNewInfo] = useState(false)
    const editedReview = () => setNewInfo(!newInfo)


    useEffect(() => {
        TruckRepository.get(truckId).then(setTruck)
    }, [newInfo, truckId])

    return (
        <div className="truck-reviews">
            <h2 className="heading "> <Link className="all-reviews" to={`/trucks/${truck.id}`}>{truck.name}</Link> -- Reviews</h2>
            <div className="truck-reviews-all">

                {
                    truck.reviews?.length > 0
                        ? truck.reviews?.map(review => <Review key={review.id} review={review} allReviewsList={true} editedReview={editedReview} />)
                        : <div>No Reviews Yet</div>
                }

            </div>
        </div>
    )
}