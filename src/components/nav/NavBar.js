import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import useSimpleAuth from "../../hooks/ui/useSimpleAuth";
import Settings from "../../repositories/Settings";
import TruckRepository from "../../repositories/TruckRepository";
import './NavBar.css';
import FTFLogo from "../images/FTFLogoLogin.png"
import { fetchIt } from "../../repositories/Fetch";


export const NavBar = () => {
    const { isAuthenticated, logout, getCurrentUser } = useSimpleAuth()
    const [currentUser, setCurrentUser] = useState({
        firstName: "",
        lastName: ""
    })
    useEffect(() => {
        getCurrentUser().then(setCurrentUser)

    }, [])
    const history = useHistory()
    const refresh = true
    const welcomes = ["Welcome", "Hi", "Hey There", "Hello", "Howdy"]
    const [welcome, setWelcome] = useState("")

    useEffect(() => {
        setWelcome(welcomes[Math.floor(Math.random() * 5)])
    }, [welcomes])



    const search = () => {

        const terms = document.querySelector("#searchTerms").value
        const foundItems = {
            trucksSet: new Set(),
            neighborhoods: [],
            trucks: []
        }

        const fetchArray = []
        fetchArray.push(fetchIt(`${Settings.remoteURL}/trucks?q=${terms}`)
            .then(trucks => {
                trucks.forEach((truck) => {
                    foundItems.trucksSet.add(truck)
                })
            })
        )

        fetchArray.push(fetchIt(`${Settings.remoteURL}/neighborhoods?q=${terms}`)
            .then(neighborhoods => {
                foundItems.neighborhoods = neighborhoods
            })
        )

        Promise.all(fetchArray)
            .then(() => {
                foundItems.trucksSet.forEach((truck) => {
                    foundItems.trucks.push(truck)
                })
                history.push({
                    pathname: "/search",
                    state: foundItems
                })

            })


    }

    return (
        <div className="container">
            <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top onTop">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div id="navbarNavDropdown" className="navbar-collapse collapse header">
                    <ul className="navbar-nav mr-auto appLogo">
                        <button onClick={() => {
                            TruckRepository.getAll()
                                .then(() => history.push({
                                    pathname: `/trucks`,
                                    state: refresh
                                }))
                        }}>
                            <img src={FTFLogo} alt="Food Truck Finder Logo" className="appLogo-btn" />
                        </button>
                    </ul>
                    <div className="navbar-nav-links">
                        <ul className="navbar-nav search">
                            <li className="nav-item search">
                                <input id="searchTerms"
                                    onKeyUp={search}
                                    className="form-control w-100"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search" />
                            </li>
                        </ul>
                        <ul className="navbar-nav profile">
                            <li className="nav-item dropdown">
                                {
                                    isAuthenticated()
                                        ? <div className="name-btn"><button className="nav-link name-btn" onClick={() => { history.push("/profile") }}><div className="name">{welcome}, {currentUser?.firstName}!</div></button></div>
                                        : <Link className="nav-link" to="/login">Login</Link>
                                }
                            </li>
                        </ul>

                        <ul className="navbar-nav logout">
                            <li className="nav-item dropdown">
                                {
                                    isAuthenticated()
                                        ? <div className="logout-btn"><button className="nav-link logout-btn" onClick={() => {
                                            logout()
                                            history.push("/login")
                                        }}><div className="logout-btn">Logout</div></button></div>
                                        : <Link className="nav-link" to="/login">Login</Link>
                                }
                            </li>

                        </ul>
                    </div>

                </div>
            </nav>
        </div>
    )
}
