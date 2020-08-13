// Server
const express = require('express')
const server = express()

const { pageLanding, pageStudy, pageGiveClasses, saveClasses, pageSuccess } = require('./pages')

// Nunjucks configuration (templates engine)
const nunjucks = require('nunjucks')
nunjucks.configure('src/views', {
    express: server,
    noCache: true
})

// Server startup and configuration
server
// Receive request.body data
.use(express.urlencoded({ extended: true }))
// Static files configuration (css, scripts, imagens)
.use(express.static("public"))
// Application routes
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)
.get("/success", pageSuccess)
// Start server
.listen(5500)