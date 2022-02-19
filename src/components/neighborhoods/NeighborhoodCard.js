import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import Settings from "../../repositories/Settings"



export const NeighborhoodCard = ({ thisNeighborhood, neighborhoodId }) => {
    const history = useHistory()
    const [neighborhood, setNeighborhood] = useState({})


    useEffect(() => {
        if (thisNeighborhood) {
            setNeighborhood(thisNeighborhood)
        } else if (neighborhoodId)
            setNeighborhood(neighborhoodId)
    }, [thisNeighborhood, neighborhoodId])


    return (

        <div className="neighborhood-card">
            <div className="neighborhood-card-body">
                <button className="neighborhood-logo-btn" onClick={() => { history.push(`/neighborhoods/${neighborhood.id}`) }}>
                    <img className="neighborhood-logo" src={`${Settings.remoteURL}${neighborhood.profile_img_src}`} alt={`${neighborhood?.name} logo`} />
                    </button>
            </div>
        </div>

    )

}