import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, Collapse, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import UserRepository from "../../repositories/UserRepository"
import TruckRepository from "../../repositories/TruckRepository"
import { Truck } from "../trucks/Truck"
import { TruckForm } from "../forms/TruckForm"
import { Favorites } from "./Favorites"
import { Suggestions } from "./Suggestions"
import SuggestionRepository from "../../repositories/SuggestionsRepository"

export const Owner = ({ userId }) => {
    const [user, setUser] = useState({})
    const [trucks, setTrucks] = useState([])
    const [ownedTrucks, setOwnedTrucks] = useState([])

    const [register, setRegister] = useState(false)
    const toggleRegister = () => setRegister(!register)
    const [collapse, setCollapse] = useState(false)
    const toggleCollapse = () => setCollapse(!collapse)
    const [suggestions, setSuggestions] = useState(false)
    const toggleSuggestions = () => setSuggestions(!suggestions)

    const [allSuggestions, setAllSuggestions] = useState([])
    const [newUnreadSuggestions, setUnreadSuggestions] = useState([])
    const [readStateChange, setReadStateChange] = useState(false)
    const updateReadStateChange = () => setReadStateChange(!readStateChange)
    const [allMessages, setAllMessages] = useState(false)

    useEffect(() => {
        const recentTrucks = user.truckOwners?.sort((a, b) => {
            return b.truckId - a.truckId
        })
        setOwnedTrucks(recentTrucks)
    }, [user])


    useEffect(() => {
        TruckRepository.getOwnerTrucks()
        .then(response => {
            let suggestions = []
            let unreadSuggestions = 0
            for (const truck of response) {
                unreadSuggestions += truck.unread_suggestions
                for (const suggestion of truck.suggestions) {
                    suggestions.push(suggestion)
                }
            }
            setAllSuggestions(suggestions)
            setUnreadSuggestions(unreadSuggestions)
        })
    },[readStateChange])


    useEffect(() => {
        UserRepository.get(userId).then(setUser)

    }, [userId])

    return (
        <>
            <div className="owner-header">

                <div className="buttons">
                    <Button className="owner-buttons" color="success" outline onClick={toggleRegister} > Register Truck </Button>
                    <Modal isOpen={register} fullscreen="lg" size="lg" toggle={toggleRegister}>
                        <ModalHeader toggle={toggleRegister}>
                            Register New Truck
                        </ModalHeader>
                        <ModalBody>
                            <TruckForm userId={userId} toggle={toggleRegister} setTrucks={setTrucks} setUser={setUser} />
                        </ModalBody>
                        <ModalFooter> <Button onClick={toggleRegister}> Cancel </Button>
                        </ModalFooter>
                    </Modal>

                    <Button color="success" className="owner-buttons" outline onClick={() => {
                        if (suggestions) {
                            toggleSuggestions()
                        }
                        toggleCollapse()
                    }}>Favorites</Button>

                    <Button
                        className="owner-buttons"
                        color="success"
                        outline
                        onClick={() => {
                            if (collapse) {
                                toggleCollapse()
                            }
                            toggleSuggestions()
                        }}>
                        Suggestions
                        {
                            newUnreadSuggestions > 0
                                ? <div>({newUnreadSuggestions} New)</div>
                                : ""
                        }
                    </Button>
                </div>

                <div>
                    <Collapse isOpen={collapse}>
                        <div className="owner-favorites">
                            <div className="profile-container"><Favorites userId={userId} /></div>
                        </div>
                    </Collapse>

                    <Collapse isOpen={suggestions}>
                        <ul className="suggestions">
                            <div className="suggestion--messages"><Suggestions 
                            key={readStateChange} 
                            suggestions={allSuggestions} 
                            updateReadStateChange={updateReadStateChange}
                            allMessages={allMessages}
                            setAllMessages={setAllMessages}
                             /></div>
                        </ul>
                    </Collapse>
                </div>
            </div>

            <div className="owner-trucks">
                <ul className="truck-list">
                    {
                        user.trucks?.map(truck => {
                            return <li key={truck.id}>
                                <Truck key={truck.id} truckID={truck.truck.id} setTrucks={setTrucks} setUser={setUser} userId={userId} updateReadStateChange={updateReadStateChange} />

                            </li>

                        })
                    }
                </ul>
            </div>
        </>
    )
}