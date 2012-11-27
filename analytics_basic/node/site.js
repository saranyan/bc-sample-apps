exports.index = function(req, res){
  res.render('index', { title: 'BigCommerce Node App' });
};

exports.dashboard = function(req,res){
	var brands, customers, orders;
	
	var dates = [];
	var amount = [];
	var demographics = [];
	var percentage = [];
	request(url + "orders.json", function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    orders = JSON.parse(body); // get the data.
	    //get order amount details
	    //console.log(orders);
	     for(var i = 0; i < orders.length; i++){
	     	dates.push(orders[i]["date_created"]);
	     	amount.push(Number(orders[i]["subtotal_inc_tax"]));
	     }
	     for(var i = 0; i < orders.length; i++){
	     	demographics.push(orders[i]["billing_address"]["state"]);
	     }
	     
	    //count frequencies
	    var a = [], b = [], prev;
	    var pie = []
	    demographics.sort();
	    for ( var i = 0; i < demographics.length; i++ ) {
	        if ( demographics[i] !== prev ) {
	            a.push(demographics[i]);
	            b.push(1);
	        } else {
	            b[b.length-1]++;
	        }
	        prev = demographics[i];
	    }
	    for( i in a){
	    	pie.push([a[i],b[i]]);
	    }
	    io.sockets.emit('orders', {
     	 orders: orders, dates : JSON.stringify(dates), amount: amount.slice(0,9),
     	 demographics: pie
    	});
    	
	  }
	  else {
	  	console.log('error in orders');
	  }
	});

	// request(url + "customers.json", function (error, response, body) {
	//   if (!error && response.statusCode == 200) {
	//     customers = JSON.parse(body); // get the data.
	    
	//     io.sockets.emit('customers', {
 //     	 demographics: demographics

 //    	});
    	
	//   }
	//   else {
	//   	console.log('error in customers');
	//   }
	// });

	res.render('dashboard', { title: 'Store analytics' });

}