const mongoose = require('../libs/mongoose'),
	  Schema = mongoose.Schema;

const Vegetable = new Schema({
	name: { 
		type: String, 
		unique: true,
		required: true 
	},
	price: { 
		type: Number, 
		required: true
	}
});

const VegetableModel = mongoose.model('Vegetable', Vegetable);

module.exports = VegetableModel;