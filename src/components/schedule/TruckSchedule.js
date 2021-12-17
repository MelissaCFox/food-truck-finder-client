import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import TruckLocationRepository from "../../repositories/TruckLocationRepository"
import { NeighborhoodCard } from "../neighborhoods/NeighborhoodCard"
import '../trucks/TruckList.css';



export const TruckSchedule = ({ dayId, truckId, truckPage, createNewLocation, neighborhoods }) => {

    const [truckNeighborhoods, setTruckNeighborhoods] = useState([])
    const [truckNeighborhood, setTruckNeighborhood] = useState({})

    useEffect(() => {
        if (truckId) {
            TruckLocationRepository.getTruckLocationsByTruckAndDay(truckId, dayId).then(setTruckNeighborhoods)
        }
    }, [truckId, dayId])

    useEffect(() => {
        if (truckNeighborhoods && neighborhoods) {
            const foundNeighborhood = neighborhoods?.find(neighborhood => neighborhood.id === truckNeighborhoods[0]?.neighborhoodId)
            setTruckNeighborhood(foundNeighborhood)
        }
    }, [truckNeighborhoods, neighborhoods])


    return (
        <>
            {
                truckId
                    ? truckPage
                        ? truckNeighborhood
                            ? <NeighborhoodCard key={truckNeighborhood.id} neighborhoodId={truckNeighborhood.id} />
                            : <div className="card-body">Off Today</div>

                        : truckNeighborhood
                            ? (
                                <>
                                    <div className="neighborhood-label">{truckNeighborhood.name}</div>
                                    <NeighborhoodCard key={`Profile--${truckId}--${dayId}`} neighborhoodId={truckNeighborhood.id} />
                                    <div className="form-group">
                                        <select
                                            key={truckNeighborhood.id}
                                            defaultValue=""
                                            name="location"
                                            id="locationId"
                                            onChange={e => {
                                                createNewLocation(truckId, e.target.value, dayId)
                                                TruckLocationRepository.getTruckLocationsByTruckAndDay(truckId, dayId).then(setTruckNeighborhoods)
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">--Change Location--</option>
                                            <option value="0">OFF</option>

                                            {
                                                neighborhoods.map(neighborhood => {
                                                    return <option key={`neighborhood--${dayId}--${neighborhood.id}`} id={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </>
                            )

                            : <><div className="card-body">Off Today</div>
                                <div className="form-group">
                                    <select
                                        key={dayId}
                                        defaultValue=""
                                        name="location"
                                        id="locationId"
                                        onChange={e => {
                                            createNewLocation(truckId, e.target.value, dayId)
                                            TruckLocationRepository.getTruckLocationsByTruckAndDay(truckId, dayId).then(setTruckNeighborhoods)
                                        }}
                                        className="form-control"
                                    >
                                        <option value="">--Change Location--</option>
                                        <option value="0">OFF</option>
                                        {
                                            neighborhoods.map(neighborhood => {
                                                return <option key={neighborhood.id} id={neighborhood.id} value={neighborhood.id}>{neighborhood.name}</option>
                                            })
                                        }
                                    </select>
                                </div></>

                    : ""
            }
        </>
    )
}


