import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { Input } from "reactstrap"
import FoodTypeRepository from "../../repositories/FoodTypeRepository"
import NeighborhoodRepository from "../../repositories/NeighborhoodRepository"
import UserTruckFavoriteRepository from '../../repositories/UserTruckFavoriteRepository'
import Settings from "../../repositories/Settings"
import { TruckList } from "./TruckList"
import './TruckList.css';


export const NeighborhoodTruckList = () => {
    const [neighborhoods, setNeighborhoods] = useState([])
    const [dateString, setDateString] = useState("")
    const [dateForList, setDateForList] = useState("")
    const [favorites, setFavorites] = useState(false)
    const toggleFavorites = () => setFavorites(!favorites)
    const [typePref, setTypePref] = useState(0)
    const [foodTypes, setFoodTypes] = useState([])
    const [sortPref, setSortPref] = useState("")
    const [dayId, setDayId] = useState(1)

    const location = useLocation()

    useEffect(() => {
        FoodTypeRepository.getAll().then(setFoodTypes)
    }, [])

    useEffect(() => {
        let newDate = new Date()
        setDateForList(newDate)
    }, [location])

    useEffect(() => {
        let date = new Date(dateForList)

        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        const day = date?.getDay()
        const number = date?.getDate()
        const month = date?.getMonth()
        const year = date?.getFullYear()

        setDateString(`${days[day]} ${months[month]} ${number}, ${year}`)
        setDayId(day)

    }, [dateForList])


    useEffect(() => {
        NeighborhoodRepository.getAll().then(setNeighborhoods)
    }, [])

    const [favoriteTrucks, setFavoriteTrucks] = useState([])
    
    useEffect(()=> {
        UserTruckFavoriteRepository.getAll().then(setFavoriteTrucks)
    },[])

    return (
        <>
            <div className="options">
                <div className="date">
                    <div className="date-string">
                        <input className="date-picker" type="date" onChange={(event) => {
                            const newDate = event.target.value
                            const parsedDate = Date.parse(newDate) + 86400000
                            const accurateDate = new Date(parsedDate)
                            setDateForList(accurateDate)
                        }}></input>
                        <h2>{dateString}</h2>
                    </div>

                </div>
                <div className="filter-options">

                    <div className="filter-option">
                        <label className="dropDown" >Show Only Favorites</label>
                        <Input className="checkbox" type="checkbox" onChange={toggleFavorites} />
                    </div>

                    <div className="filter-option">
                        <label className="dropDown label">Filter By Food Type</label>
                        <select className="dropDown" id="typeSelect" type="select" onChange={e => setTypePref(parseInt(e.target.value))}>
                            <option value="0">--All--</option>
                            {
                                foodTypes.map(type => <option key={type.id} value={type.id}>{type.type}</option>)
                            }

                        </select>
                    </div>

                    <div className="filter-option">
                        <label className="dropDown label">Sort Trucks By</label>
                        <select className="dropDown" id="sortPref" type="select" onChange={e => setSortPref(e.target.value)}>
                            <option value="">--All--</option>
                            <option value="priceAsc">Price (low to high)</option>
                            <option value="priceDesc">Price (high to low)</option>
                            <option value="userRating">User Rating</option>

                        </select>
                    </div>

                </div>
            </div>
            <ul className="neighborhoods">
                {
                    neighborhoods.map(neighborhood => {
                        const trucksToday = neighborhood.days_with_trucks?.find(day => day.id === dayId + 1)
                        if (trucksToday) {
                            const src = `${Settings.remoteURL}${neighborhood.profile_img_src}`
                            return <TruckList className="multi-truck-list " key={neighborhood.id} src={src} neighborhoodId={neighborhood.id} dayId={dayId + 1} favorites={favoriteTrucks} />

                        } else return false
                    })
                }
            </ul>
        </>
    )

}