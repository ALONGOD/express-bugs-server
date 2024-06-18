import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save
}

const PAGE_SIZE = 2
var bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy = { txt: '', minSeverity: 1, pageIdx: 0 }) {
    const { txt, minSeverity, pageIdx } = filterBy
    const regExp = new RegExp(txt, 'i')
    var filteredBugs = bugs.filter(bug => (regExp.test(bug.title) || regExp.test(bug.description)) || bug.labels.some(label => regExp.test(label)) && bug.severity >= minSeverity)

    const startIdx = pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)

    return Promise.resolve(filteredBugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave) {
    if (bugToSave._id) {
        if (bugToSave.createdAt === undefined) bugToSave.createdAt = Date.now()
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
    } else {
        bugToSave.createdAt = Date.now()
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}
