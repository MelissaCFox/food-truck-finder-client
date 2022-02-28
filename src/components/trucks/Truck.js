import { Link, useParams } from "react-router-dom/cjs/react-router-dom.min"
import Rating from '@mui/material/Rating';
import { useState, useEffect } from "react/cjs/react.development"
import TruckRepository from "../../repositories/TruckRepository"
import NeighborhoodRepository from "../../repositories/NeighborhoodRepository"
import { ReviewForm } from "../forms/ReviewForm"
import TruckLocationRepository from "../../repositories/TruckLocationRepository"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import UserTruckFavoriteRepository from "../../repositories/UserTruckFavoriteRepository"
import { Review } from "../reviews/Review"
import { TruckSchedule } from "../schedule/TruckSchedule"
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap"
import Fav from './images/Fav.png';
import NoFav from './images/NoFav.png';
import './Truck.css';
import UserRepository from "../../repositories/UserRepository"
import { SuggestionForm } from "../forms/SuggestionForm"
import FacebookIcon from "./images/FacebookIcon.png"
import TwitterIcon from "./images/TwitterIcon.png"
import InstagramIcon from "./images/InstagramIcon.png"
import WebsiteIcon from "./images/WebsiteIcon.png"
import ReviewRepository from "../../repositories/ReviewRepository"
import { useLocation } from "react-router-dom"
import { TruckForm } from "../forms/TruckForm"
import Settings from "../../repositories/Settings";

