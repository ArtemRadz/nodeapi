const express = require('express'),
	  router = express.Router(),
	  bodyParser = require('body-parser'),
	  parseUrlencoded = bodyParser.urlencoded({extended: false});
let db = {};

router.use((req, res, next) => {
	db = req.app.get('db');
	if(db) {
		next();
	}
});

router.route('/:name')
	.get((req, res) => {
	    const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
	    db.collection('vegetables').findOne(query, (err, item) => {
	      	if (err) {
	        	res.send({'error':'An error has occurred'});
	      	} else {
	        	res.send(item);
	      	} 
	    });
  	})

  	.delete((req, res) => {
    	const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
    	db.collection('vegetables').remove(query, (err, item) => {
      		if (err) {
        		res.send({'error':'An error has occurred'});
      		} else {
        		res.send('Vegetable ' + name + ' deleted!');
      		} 
    	});
  	})

  	.put(parseUrlencoded, (req, res) => {
	    const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
	    console.log(query);
	    const vegetable = { name: req.body.name.toLowerCase(), price: parseFloat(req.body.price) };
	    console.log(vegetable);
	    db.collection('vegetables').update(query, vegetable, (err, result) => {
	      	if (err) {
	          	res.send({'error':'An error has occurred'});
	      	} else {
	          	res.send(vegetable);
	      	} 
	    });
  	});

router.route('/')
	.post(parseUrlencoded, (req, res) => {
    	const vegetable = { name: req.body.name.toLowerCase(), price: parseFloat(req.body.price) };
    	db.collection('vegetables').insert(vegetable, (err, result) => {
	      	if (err) { 
	        	res.send({ 'error': 'An error has occurred' }); 
	      	} else {
	        	res.send(result.ops[0]);
	      	}
    	});
  	});

module.exports = router;