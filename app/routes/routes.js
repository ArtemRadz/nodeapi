module.exports = function(app, db) {

  	app.get('/vegetables/:name', (req, res) => {
	    const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
	    db.collection('vegetables').findOne(query, (err, item) => {
	      	if (err) {
	        	res.send({'error':'An error has occurred'});
	      	} else {
	        	res.send(item);
	      	} 
	    });
  	});

	app.post('/vegetables', (req, res) => {
    	const vegetable = { name: req.body.name.toLowerCase(), price: parseFloat(req.body.price) };
    	db.collection('vegetables').insert(vegetable, (err, result) => {
	      	if (err) { 
	        	res.send({ 'error': 'An error has occurred' }); 
	      	} else {
	        	res.send(result.ops[0]);
	      	}
    	});
  	});

  	app.delete('/vegetables/:name', (req, res) => {
    	const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
    	db.collection('vegetables').remove(query, (err, item) => {
      		if (err) {
        		res.send({'error':'An error has occurred'});
      		} else {
        		res.send('Vegetable ' + name + ' deleted!');
      		} 
    	});
  	});

  	app.put ('/vegetables/:name', (req, res) => {
	    const name = req.params.name.toLowerCase();
	    const query = { 'name': name };
	    const vegetable = { name: req.body.name.toLowerCase(), price: parseFloat(req.body.price) };
	    db.collection('vegetables').update(query, vegetable, (err, result) => {
	      	if (err) {
	          	res.send({'error':'An error has occurred'});
	      	} else {
	          	res.send(vegetable);
	      	} 
	    });
  	});

};