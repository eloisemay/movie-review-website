// CONST
const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const logger = require('morgan')
const mongoStore = require('connect-mongo')(session)
const port = process.env.PORT || 3000
const app = express()

// CONNEXION A MONGODB
const dbUrl = 'mongodb://localhost/movie'
mongoose.connect(dbUrl)


app.set('view engine', 'jade')
app.set('views', './app/views/pages')
app.use(bodyParser())
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	store: new mongoStore({
		url: dbUrl
	})
}))

if('development' ===  app.get('env')){
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	app.locals.pretty = true
	mongoose.set('debug', true)
}

require('./config/routes')(app)

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')

app.listen(port)

console.log('Start Server')
