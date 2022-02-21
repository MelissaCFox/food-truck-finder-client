import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button } from "reactstrap"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import SuggestionRepository from "../../repositories/SuggestionsRepository"
import UserRepository from "../../repositories/UserRepository"


export const Suggestions = ({ updateReadStateChange, suggestions }) => {
    const { getCurrentUser } = useSimpleAuth()
    const [unreadSuggestionsNum, setUnreadSuggestionsNum] = useState(0)

    const [suggestionsList, setSuggestionsList] = useState([])

    const [messageList, setMessageList] = useState("unread")

    const [readStateChange, setReadStateChange] = useState(false)
    const triggerReadStateChange = () => setReadStateChange(!readStateChange)


    useEffect(() => {
        // UserRepository.getAllTruckOwners()
        //     .then((res) => {
        //         const foundTruckOwner = res.find(truckOwner => truckOwner.userId === getCurrentUser().id)

                if (suggestions) {
                    if (messageList === "all") {
                        setSuggestionsList(suggestions)
                    } else {
                        const unread = suggestions.filter(suggestion => suggestion.read === false)
                        setUnreadSuggestionsNum(unread.length)
                        setSuggestionsList(unread)
                    }

                } else return false
            // })
    }, [messageList, readStateChange, suggestions])

    // useEffect(() => {
    //     UserRepository.getAllTruckOwners()
    //         .then((res) => {
    //             const foundTruckOwner = res.find(truckOwner => truckOwner.userId === getCurrentUser().id)
    //             if (foundTruckOwner) {
    //                 SuggestionRepository.getAllUnreadForTruck(foundTruckOwner.id).then(setUnreadSuggestions)
    //             } else return false
    //         })
    // }, [readStateChange, suggestions])

    const updateMessage = (suggestion) => {
        SuggestionRepository.get(suggestion.id)
            .then((res) => {
                if (res.read === false) {
                    let updatedSuggestion = { ...res }
                    updatedSuggestion.read = true
                    SuggestionRepository.update(suggestion.id, updatedSuggestion)
                        .then(() => {
                            updateReadStateChange()
                            triggerReadStateChange()
                        })

                } else {
                    let updatedSuggestion = { ...res }
                    updatedSuggestion.read = false
                    SuggestionRepository.update(suggestion.id, updatedSuggestion)
                        .then(() => {
                            updateReadStateChange()
                            triggerReadStateChange()
                        })
                }
            })
    }

    return (
        <div className="userSuggestions">
            <div className="messageList--options">
                <Button className="messageList--option-btn" onClick={() => { setMessageList("unread") }}>Unread Suggestions ({unreadSuggestionsNum}) {messageList === "unread" ? "-->" : ""} </Button>
                <Button className="messageList--option-btn" onClick={() => { setMessageList("all") }}>All Suggestions {messageList === "all" ? "-->" : ""}</Button>
            </div>
            <div className="messagesList">
                {
                    suggestionsList.length > 0

                        ? suggestionsList.map(suggestion => {
                            return <div key={suggestion.id} className="suggestion">
                                <div >
                                    <div className="suggestion-truck">{suggestion.truck.name}</div>
                                    <div className="suggestion-neighborhood">Where:  {suggestion.neighborhood.name}</div>
                                    <div className="suggestion-date">When:  {suggestion.date}</div>
                                    <div className="suggestion-message">What:  {suggestion.message}</div>
                                    <div className="suggestion-author">
                                        <div>~{suggestion.user_account.user.name} </div>
                                        <div>
                                            {
                                                suggestion.includeContact === true
                                                    ? <div><a className="contactEmail" href={`mailto:${suggestion.user.email}`}>Contact User</a></div>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Button className="suggestion-btn" onClick={() => updateMessage(suggestion)}>Mark Read/Unread</Button>
                                <Button className="suggestion-btn" onClick={() => SuggestionRepository.delete(suggestion.id).then(triggerReadStateChange)}>Delete</Button>
                            </div>
                        })
                        : <div className="suggestion"><div className="noMessages">No suggestions</div></div>
                }

            </div>

        </div>
    )

}