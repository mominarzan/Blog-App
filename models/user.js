const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	passwordh: {
		type: String,
		required: true
	}
}, {
	collection: 'users'
})

const model = mongoose.model('UserSchema', UserSchema)

module.exports = model