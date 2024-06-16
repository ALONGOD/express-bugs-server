// import axios from 'axios'
const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getEmptyFilter
}



function query(filterBy) {
    const { txt, minSeverity } = filterBy
    return axios.get(`${BASE_URL}?minSeverity=${minSeverity}&txt=${txt}`).then(res => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`)
        .then(res => res.data)
        .catch(console.log)
}
function remove(bugId) {
    return axios.get(BASE_URL + `/${bugId}/remove`).then(res => res.data)
}
function save(bug) {
    const { description, severity, createdAt, title } = bug
    if (bug._id !== undefined) {
        return axios.get(BASE_URL + `/save?_id=${bug._id}&description=${description}&severity=${severity}&title=${title}`).then(res => res.data)
    } else {
        return axios.get(BASE_URL + `/save?description=${description}&severity=${severity}&title=${title}`).then(res => res.data)
    }
}

function getEmptyFilter() {
    return { txt: '', minSeverity: 1 }
}