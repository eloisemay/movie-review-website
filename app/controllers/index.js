var Movie = require('../models/movie')
var Category = require('../models/category')

// Page d'accueil
exports.index = function(req, res){
	Category
		.find({})
		.populate({path: 'movies', options: {limit: 5}})
		.exec(function(err, categories){

			if(err){
				console.log(err)
			}

			console.log(categories[0])

			res.render('index', {
				title: 'Accueil',
				categories: categories
			})

	})
}

// Page de résultats
exports.search = function(req, res){
	var catId = req.query.cat
	var q = req.query.q
	var page = parseInt(req.query.p)
	var displayAmount = 2
	var index = page * displayAmount

	if(catId){

		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				select: 'Titre de l\'affiche',
				options: {limit: displayAmount, skip: index}
			})
			.exec(function(err, categories){

				if(err){
					console.log(err)
				}

				var category = categories[0] || []
				var movies = category.movies || []

				res.render('results', {
					title: 'Page de résultats',
					keyword: category.name,
					movies: results
				})
		})

	}else{
		Movie
			.find({title: new RegExp(q+'.*', 'i')})
			.exec(function(err, movies){
				if (err)
					console.log(err)
				
				// var movies = category.movies || []

				res.render('results', {
					title: 'Page de résultats',
					keyword: q,
					movies: movies
				})
			})
	}
}