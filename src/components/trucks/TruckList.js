import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import TruckLocationRepository from "../../repositories/TruckLocationRepository"
import { TruckCard } from "./TruckCard"
import './TruckList.css';


export const TruckList = ({ neighborhoodId, dayId, favorites, typePref, sortPref, src, favoriteTrucks }) => {
    const [truckLocations, updateTruckLocations] = useState([])
    const history = useHistory()
    const [userFavorites, setFavorites] = useState([])
    const [locationsToMap, setLocationsToMap] = useState([])
    
    useEffect(() => {
        if (favorites) {
            const favorites = truckLocations.filter(location => userFavorites.find(fav => fav.truck.id === location.truck.id))
            setLocationsToMap(favorites)
        } else {
            setLocationsToMap(truckLocations)
        }
    },[favorites, truckLocations])

    useEffect(() => {
        if (favoriteTrucks) {
            setFavorites(favoriteTrucks)
        }
    }, [favoriteTrucks])

    useEffect(() => {
        let searchParams = ""
        if (dayId && neighborhoodId) {
            searchParams += `?dayId=${dayId}&neighborhoodId=${neighborhoodId}`
        }
        if (typePref) {
            searchParams += `&typeId=${typePref}`
        }
        if (sortPref) {
            searchParams += `&orderBy=${sortPref}`
        }

        TruckLocationRepository.getTruckLocationsWithParams(searchParams).then((r) => {
            if (sortPref === 'user_rating') {
                const sorted = r.sort((a, b) => b.truck.user_rating - a.truck.user_rating)
                updateTruckLocations(sorted)
            }
            else {
                updateTruckLocations(r)
            }
        })
    }, [dayId, neighborhoodId, typePref, sortPref])


    if (locationsToMap.length > 0) {
        return (
            <div className="neighborhood-truck-list">
                <button className="neighborhood-list-label" onClick={() => { history.push(`/neighborhoods/${neighborhoodId}`) }}>
                    <img alt="logo" className="neighborhood__image-label" src={src} />
                </button>
                <div className="trucks scrollbar scrollbar-juicy-peach">
                    {
                        locationsToMap.map(truckLocation => {
                            const favorite = userFavorites.find(fav => fav.truck.id === truckLocation.truck.id)
                            return <div className="truck-list-card" key={truckLocation.truck.id}>
                                <TruckCard thisTruck={truckLocation.truck} favorite={favorite} />
                            </div>
                        })
                    }
                </div>
            </div>
        )

    } else return ""
}