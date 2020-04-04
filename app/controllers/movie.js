const Movie = require('../models/movie')
const Comment = require('../models/comment')
const Category = require('../models/category')
const _ = require('underscore')

// Page détails
exports.detail = function(req, res){
	const id = req.params.id

	Movie.findById(id, function(err, movie){
		if(err){
			console.log(err)
		}

		Comment
			.find({movie: id})
			.populate('from', 'name')
			.populate('reply.from reply.to', 'name')
			.exec(function(err, comment){
				res.render('detail', {
					// Erreur 'title' undefined
					title: "Commentaires",
					movie: movie,
					comments: comment
				})
			})
	})
}

// Page 'création de film' et requête
exports.new = function(req, res){
	Category.find({}, function(err, categories){
		res.render('admin', {
			title: 'Gérer les films',
			categories: categories,
			movie: {}		
		})
	})
}

// Mise à jour de la page 'movie'
exports.update = function(req, res){
	const id = req.params.id

	if (id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}
				
			Category.find({}, function(err,categories){
				res.render('admin', {
					title: 'Informations de mise à jour du film',
					movie: movie,
					categories: categories
				})
			})
		})
	}
}

exports.save = function(req, res){
	const id = req.body.movie._id
	const movieObj = req.body.movie
	var _movie

	if(id){
		Movie.findById(id, function(err, movie){
			if(err){
				console.log(err)
			}

			_movie = _.extend(movie, movieObj)
			_movie.save(function(err, movie){
				if(err){
					console.log(err)
				}

				res.redirect('/movie/' + movie._id)
			})
		})
	}else{
		_movie = new Movie(movieObj)

		const categoryId = movieObj.category
		const categoryName = movieObj.categoryName

		_movie.save(function(err, movie){
			if(err){
				console.log(err)
			}

			if(categoryId){
				Category.findById(categoryId, function(err, category){
					category.movies.push(movie._id)

					category.save(function(err, category){
						res.redirect('/movie/' + movie._id)
					})
				})
			}
			else if(categoryName){
				const category = new Category({
					name: categoryName,
					movies: [movie._id]
				})

				category.save(function(err, category){
					movie.category = category._id
					movie.save(function(err, movie){
						res.redirect('/movie/' + movie._id)
					})
				})
			}
		})
	}
}

// Liste des films
exports.list = function(req, res){
	Movie.fetch(function(err, movie){
		if(err){
			console.log(err)
		}

		res.render('Listes', {
			title: 'Accueil',
			movies: movie
		})
	})
}

// Supprimer un film
exports.del = function(req, res){
	const id = req.params.id

	if(id){
		Movie.remove({_id: id}, function(err, movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success: 1})
			}
		})
	}
}