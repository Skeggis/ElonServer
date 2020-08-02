require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const ngrok = require('ngrok');


const {
  errorHandler,
  notFoundHandler
} = require('./helpers.js')

const programRouter = require('./routers/programsRouter')
const usersRouter = require('./routers/usersRouter')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/programs', programRouter)
app.use('/users', usersRouter)
app.use(notFoundHandler)
app.use(errorHandler)


const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server started on http://localhost:${port}`))

