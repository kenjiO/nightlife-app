var Yelp = require('yelp');
var Reservation = require('./models/reservation');

exports.getBars = function (req, res, next) {
	if (!res.locals.location) return res.render('index');
	
	yelp().search({term: 'bar', location: res.locals.location})
		.then(function(data) {
			var localBars = data.businesses.map((item) => item.name);

			Reservation.find().where('bar').in(localBars).exec(function(err, rsvps){
				if (err) return next(err);
				var results = [];
			    data.businesses.forEach(function(business){
			    	var newItem = {
			    		name: business.name,
			    		image_url: business.image_url,
			    		peopleGoing: 0,
			    		iAmGoing: false
			    	};
			    	
			    	//Get counts on who is going to this bar
			    	rsvps.forEach(function(rsvp){
			    		if (rsvp.bar === newItem.name) 
			    			newItem.peopleGoing++;
			    		if (rsvp.bar === newItem.name && rsvp.username === res.locals.username)
			    			newItem.iAmGoing = true;
			    	});
			    	
			    	results.push(newItem);
			    });
				
				res.render('index', {'results': results});
			});


			
		    
		})
		.catch(function(err) {
			res.json(err);
		});

};

function yelp() {
	return new Yelp({
		consumer_key: process.env.YELP_CONSUMER_KEY,
		consumer_secret: process.env.YELP_CONSUMER_SECRET,
		token: process.env.YELP_TOKEN,
		token_secret: process.env.YELP_TOKEN_SECRET,
	});
}