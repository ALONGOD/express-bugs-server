import fs from 'fs'
import Cryptr from 'cryptr'
import { utilService } from '../public/services/util.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')
var users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    checkLogin,
    getLoginToken,
    validateToken,
    remove
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    const str = cryptr.decrypt(token)
    const user = JSON.parse(str)
    return user
}

function checkLogin({ username, password }) {
    // Find the user by username
    var user = users.find(user => user.username === username);

    // If user exists and the password matches
    if (user && user.password === password) {
        // Create a new object with the required user details
        const userDetails = {
            _id: user._id,
            fullname: user.fullname,
            isAdmin: user.isAdmin,
        };
        // Return the user details
        return Promise.resolve(userDetails);
    } else {
        // Return null if authentication fails
        return Promise.resolve(null);
    }
}
function query() {
    return Promise.resolve(users)
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) return Promise.reject('User not found!')
    return Promise.resolve(user)
}


function remove(userId) {
    users = users.filter(user => user._id !== userId)
    return _saveUsersToFile()
}

function save(user) {
    user._id = utilService.makeId()
    user.isAdmin = false
    users.push(user)
    return _saveUsersToFile().then(() => user)

}


function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}