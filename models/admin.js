const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		passwordh: { type: String, required: true }
	},
	{ collection: 'admin' }
)

const model = mongoose.model('AdminSchema', AdminSchema)

module.exports = model