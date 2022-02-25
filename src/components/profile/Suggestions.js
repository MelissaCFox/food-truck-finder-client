import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button } from "reactstrap"
import SuggestionRepository from "../../repositories/SuggestionsRepository"


export const Suggestions = ({ updateReadStateChange, suggestions, allMessages, setAllMessages }) => {
    const [unreadSuggestionsNum, setUnreadSuggestionsNum] = useState(0)
    const [suggestionsList, setSuggestionsList] = useState([])

    useEffect(() => {

        if (suggestions) {
            suggestions.sort((a, b) => {
                return new Date(b.date) - new Date(a.date)
            })
            if (allMessages) {
                setSuggestionsList(suggestions)
                const unread = suggestions.filter(suggestion => suggestion.read === false)
                setUnreadSuggestionsNum(unread.length)
            } else {
                const unread = suggestions.filter(suggestion => suggestion.read === false)
                setUnreadSuggestionsNum(unread.length)
                setSuggestionsList(unread)
            }
        } else return false

    }, [allMessages, suggestions])


    const updateMessage = (suggestion) => {
        SuggestionRepository.get(suggestion.id)
            .then((res) => {

                let updatedSuggestion = { ...res }
                updatedSuggestion.read = !suggestion.read
                SuggestionRepository.update(suggestion.id, updatedSuggestion)
                    .then(() => {
                        updateReadStateChange()

                    })
            })
    }

    return (
        <div className="userSuggestions">
            <div className="messageList--options">
                <Button className="messageList--option-btn" onClick={() => { setAllMessages(false) }}>Unread Suggestions ({unreadSuggestionsNum}) {allMessages ? "" : "-->"} </Button>
                <Button className="messageList--option-btn" onClick={() => { setAllMessages(true) }}>All Suggestions ({suggestions.length}) {allMessages ? "-->" : ""}</Button>
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
                                        <div>~{suggestion.user_account.user.first_name} </div>
                                        <div>
                                            {
                                                suggestion.include_contact === true
                                                    ? <div><a className="contactEmail" href={`mailto:${suggestion.user_account.email}`}>Contact User</a></div>
                                                    : ""
                                            }
                                        </div>
                                    </div>
                                </div>
                                <Button className="suggestion-btn" onClick={() => updateMessage(suggestion)}>Mark as {suggestion.read ? "Unread" : "Read"}</Button>
                                <Button className="suggestion-btn" onClick={() => SuggestionRepository.delete(suggestion.id).then(updateReadStateChange)}>Delete</Button>
                            </div>
                        })
                        : <div className="suggestion"><div className="noMessages">No suggestions</div></div>
                }

            </div>

        </div>
    )

}