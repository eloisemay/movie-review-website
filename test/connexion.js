/*
 * TEST DE CONNEXION A LA BASE DE DONNEES MONGODB
 */

// Const
const mongoose = require('mongoose')
const dbUrl = 'mongodb://localhost/movie'

// Connexion à la base movie MongoDb
mongoose.connect(dbUrl)

// Gestion du test de la connexion à la base MongoDB
mongoose.connection.once('open', function () {
	console.log('Connexion à la base : succès...')
}).on('error', function(error){
	console.log('Connexion à la base : échec...', error)
})
// 31-03-2020 : test lancé = succès