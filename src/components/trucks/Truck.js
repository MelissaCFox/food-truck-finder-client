import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import { useState, useEffect } from "react/cjs/react.development"
import TruckRepository from "../../repositories/TruckRepository"
import NeighborhoodRepository from "../../repositories/NeighborhoodRepository"


export const Truck = () => {
    const [truck, setTruck] = useState({})
    const { truckId } = useParams()
    const [neighborhoods, setNeighborhoods] = useState([])
    const [truckLocations, setTruckLocations] = useState([])

    useEffect(() => {
        TruckRepository.getTruckLocationsByTruck(truckId).then(setTruckLocations)
    }, [])

    useEffect(() => {
        NeighborhoodRepository.getAll().then(setNeighborhoods)
    }, [])

    useEffect(() => {
        TruckRepository.get(truckId).then(setTruck)

    }, [truckId])

    const currentDayId = new Date().getDay() + 1
    const currentTruckLocation = truck?.truckLocations?.find(location => location.dayId === currentDayId)
    const currentNeighborhood = neighborhoods?.find(neighborhood => neighborhood.id === currentTruckLocation?.neighborhoodId)

    return (
        <>
            <div className="truck__header">
                <div className="truck__details">
                    <div className="truck__name">
                        {truck.name}
                    </div>
                    <div className="truck__image">
                        <img className="truck-logo" src={truck.profileImgSrc} alt={`${truck.name} logo`} />
                    </div>
                    <div className="truck__info">
                        <div className="truck__info--type"></div>
                        <div className="truck__info--description">{truck.description}</div>
                        <div className="truck__info--links">
                            <a className="link" target="_blank" href={truck.websiteURL} ><img className="link__logo" src="https://www.freepnglogos.com/uploads/logo-website-png/logo-website-file-globe-icon-svg-wikimedia-commons-21.png" /></a>
                            <a className="link" target="_blank" href={truck.instagramURL}><img className="link__logo" src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c521.png" /></a>
                        </div>
                    </div>
                </div>
                <div className="truck__currentLocation">
                    Find Us Today In {currentNeighborhood?.name}

                </div>
            </div>

            <div className="truck__schedule schedule">
                {
                    truckLocations.map(location => {
                        return <div className="card schedule-card">
                            <div>{location?.day.day}</div>
                            <div className="card-body">{location?.neighborhood.name}</div>
                        </div>

                    })
                }
            </div>
            <div className="truck__reviews">

            </div>

        </>
    )



}