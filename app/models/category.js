const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CategorySchema = new Schema({
	name: String,
	movies: [{ type: ObjectId, ref: 'Movie'}],
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}
})

CategorySchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createdAt = this.meta.updatedAt = Date.now()
	}else{
		this.meta.updatedAt = Date.now()
	}

	next()
})

CategorySchema.statics = {
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

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category