export const Truck = ({ truckID, setUser, userId, updateReadStateChange }) => {
    const currentDayId = new Date().getDay() + 1
    const [truck, setTruck] = useState({})
    const { truckId } = useParams()
    const [neighborhoods, setNeighborhoods] = useState([])
    const [truckLocations, setTruckLocations] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const [days, setDays] = useState([])
    const [newInfo, setNewInfo] = useState(false)
    const alertNewInfo = () => setNewInfo(!newInfo)
    const [reviews, setReviews] = useState([])
    const [newLocation, setNewLocation] = useState(false)
    const changeLocation = () => setNewLocation(!newLocation)
    const [editModal, setEditModal] = useState(false)
    const editToggle = () => setEditModal(!editModal)
    const [newRating, toggleNewRating] = useState(false)
    const alertNewRating = () => toggleNewRating(!newRating)
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [confirm, setConfirm] = useState(false)
    const toggle3 = () => setConfirm(!confirm)
    const [suggestion, setSuggestion] = useState(false)
    const suggestionToggle = () => setSuggestion(!suggestion)

    const [currentUser, setCurrentUser] = useState({})
    useEffect(() => {
        getCurrentUser().then(setCurrentUser)
    }, [])

    const location = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location])

    useEffect(() => {
        if (truck.id) {
            ReviewRepository.getAllForTruck(truck.id).then(setReviews)
        }

    }, [truck])

    useEffect(() => {
        TruckLocationRepository.getAllDays().then(setDays)
    }, [])


    useEffect(() => {
        truckId
            ? TruckLocationRepository.getTruckLocationsByTruck(truckId).then(setTruckLocations)
            : TruckLocationRepository.getTruckLocationsByTruck(truckID).then(setTruckLocations)

    }, [truckId, truckID])

    useEffect(() => {
        NeighborhoodRepository.getAll().then(setNeighborhoods)
    }, [truckID])

    useEffect(() => {
        if (truckId) {
            TruckRepository.get(truckId).then(setTruck)

        } else {
            TruckRepository.get(truckID).then(setTruck)
        }
    }, [truckId, truckID, newRating, newInfo])

    const createNewLocation = (truckId, neighborhoodId, dayId) => {
        const newTruckLocation = {
            truckId: truckId,
            neighborhoodId: parseInt(neighborhoodId),
            dayId: dayId
        }

        const existingTruckLocation = truckLocations.find(location => location.truck.id === truckId && location.day.id === dayId)

        if (existingTruckLocation && neighborhoodId === "0") {
            TruckLocationRepository.delete(existingTruckLocation.id).then(() => { TruckLocationRepository.getTruckLocationsByTruck(truckID).then(setTruckLocations) })

        } else if (existingTruckLocation && neighborhoodId) {
            TruckLocationRepository.update(existingTruckLocation.id, newTruckLocation)
        } else if (neighborhoodId !== "0") {
            TruckLocationRepository.add(newTruckLocation).then(() => { TruckLocationRepository.getTruckLocationsByTruck(truckID).then(setTruckLocations) })
        }
        TruckRepository.get(truckID).then(() => {
            TruckLocationRepository.getTruckLocationsByTruck(truckID).then((res) => {
                setTruckLocations(res)
                alertNewInfo()
                changeLocation()
            })
        })
    }


    const toggleFavorite = (favoriteTruckId) => {
        const newLike = {
            truckId: parseInt(favoriteTruckId)
        }
        if (truck.favorite) {
            //find existing favorite then delete and trigger state change
            UserTruckFavoriteRepository.getForUserAndTruck(truckId)
                .then(r => UserTruckFavoriteRepository.delete(r.id).then(() => alertNewInfo()))
        } else {
            UserTruckFavoriteRepository.add(newLike).then(() => alertNewInfo()) //then trigger state change so that star images changes in browser
        }

    }

    let truckPrice = "$"
    if (truck.dollars === 2) {
        truckPrice = "$ $"
    } else if (truck.dollars === 3) {
        truckPrice = "$ $ $"
    }


    return (
        <div className="truck__page-card">
            <div className="truck__info">
                <div className="truck__heading">
                    {
                        truckID
                            ? ""
                            : <div className="truck__favorite">
                                <button className="star-icon" onClick={() => { toggleFavorite(truckId) }}>
                                    <img alt="star" className="star-icon" src={truck.favorite ? Fav : NoFav} />
                                </button>

                            </div>
                    }

                    <div className="truck__name">
                        {truck.name}
                    </div>
                    <div className="editTruck-btn">
                        {
                            truckId
                                ? ""
                                : <><Button onClick={editToggle}>Edit/Retire Truck</Button>

                                    <Modal animation="false"
                                        isOpen={editModal}
                                        centered
                                        fullscreen="lg"
                                        size="lg"
                                        toggle={editToggle}
                                    >
                                        <ModalHeader toggle={editToggle}>
                                            Edit Details for {<em>{truck.name}</em>}
                                        </ModalHeader>

                                        <TruckForm existingTruck={truck} register={false} toggle3={toggle3} editToggle={editToggle} alertNewInfo={alertNewInfo} />

                                        <Button type="retire"
                                            color="danger"
                                            value={truck.id}
                                            onClick={() => {

                                                toggle3()
                                            }}
                                            className="btn btn-primary">
                                            Retire Truck
                                        </Button>
                                    </Modal>

                                    <Modal isOpen={confirm} centered fullscreen="sm" size="sm" toggle={toggle} >
                                        <ModalHeader toggle={toggle3}>
                                            Are You Sure You Want to Retire {truck.name}?
                                        </ModalHeader>
                                        <ModalBody>
                                            <Button color="danger" onClick={() => {
                                                TruckRepository.delete(truck.id).then(() => {
                                                    updateReadStateChange()
                                                    UserRepository.get(userId).then(setUser)
                                                        .then(() => {
                                                            toggle3()
                                                            editToggle()
                                                        })
                                                })
                                            }}>
                                                Yes
                                            </Button>
                                            <Button onClick={toggle3}>
                                                Cancel
                                            </Button>
                                        </ModalBody>
                                    </Modal>
                                </>
                        }
                    </div>
                </div>

                <div className="truck__details">
                    <div className="truck-info-details">
                        <div className="truck__media">
                            <div className="truck__image">
                                <img className="truck__logo" src={`${Settings.remoteURL}${truck.profile_img_src}`} alt={`${truck.name} logo`} />
                            </div>
                        </div>

                        <div className="truck__description">
                            <div className="truck__info--description">{truck.description}</div>
                            <div className="truck__info--hours">Typical Hours: {truck.hours}</div>
                            <div className="truck__info--typeTags">
                                {
                                    truck?.food_types?.map(
                                        (type) => {
                                            return <div className="typeTag" key={type.id}>{type.type}</div>
                                        })
                                }
                            </div>
                            <div className="truck__info--dollars">{truckPrice}</div>
                            <div className="truck__info--rating ">
                                {
                                    truck.user_rating === 0
                                        ? <div>No Ratings Yet</div>
                                        : <><Rating name={`${truck.name}--rating`} precision={0.5} key={truck.user_rating} value={truck.user_rating} size="small" readOnly />
                                            <div className="truck-userStar">
                                                {
                                                    truck.reviews?.length > 1
                                                        ? `(${truck.reviews?.length} ratings)`
                                                        : `(${truck.reviews?.length} rating)`
                                                }
                                            </div></>
                                }
                            </div>


                            <div className="truck__info--links">
                                {
                                    truck.websiteURL
                                        ? <a className="link" target="_blank" rel="noreferrer" href={truck.websiteURL} ><img alt="web-logo" className="link__logo" src={WebsiteIcon} /></a>
                                        : ""
                                }
                                {
                                    truck.facebookURL
                                        ? <a className="link" target="_blank" rel="noreferrer" href={truck.facebookURL} ><img alt="facebook-logo" className="link__logo" src={FacebookIcon} /></a>
                                        : ""
                                }
                                {
                                    truck.instagramURL
                                        ? <a className="link" target="_blank" rel="noreferrer" href={truck.instagramURL}><img alt="instagram-logo" className="link__logo" src={InstagramIcon} /></a>
                                        : ""
                                }
                                {
                                    truck.twitterURL
                                        ? <a className="link" target="_blank" rel="noreferrer" href={truck.twitterURL} ><img alt="twitter-logo" className="link__logo" src={TwitterIcon} /></a>
                                        : ""
                                }
                            </div>

                        </div>
                    </div>

                    <div className="truck__currentLocation">
                        <div className="truck-location-heading">Find Us Today </div><div className="truck-location-card">
                            <TruckSchedule neighborhoods={neighborhoods} truckId={truck.id} truckPage={truckId} dayId={currentDayId} truckLocations={truckLocations} createNewLocation={createNewLocation} />
                        </div>
                        {
                            truckId
                                ? <><div className="suggestion-label truck-location-heading">Know A Good Spot For Us To Visit?</div>
                                    <div className="suggestion-form-btn"><Button onClick={suggestionToggle}>Submit A Suggestion</Button></div>
                                    <Modal animation="false"
                                        isOpen={suggestion}
                                        centered
                                        fullscreen="md"
                                        size="md"
                                        toggle={suggestionToggle}
                                    >
                                        <ModalHeader toggle={suggestionToggle}>
                                            Suggestion For {truck.name}
                                        </ModalHeader>
                                        <ModalBody>
                                            <SuggestionForm suggestionToggle={suggestionToggle} truckId={truck.id} />
                                        </ModalBody>
                                    </Modal></>
                                : ""
                        }
                    </div>
                </div>
            </div>
            <div className="truck__schedule-card">
                <h3 className="schedule-heading">Current Schedule</h3>
                <div className="truck-schedule-card">
                    {
                        days.map(day => {
                            return <div key={day.id} className="schedule-card-full">
                                <div className="day__name">{day.day}</div>
                                <TruckSchedule key={`truck--${truck.id}--schedule--${day.id}`}
                                    dayId={day.id}
                                    truckId={truck.id}
                                    truckPage={truckId}
                                    createNewLocation={createNewLocation}
                                    truckLocations={truckLocations}
                                    neighborhoods={neighborhoods}

                                />
                            </div>
                        })
                    }
                </div>
            </div>

            <div className="truck-reviews-section">
                <div className="truck-reviews-heading">
                    <h3 className="schedule-heading">Recent Reviews</h3>
                    <Link to={`/reviews/${truck.id}`} className="all-reviews">{`View All (${truck.reviews?.length} reviews)`}</Link>
                </div>
                <div className="truck__reviews card">
                    <div className="review-list reviews">
                        {
                            reviews.length > 0
                                ? reviews.slice(0, 3).map(review => {
                                    return <div key={review.id} className="truck-review-card"><Review key={review.id} review={review} setTruck={setTruck} alertNewRating={alertNewRating} /></div>
                                })
                                : truckId
                                    ? ""
                                    : <div className="no-reviews">No Reviews Yet</div>
                        }
                    </div>
                    {
                        currentUser?.owner
                            ? ""
                            : <div className="review-form"><ReviewForm truckId={truckId} setTruck={setTruck} alertNewRating={alertNewRating} /></div>
                    }
                </div>
            </div>
        </div>
    )
}