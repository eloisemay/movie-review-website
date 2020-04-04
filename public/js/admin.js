$(function(){
/*
 * Rappel du but raccourci jQuery : $(function()) --> $(document).ready(function() {...})
 * ----------------------
 * "C'est lorsque du JS influe sur les balises HTML. Il faut alors être sûr que les balises existent. 
 * Parfois le JS se charge trop rapidement et le site n'est pas encore affiché quand le JS tente d’accéder 
 * à un élément du HTML (un getElementById() par exemple)."
 * Du coup on utilise des fonctions pour n’exécuter le JS que lorsqu'on est sûrs que le DOM est prêt à être
 * manipulé par le JS.
 * ----------------------
 */
	$('.del').click(function(e){
		var target = $(e.target)
		var id = target.data('id')
		var tr = $('.item-id-' + id)

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/remove/' + id
		})
		.done(function(results){
			if(results.success){
				if(tr.length){
					tr.remove()
				}
			}
		})
	})

	var TMDb_get = function(_url, cb, setting){
		if( setting === undefined ){
			setting = {
				cache: true,
				type: 'get',
				dataType: 'jsonp',
				crossDomain: true,
				jsonp: 'callback'
			}
		}
		$.extend(setting, {url: _url, success: cb})
		$.ajax(setting)
	}

	$('#TMDb').blur(function(){
		var TMDb = $(this)
		var id = TMDb.val() || []
		var api_key = 'cf9193ac58f0ef3a28842c6e99546b4b'
		var api_lang = '&language=fr'
		var poster_path

		if(id){
			// Source API information des films
			var _url = 'https://api.themoviedb.org/3/movie/' + id + '?api_key=' + api_key + api_lang
			
			// Récupération des informations des films
			TMDb_get(_url, function(data){
				$('#inputTitle').val(data.title)
				$('#inputGenre').val(data.genres[0].name)
				$('#inputLanguage').val(data.spoken_languages[0].name)
				//$('#inputDirector').val(data.directors[0].name)
				$('#inputCountry').val(data.production_countries[0].name)
				$('#inputOverview').val(data.overview)
				poster_path = data.poster_path
			})

			_url = 'https://api.themoviedb.org/3/configuration?api_key=' + api_key

			TMDb_get(_url, function(data){
				$('#inputPoster').val(data.images.base_url + data.images.poster_sizes[3] + poster_path)
			})

			_url = 'https://api.themoviedb.org/3/movie/' + id + '/videos?api_key=' + api_key + api_lang

			TMDb_get(_url, function(data){
				$('#inputVideo').val('https://www.youtube.com/embed/' + data.results[0].key)
			})			
		}
	})
})