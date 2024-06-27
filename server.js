import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'path'

import { bugService } from './services/bug.service.js'
import { userService } from './services/user.service.js'

import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())









// Express Routing:
app.get('/api/bug', (req, res) => {
    const { txt, minSeverity = 0, pageIdx = 0, sortBy = 'createdAt', sortDir = 'asc' } = req.query;

    const filterBy = {
        txt: txt || '',
        minSeverity: +minSeverity,
        pageIdx: +pageIdx,
        sortBy: sortBy,
        sortDir: sortDir
    };



    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs: ${err.message}`);
            res.status(500).send(`Couldn't get bugs: ${err.message}`);
        });
});

app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params

    var visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3) res.status(401).send('BUG LIMIT REACHED')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

    bugService.getById(id)
        .then(bug => res.send(bug))
})


app.delete('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const { id } = req.params

    bugService.remove(id, loggedinUser)
        .then(() => res.send(`Bug ${id} deleted...`))
})





app.put('/api/bug/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot update bug')

    const { _id, description, severity, createdAt, title } = req.body
    const bugToSave = { _id, description, severity: +severity, createdAt: +createdAt, title }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
})
app.post('/api/bug/', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')

    const { description, severity, createdAt, title, labels } = req.body
    const bugToSave = { description, severity: +severity, createdAt: +createdAt, title, labels }

    bugService.save(bugToSave, loggedinUser)
        .then(savedBug => res.send(savedBug))
})

// AUTH API
app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})










app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})

app.delete('/api/user/:id', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove bug')
    const { id } = req.params

    userService.remove(id)
        .then(() => res.send(`User ${id} deleted...`))
})






app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.save(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(400).send('Cannot signup')
            }
        })
})



app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged-out!')
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})


const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
