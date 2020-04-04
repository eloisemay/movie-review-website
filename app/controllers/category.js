var Category = require('../models/category')
var _ = require('underscore')

// Catégorie de rendu
exports.new = function(req, res){
	res.render('category_admin', {
		title: 'Gestion des catégories',
		movies: genres[1]
	})
}

// Enregistrer une catégorie
exports.save = function(req, res){
	var _category = req.body.categories

	var	category = new Category(_category)

	category.save(function(err, category){
		if(err){
			console.log(err)
		}

		res.redirect('/admin/category/list')
	})
}

// Liste des catégories
exports.list = function(req, res){
	Category.fetch(function(err, categories){
		if(err){
			console.log(err)
		}

		res.render('categorylist', {
			title: 'Accueil',
			movies: genres.movie
		})
	})
}
