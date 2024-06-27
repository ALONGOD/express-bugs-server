const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from "../services/user.service.js";



export function BugList({ bugs, onRemoveBug, onEditBug, isUserDetailsPage }) {

  const user = userService.getLoggedinUser()

  function isOwner(bug) {
    if (!user) return false
    if (!bug.creator) return true
    return user.isAdmin || bug.creator._id === user._id
  }


  const filteredBugs = isUserDetailsPage ? bugs.filter(isOwner) : bugs;


  return (
    <ul className="bug-list">
      {filteredBugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
          {isOwner(bug) &&
            <div>
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                x
              </button>
              <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button>
            </div>}

        </li>
      ))}
    </ul>
  )
}
