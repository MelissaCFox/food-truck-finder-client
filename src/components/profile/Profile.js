import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth"
import { Owner } from "./Owner"
import { User } from "./User"


export const Profile = () => {
    const { getCurrentUser } = useSimpleAuth()
    const [currentUser, setCurrentUser] = useState({})
    useEffect(() => {
        getCurrentUser().then(setCurrentUser)

    }, [])

    return (
        currentUser.owner
            ? <Owner userId={currentUser.id} currentUser={currentUser} />
            : <User userId={currentUser.id} currentUser={currentUser} />
    )
}