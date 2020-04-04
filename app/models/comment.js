const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new mongoose.Schema({
	movie: {
		type: ObjectId,
		ref: 'Movie'
	},
	from: {
		type: ObjectId,
		ref: 'User'
	},
	reply:[{
		to: { type: ObjectId, ref: 'User' },
		from: { type: ObjectId, ref: 'User' },
		content: String
	}],
	content: String,
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

CommentSchema.pre('save', function(next){
	if(this.isNew){
		this.meta.createdAt = this.meta.updatedAt = Date.now()
	}else{
		this.meta.updatedAt = Date.now()
	}

	next()
})

CommentSchema.statics = {
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

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment