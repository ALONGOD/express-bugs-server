import { userService } from "../services/user.service.js"
import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'



const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function UserDetails() {

    const [bugs, setBugs] = useState([])

    function loadBugs() {
        bugService.query().then(setBugs)
    }
    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }
    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('New description?')
        const bugToSave = { ...bug, severity, description }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                setBugs(prevBugs => prevBugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                ))
                showSuccessMsg('Bug updated')
            })

            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }
    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBugs()
        loadUser()
    }, [params.userId])


    function loadUser() {
        userService.get(params.userId)
            .then(setUser)
            .catch(err => {
                console.log('err:', err)
                navigate('/')
            })
    }

    function onBack() {
        navigate('/')
    }


    if (!user) return <div>Loading...</div>
    return (
        <section className="user-details">
            <h1>User {user.fullname}</h1>
            <pre>
                {JSON.stringify(user, null, 2)}
            </pre>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
            <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} isUserDetailsPage={true} />

            <button onClick={onBack} >Back</button>
        </section>
    )
}