import { useEffect, useState } from "react"
import UserRepository from "../../repositories/UserRepository"
import userTruckFavorites from "../../repositories/UserTruckFavoriteRepository"
import { TruckCard } from "../trucks/TruckCard"


export const Favorites = ({ thisUser, newInfo }) => {
    const [favorites, setFavorites] = useState([])
    useEffect(() => {
        // getFavorites should always only ever return truck favorites for the currently logged in user
        userTruckFavorites.getAll().then(setFavorites)
    },[])

    return (
        <ul className={thisUser.owner ? "owner-favorites list" : "favorites list"}>

            {
                favorites.length > 0

                    ? favorites.map(favorite => {
                        return <li className="card truck" key={favorite.id}>
                            <TruckCard key={favorite.id} thisTruck={favorite.truck} newInfo={newInfo} favorite={true} />
                        </li>
                    })
                    : <li className="card truck"><div className="card-body">No Favorites Yet</div></li>

            }
        </ul>

    )
}