const express = require('express')
const routes = require('./routes')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')

const server = express()

server.use(express.urlencoded({ extended: true })) // responsável por mostrar os dados de formulário no req.body
server.use(express.static('public'))
server.use(methodOverride('_method'))
server.use(routes)

server.set('view engine', 'njk')

nunjucks.configure('src/app/views', {
    express: server,
    autoescape: false,
    noCache: true
})

server.listen(5000, function(req, res) {
    console.log("I'm listening")
})
