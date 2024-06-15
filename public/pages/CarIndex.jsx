import { CarFilter } from "../cmps/CarFilter.jsx"
import { CarList } from "../cmps/CarList.jsx"
import { carService } from "../services/car.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

const { useState, useEffect } = React
const { Link } = ReactRouterDOM

export function CarIndex() {

    const [cars, setCars] = useState(null)
    const [filterBy, setFilterBy] = useState(carService.getDefaultFilter())

    useEffect(() => {
        carService.query(filterBy)
            .then(cars => setCars(cars))
            .catch(err => console.log('err:', err))
    }, [filterBy])

    function onRemoveCar(carId) {
        carService.remove(carId)
            .then(() => {
                console.log('carId:', carId)
                setCars(prevCars => prevCars.filter(car => car._id !== carId))
                showSuccessMsg(`Car Removed! ${carId}`)
            })
            .catch(err => {
                console.log('err:', err)
                showErrorMsg('Problem Removing ' + carId)
            })
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    if (!cars) return <div>Loading...</div>
    return (
        <section className="car-index">
            <CarFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
            <Link to="/car/edit" >Add Car</Link> |
            <a href="/api/download-pdf">Download PDF</a>
            <CarList cars={cars} onRemoveCar={onRemoveCar} />
        </section>
    )
}