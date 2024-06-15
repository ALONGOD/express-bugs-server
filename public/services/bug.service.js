import axios from 'axios'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get('http://127.0.0.1:3030/api/bug')
}
function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}