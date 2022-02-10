import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import ReviewRepository from "../../repositories/ReviewRepository"
import UserRepository from "../../repositories/UserRepository"
import { Review } from "../reviews/Review"
import { Favorites } from "./Favorites"
import './User.css';

export const User = ({ userId, currentUser }) => {
    // const [user, setUser] = useState({})
    // const [userReviews, setUserReviews] = useState([])

    const [newInfo, setNewInfo] = useState(false)
    const alertNewInfo = () => setNewInfo(!newInfo)
    const { getCurrentUser } = useSimpleAuth()

    // useEffect(() => {
    //     if (userId) {
    //         ReviewRepository.getAllForUser(userId).then((reviews) => {
    //             const recentReviews = reviews.sort((a,b) => {
    //                 return b.parsedDate - a.parsedDate
    //             })
    //             setUserReviews(recentReviews)
    //         })
    //     }
    // }, [userId, user])

    // useEffect(() => {
    //     if (userId) {
    //         UserRepository.get(userId).then(setUser)
    //     }
    // }, [userId, newInfo])

    const [thisUser, setThisUser] = useState({})
    useEffect(() => {
        if (newInfo) {
            getCurrentUser().then(setThisUser)
        }
        else if (currentUser)
            setThisUser(currentUser)
        console.log(thisUser)
    }, [currentUser, newInfo])



    return (
        <div className="profile-view">
            <ul className="favorites card">
                <div className="profile-header"><h3>My Favorite Food Trucks</h3></div>
                <div className="profile-container"><Favorites key={`${thisUser.id}--${newInfo}`} userId={thisUser.id} newInfo={newInfo} /></div>
            </ul>

            <ul className="reviews-container card">
                <div className="profile-header"><h3>My Reviews</h3></div>
                <div className="reviews">
                    <div className="profile-container"></div>
                    {
                        thisUser.reviews?.length > 0
                            ? thisUser.reviews.map(review => {
                                return <Review key={review.id} review={review} user={thisUser} alertNewInfo={alertNewInfo} />
                            })
                            : <div className="noReviews">No Reviews Yet</div>
                    }
                </div>
            </ul>
        </div>
    )
}