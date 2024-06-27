import { userService } from "../services/user.service.js"
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

const { useState, useEffect } = React
const { useNavigate } = ReactRouterDOM

export function UserIndex() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        loadUsers()
    }, [])

    function loadUsers() {
        userService.query()
            .then(setUsers)
            .catch(err => {
                console.error('Error loading users:', err)
                showErrorMsg('Cannot load users')
            })
    }

    function onRemoveUser(userId) {
        userService.remove(userId)
            .then(() => {
                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId))
                showSuccessMsg('User removed')
            })
            .catch(err => {
                console.error('Error removing user:', err)
                showErrorMsg('Cannot remove user')
            })
    }

    const navigate = useNavigate()

    return (
        <section className="user-index">
            <h1>User Management</h1>
            <button onClick={() => navigate('/')}>Back to Home</button>
            {users.length ? (
                <ul>
                    {users.map(user => (
                        <li key={user._id}>
                            <span>{user.fullname}</span>
                            {/* <button onClick={() => navigate(`/user/${user._id}`)}>View</button> */}
                            <button onClick={() => onRemoveUser(user._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading users...</p>
            )}
        </section>
    )
}