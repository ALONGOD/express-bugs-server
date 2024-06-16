import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

app.use(express.static('public'))
app.use(cookieParser())

// Express Routing:

app.get('/api/bug', (req, res) => {
    const { txt, minSeverity = +minSeverity } = req.query
    bugService.query({ txt, minSeverity })
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`)
            res.status(500).send(`Couldn't get bugs...`)
        })
})




app.get('/api/bug/save', (req, res) => {
    const { _id, description, severity, createdAt, title } = req.query
    const bugToSave = { _id, description, severity: +severity, createdAt: +createdAt, title }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params

    var visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3) res.status(401).send('BUG LIMIT REACHED')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)

    res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })

    bugService.getById(id)
        .then(bug => res.send(bug))
})

app.get('/api/bug/:id/remove', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`Bug ${id} deleted...`))
})

// app.get('/puki', (req, res) => {
//     var visitCount = req.cookies.visitCount || 0
// res.cookie('visitCount', ++visitCount)
//     res.cookie('visitCount', ++visitCount, { maxAge: 3000 })
//     res.send(`<h1>Hello Puki ${visitCount}</h1>`)
// })

// app.get('/nono', (req, res) => res.redirect('/puki'))

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
