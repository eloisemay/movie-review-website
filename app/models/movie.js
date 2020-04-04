const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const MovieSchema = new Schema({
	title : {type: String, required : true},
	category: {type: ObjectId, ref: 'Category', required : true},
	director: {type: String, required : true},
	language: {type: String, required : true},
	country: {type: String, required : true},
	overview: {type: String, required : true},
	poster_path: {type: String, required : true},
	flash: {type: String, required : true},
	meta: {
		createdAt: {type: Date,	default: Date.now()},
		updatedAt: {type: Date,	default: Date.now()}
	}
})

MovieSchema.pre('Sauvegarder', function(next){
	if(this.isNew){
		this.meta.createdAt = this.meta.updatedAt = Date.now()
	}else{
		this.meta.updatedAt = Date.now()
	}

	next()
})

MovieSchema.statics = {
	fetch: function(cb){
		return this
			.find({})
			.sort('meta.updatedAt')
			.exec(cb)
	},
	findById: function(id, cb){
		return this
			.findOne({_id: id})
			.exec(cb)
	}
}

const Movie = mongoose.model('Movie', MovieSchema)

module.exports = Movie