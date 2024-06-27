import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 5
var bugs = utilService.readJsonFile('./data/bug.json')


function query(filterBy = { txt: '', minSeverity: 1, sortBy: 'createdAt', sortDir: 'asc', pageIdx: 0 }) {
    const { txt, minSeverity, sortBy, sortDir, pageIdx } = filterBy;
    const regExp = new RegExp(txt, 'i');

    let filteredBugs = bugs.filter(bug => (regExp.test(bug.title) || regExp.test(bug.description)) && bug.severity >= minSeverity);

    // Sorting
    filteredBugs.sort((bug1, bug2) => {
        let comparison = 0;
        if (bug1[sortBy] < bug2[sortBy]) {
            comparison = -1;
        } else if (bug1[sortBy] > bug2[sortBy]) {
            comparison = 1;
        }
        return sortDir === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const startIdx = pageIdx * PAGE_SIZE;
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE);

    return Promise.resolve(filteredBugs);
}
function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    if (idx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[idx]
    if (!loggedinUser.isAdmin && bug.creator._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }
    bugs.splice(idx, 1)
    return _saveBugsToFile()
}
function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const bugToUpdate = bugs.find(bug => bug._id === bugToSave._id)
        if (!loggedinUser.isAdmin && bugToUpdate.creator._id !== loggedinUser._id) {
            return Promise.reject('Not your bug')
        }
        if (bugToSave.createdAt === undefined) bugToSave.createdAt = Date.now()
        bugs.splice(bugs.indexOf(bugToUpdate), 1, bugToSave)
    } else {
        bugToSave.createdAt = Date.now()
        bugToSave._id = utilService.makeId()
        bugToSave.creator = loggedinUser
        bugs.push(bugToSave)
    }
    return _saveBugsToFile().then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}
