import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import TruckLocationRepository from "../../repositories/TruckLocationRepository"
import { NeighborhoodCard } from "../neighborhoods/NeighborhoodCard"
import '../trucks/TruckList.css';


export const TruckSchedule = ({ dayId, truckLocations, truckId, truckPage, neighborhoods, createNewLocation }) => {
    const [neighborhood, setNeighborhood] = useState({})


    useEffect(() => {
        if (truckLocations) {
            const location = truckLocations.find(location => location.day.id===dayId)
            setNeighborhood(location?.neighborhood)
        }
    }, [truckLocations])

    return (
        <>
            {
                truckPage
                        ? neighborhood?.id
                            ? <div className="schedule-card" ><NeighborhoodCard key={neighborhood.id} thisNeighborhood={neighborhood} /></div>
                            : <div className="schedule-card" ><div className="neighborhood-card"><div className="neighborhood-card-body">Off Today</div></div></div>

                        : neighborhood
                            ? (
                                <div className="schedule-card" >
                                    <div className="neighborhood-label">{neighborhood.name}</div>
                                    <NeighborhoodCard key={`Profile--${truckId}--${dayId}`} thisNeighborhood={neighborhood} />
                                    <div className="form-group">
                                        <select
                                            key={neighborhood.id}
                                            defaultValue=""
                                            name="location"
                                            id="locationId"
                                            onChange={e => {
                                                createNewLocation(truckId, e.target.value, dayId)
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
                                </div>
                            )

                            : <div className="schedule-card">
                                <div className="neighborhood-label">N/A</div>
                                <div className="neighborhood-card"><div className="neighborhood-card-body">Off Today</div></div>

                                <div className="form-group">
                                    <select
                                        key={dayId}
                                        defaultValue=""
                                        name="location"
                                        id="locationId"
                                        onChange={e => {
                                            createNewLocation(truckId, e.target.value, dayId)
                                            TruckLocationRepository.getTruckLocationsByTruckAndDay(truckId, dayId).then(res => setNeighborhood(res.neighborhood))
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
                                </div>
                            </div>
            }
        </>
    )
}


