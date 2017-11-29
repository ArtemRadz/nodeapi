const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  db = require('../db');
	  parseUrlencoded = bodyParser.urlencoded({extended: false});

router.route('/:name')
	.all((req, res, next) => {
		req.name = req.params.name.toLowerCase();
	    req.query = { 'name': req.name };

		next();
	})

	.get((req, res) => {
	    db.get().collection('vegetables').findOne(req.query, (err, item) => {
	      	if (err) {
	        	res.status(503).send({'error':'Error in database'});
	      	} else if(!item) {
	      		res.status(400).send({'error': 'Error in request'});
	      	} else {
	      		res.send(item);
	      	}
	    });
  	})

  	.delete((req, res) => {
    	db.get().collection('vegetables').remove(req.query, (err, item) => {
      		if (err) {
        		res.status(503).send({'error':'Error in database'});
      		} else if(!item.result.n) {
	      		res.status(400).send({'error': 'Error in request or product isn\'t exist'});
	      	} else {
	      		res.send({'message': `Product ${req.name} is deleted`});
	      	}
    	});
  	})

  	.put(parseUrlencoded, (req, res) => {
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

	    db.get().collection('vegetables').update(req.query, vegetable, (err, item) => {
	      	if (err) {
	          	res.status(503).send({'error':'Error in database'});
	      	} else if(!item.result.n) {
				res.status(400).send({'error': 'Error in request or product isn\'t exist'});
	      	} else {
	          	res.send({'message': `Product ${req.name} is updated`});
	      	} 
	    });
  	});

router.route('/')
	.get((req, res) => {
		db.get().collection('vegetables').find({}).toArray((err, item) => {
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

    	db.get().collection('vegetables').insert(vegetable, (err, result) => {
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