const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  mongoose = require('../database/mongoose');
	  parseUrlencoded = bodyParser.urlencoded({extended: false}),
	  Schema = mongoose.Schema,
	  Vegetable = new Schema({
		name: { type: String, required: true, index: {unique: true}},
		price: { type: Number, required: true}
	  }),
	  VegetableModel = mongoose.model('vegetables', Vegetable);

router.route('/:name')
	.all((req, res, next) => {
		req.name = req.params.name.toLowerCase();
	    req.query = { 'name': req.name };

		next();
	})

	.get((req, res) => {
	    return VegetableModel.findOne(req.query, (err, item) => {
	      	if (err) {
	        	res.status(503).send({'error':'Error in database'});
	      	} else if(!item) {
	      		res.status(400).send({'error': 'Error in request or product isn\'t exist'});
	      	} else {
	      		res.send(item);
	      	}
	    });
  	})

  	.delete((req, res) => {
    	return VegetableModel.findOne(req.query, (err, vegetable) => {
    		if(!vegetable) {
    			res.status(400).send({'error': 'Error in request or product isn\'t exist'});
    		}
			return vegetable.remove((err) => {
	      		if (err) {
	        		res.status(503).send({'error':'Error in database'});
	      		} else {
		      		res.send({'message': `Product ${req.name} is deleted`});
		      	}
    		});
    	});
  	})

  	.put(parseUrlencoded, (req, res) => {
		let newVegetable = {};
		try {
			const name = req.body.name.toLowerCase(),
				  price = parseFloat(req.body.price);
				  
			if(!name || isNaN(price)) {
				throw Error();
			} else {
				newVegetable = { name, price };
			}
		} catch(e) {
			res.status(400).send({'error': 'Error in request'});
			return;
		}

		return VegetableModel.findOne(req.query, (err, vegetable) => {
    		if(!vegetable) {
    			res.status(400).send({'error': 'Error in request or product isn\'t exist'});
    		}

    		vegetable.name = newVegetable.name;
    		vegetable.price = newVegetable.price;

			return vegetable.save((err) => {
	      		if (err) {
	        		res.status(503).send({'error':'Error in database'});
	      		} else {
		      		res.send({'message': `Product ${req.name} is updated`});
		      	}
    		});
    	});
  	});

router.route('/')
	.get((req, res) => {
		return VegetableModel.find((err, item) => {
			if (err) {
	        	res.status(503).send({'error':'Error in database'});
	      	} else if(!item.length) {
	      		res.send({'message': 'Products list is empty'});
	      	} else {
		        res.send(item);
		    }
		});
	})

	.post(parseUrlencoded, (req, res) => {
		let vegetable = {};
		try {
			const name = req.body.name.toLowerCase(),
				  price = parseFloat(req.body.price);

			if(!name || isNaN(price)) {
				throw Error();
			} else {
				vegetable = { name, price };
			}
		} catch(e) {
			res.status(400).send({'error': 'Error in request'});
			return;
		}

		const newVegetable = new VegetableModel({
			name: vegetable.name,
			price: vegetable.price
		});

    	newVegetable.save((err, result) => {
	      	if (err) {
	      		if(err.errmsg.includes('duplicate')) {
	      			res.status(400).send({'error':'Duplicate name of products'});
	      		} else {
		        	res.status(503).send({'error':'Error in database'});
		        }
	      	} else {
	        	res.status(201).send({'message': 'Product is added'});
	      	}
    	});
  	});

module.exports = router;