// import axios from 'axios'
const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return axios.get(BASE_URL).then(res => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`).then(res => res.data)
}
function remove(bugId) {
    return axios.get(BASE_URL + `/${bugId}/remove`).then(res => res.data)
}
function save(bug) {
    const { description, severity, createdAt, title } = bug
    if (!bug._id) {
        return axios.get(BASE_URL + `/${bug._id}/save?_id=${id}&description=${description}&severity=${severity}&createdAt=${createdAt}&title=${title}`).then(res => res.data)
    } else {
        return axios.get(BASE_URL + `/save?description=${description}&severity=${severity}&createdAt=${createdAt}&title=${title}`).then(res => res.data)
    }
}