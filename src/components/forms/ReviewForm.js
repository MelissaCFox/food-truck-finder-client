import Rating from '@mui/material/Rating';
import { useState } from "react"
import { Input, Label } from "reactstrap"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import ReviewRepository from "../../repositories/ReviewRepository"
import TruckRepository from "../../repositories/TruckRepository"
import '../trucks/Truck.css';


export const ReviewForm = ({ truckId, setTruck, alertNewRating }) => {
    const [review, setReview] = useState("")
    const [anonymousState, setAnonymous] = useState(false)
    const toggleAnonymous = () => setAnonymous(!anonymousState)
    const [rating, setRating] = useState(3)

    const submitReview = (event) => {
        event.preventDefault()
        const reviewObj = {
            truckId: parseInt(truckId),
            review: review,
            anonymous: anonymousState,
            rating: rating
        }


        if (review) {
            ReviewRepository.addAndUpdate(reviewObj)
                .then(() => {
                    document.getElementById("review-form").reset()
                    TruckRepository.get(parseInt(truckId))
                        .then((truck) => {
                            setTruck(truck)
                            alertNewRating()
                        })
                })
        }
    }

    return (
        <form id="review-form" className="form">
            <h3>Submit a Review</h3>
            <div className="form-group">
                <Input type="textarea"  required autoFocus className="form-control review-input" onChange={e => setReview(e.target.value)} id="review" placeholder="Review"></Input>
            </div>

            <div>
            <Rating name="half-rating" defaultValue={3} precision={1} onChange={e => setRating(parseInt(e.target.value))}/>
            </div>

            <div className="form-group anonymous-check">
                <Label className="label">Remain Anonymous?</Label>
                <input className="anonymous-checkbox" type="checkbox" onChange={toggleAnonymous} />
            </div>

            <button type="submit" onClick={submitReview} className="btn btn-primary">Submit Review</button>
        </form>
    )
}