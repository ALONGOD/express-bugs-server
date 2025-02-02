import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React

export function BugIndex() {
  const [filterBy, setFilterBy] = useState(
    bugService.getEmptyFilter()
  )
  function onSetFilterBy(newFilter) {
    setFilterBy({ ...newFilter })
  }
  const [bugs, setBugs] = useState([])

  useEffect(() => {
    loadBugs(filterBy)
  }, [filterBy])

  function loadBugs() {
    bugService.query(filterBy).then(setBugs)
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
  function onAddBug() {
    const title = prompt('Bug title?');
    const severity = +prompt('Bug severity?');
    const description = prompt('New description?');
    const labelsString = prompt('New labels? (separate by commas)');
    const labels = labelsString.split(',').map(label => label.trim());

    const bug = {
      title,
      severity,
      description,
      labels
    };

    bugService
      .save(bug)
      .then((savedBug) => {
        console.log('Added Bug', savedBug);
        setBugs(prevBugs => [...prevBugs, savedBug]);
        showSuccessMsg('Bug added');
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err);
        showErrorMsg('Cannot add bug');
      });
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

  // if (!bugs || bugs.length) return <h1>No bugs today!! </h1>
  // if (!bugs || bugs.length) return <button onClick={onAddBug}>Add Bug ⛐</button>  


  return (
    <main>
      <h3>Bugs App</h3>
      <BugFilter filterBy={filterBy} onSetFilterBy={onSetFilterBy} />
      <main>
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} isUserDetailsPage={false} />
      </main>
    </main>
  )
}
