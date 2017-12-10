const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  jwtAuthz = require('express-jwt-authz'),
	  checkScopesRead = jwtAuthz([ 'read:products' ]),
	  checkScopesWrite = jwtAuthz([ 'write:products' ]),
	  checkScopesUpdate = jwtAuthz([ 'update:products' ]),
	  checkScopesDelete = jwtAuthz([ 'delete:products' ]),
	  parseUrlencoded = bodyParser.urlencoded({extended: false}),
	  Vegetable = require('../models/vegetable');

router.route('/:name')
	.all((req, res, next) => {
		req.name = req.params.name.toLowerCase();
	    req.query = { 'name': req.name };

		next();
	})

	.get(checkScopesRead, (req, res) => {
	    return Vegetable.findOne(req.query, (err, item) => {
	      	if (err) {
	        	res.status(503).send({'error':'Error in database'});
	      	} else if(!item) {
	      		res.status(400).send({'error': 'Error in request or product isn\'t exist'});
	      	} else {
	      		res.send(item);
	      	}
	    });
  	})

  	.delete(checkScopesDelete, (req, res) => {
    	return Vegetable.findOne(req.query, (err, vegetable) => {
    		if(!vegetable) {
    			res.status(400).send({'error': 'Error in request or product isn\'t exist'});
    			return;
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

  	.put(checkScopesUpdate, parseUrlencoded, (req, res) => {
		let newVegetable = {};
 			name = req.body.name,
			price = req.body.price;
				  
		if(!name || isNaN(price)) {
			res.status(400).send({'error': 'Error in request'});
			return;
		} else {
			name = name.toLowerCase();
			price = parseFloat(price);
			newVegetable = { name, price };
		}

		return Vegetable.findOne(req.query, (err, vegetable) => {
    		if(!vegetable) {
    			res.status(400).send({'error': 'Error in request or product isn\'t exist'});
    			return;
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
	.get(checkScopesRead, (req, res) => {
		return Vegetable.find((err, item) => {
			if (err) {
	        	res.status(503).send({'error':'Error in database'});
	      	} else if(!item.length) {
	      		res.send({'message': 'Products list is empty'});
	      	} else {
		        res.send(item);
		    }
		});
	})

	.post(checkScopesWrite, parseUrlencoded, (req, res) => {
		let vegetable = {},
 			name = req.body.name,
			price = req.body.price;

		if(!name || isNaN(price)) {
			res.status(400).send({'error': 'Error in request'});
			return;
		} else {
			name = name.toLowerCase();
			price = parseFloat(price);
			vegetable = { name, price };
		}

		const newVegetable = new Vegetable({
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