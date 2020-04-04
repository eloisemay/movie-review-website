var User = require('../models/user')

exports.showSignUp = function(req, res){
	res.render('signup', {
		title: 'Page d\'inscription'
	})
}

exports.showSignIn = function(req, res){
	res.render('signin', {
		title: 'Page de connexion'
	})
}

//sign up
exports.signup =  function(req, res){
	var _user = req.body.user
	console.log(_user);

	User.findByName(_user.name, function(err, user){
		if(err){
			console.log("Erreur en trouvant le nom utilisateur : "+err)
		}

		if(user){
			console.log('Cet utilisateur existe déjà dans notre base.')
			res.redirect('/signup')
		}
		else{
			var user = new User(_user)
			
			user.save(function(err, user){
				if(err)
					console.log(err)

				res.redirect('/')
			} )
		}
	})

}

//sign in
exports.signin = function(req, res){
	let _user = req.body.user
	let name = _user.name
	let password = _user.password

	User.findByName(name, function(err, user){
		if(err)
			console.log(err)

		if(!user){
			console.log("Cet utilsateur n'existe pas dans notre base.");
			res.redirect('/signup')
		}

		user.comparePassword(password, function(err, isMatched){
			if(err)
				console.log(err)

			if(isMatched){
				console.log("Connecté avec succès !");
				req.session.user = user
				res.redirect('/')
			}else{
				console.log("Mauvais mot de passe")
				res.redirect('/signin')
			}
		})
	})	
}

//sign out 
exports.logout = function(req, res){
	delete req.session.user
	// delete app.locals.user
	res.redirect('/')
}

//user list
exports.list = function(req, res){
	User.fetch(function(err, users){
		if(err){
			console.log(err)
		}

		// console.log(users);
		res.render('userlist', {
			title: 'Liste des utilisateurs',
			users: users
		})
	})
}

exports.signinRequired = function(req, res, next){
	var user = req.session.user

	if(!user){
		res.redirect('/signin')
	}

	next()
}

exports.adminRequired = function(req, res, next){
	var user = req.session.user

	if(user.role <= 10){
		res.redirect('/signin')
	}

	next()
}