import { useState } from "react"
import { useEffect } from "react/cjs/react.development"
import { Button, Collapse, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import UserRepository from "../../repositories/UserRepository"
import TruckRepository from "../../repositories/TruckRepository"
import { Truck } from "../trucks/Truck"
import { TruckForm } from "./TruckForm"
import { Favorites } from "./Favorites"

export const Owner = (props) => {
    const [user, setUser] = useState({})
    const [trucks, setTrucks] = useState([])
    const [modal, setModal] = useState(false)
    const toggle = () => setModal(!modal)
    const [collapse, setCollapse] = useState(false)
    const toggle2 = () => setCollapse(!collapse)
    const [confirm, setConfirm] = useState(false)
    const toggle3 = () => setConfirm(!confirm)

    useEffect(() => {
        TruckRepository.getAll().then(setTrucks)
    }, [])

    const refreshUser = () => {
        UserRepository.get(props.userId).then(setUser)
    }

    useEffect(() => {
        refreshUser()
    }, [])

    return (
        <>
            <div className="header">

                <div className="buttons">
                    <Button
                        color="success"
                        outline
                        onClick={toggle}
                    >
                        Register Truck
                    </Button>
                    <Modal
                        isOpen={modal}
                        fullscreen="lg"
                        size="lg"
                        toggle={toggle}
                    >
                        <ModalHeader toggle={toggle}>
                            Register New Truck
                        </ModalHeader>
                        <ModalBody>
                            <TruckForm userId={props.userId} toggle={toggle} />
                        </ModalBody>
                        <ModalFooter>

                            <Button onClick={toggle}>
                                Cancel
                            </Button>
                        </ModalFooter>
                    </Modal>

                    <Button color="success" outline onClick={toggle2}>Favorites</Button>
                    <div>
                        <Collapse animation="false" isOpen={collapse}>
                            <Favorites userId={props.userId} />
                        </Collapse>
                    </div>
                </div>

            </div>

            <div className="owner-trucks">
                <h3>My Truck(s)</h3>
                <div className="truck-list">
                    {
                        user.truckOwners?.map(truckOwner => {
                            const foundTruck = trucks.find(truck => truck.id === truckOwner.truckId)
                            if (foundTruck) {
                                return <li className="card" key={truckOwner.id}>
                                    <Truck key={foundTruck.id} truckId={foundTruck.id} refresh={refreshUser} />

                                    <Button type="retire"
                                        color="danger"
                                        value={foundTruck.id}
                                        onClick={toggle3}
                                        className="btn btn-primary"> Retire Truck </Button>
                                    <Modal
                                        isOpen={confirm}
                                        centered
                                        fullscreen="sm"
                                        size="sm"
                                        toggle={toggle}
                                    >
                                        <ModalHeader toggle={toggle3}>
                                            Are You Sure You Want to Retire {foundTruck.name}?
                                        </ModalHeader>
                                        <ModalBody>
                                        <Button onClick={() => {TruckRepository.delete(foundTruck.id).then(toggle3).then(TruckRepository.getAll().then(setTrucks))}}>
                                                Yes
                                            </Button>
                                            <Button onClick={toggle3}>
                                                Cancel
                                            </Button>
                                        </ModalBody>
 
                                    </Modal>

                                </li>
                            }
                        })

                    }
                </div>
            </div>
        </>
    )
}