function DBHandler() {
	this.define = {};
}

DBHandler.prototype = {
	setUpDatabase: function(dbms) {
		switch(dbms) {
			case 'mysql':
				this.define.dbms = 'mysql';
				this.define.serverUrl = 'http://localhost/cmsc191_exer6/mysql/index.php';
				break;
			case 'mongodb':
				this.define.dbms = 'mongodb';
				this.define.serverUrl = 'http://localhost/cmsc191_exer6/mongodb/index.php';
				break;
			case 'couchdb':
				this.define.dbms = 'couchdb';
				this.define.serverUrl = 'http://localhost/cmsc191_exer6/couchdb/index.php';
				break;
		}
	},
	getData: function(callback) {
		switch(this.define.dbms) {
			case 'mysql':

				break;
			case 'mongodb':
				break;
			case 'couchdb':
				$.ajax({
					url: this.define.serverUrl,
					type: 'POST',
					data: {
						func: 'getData'
					},
					success: function(data) {
						var result = JSON.parse(data);
						callback(result);
					}
				});
				break;
		}	
	},
	updateData: function(id, data, callback) {
		switch(this.define.dbms) {
			case 'mysql':

				break;
			case 'mongodb':
				break;
			case 'couchdb':
				data.price = Number.parseFloat(data.price);
				data.quantity = Number.parseInt(data.quantity);
				$.ajax({
					url: this.define.serverUrl,
					type: 'POST',
					data: {
						func: 'updateData',
						data: JSON.stringify(data)
					},
					success: function(data) {
						var result = JSON.parse(data);
						if(data) callback(data);
					}
				});
				break;
		}		
	},
	deleteData: function(id, priceids) {
		switch(this.define.dbms) {
			case 'mysql':

				break;
			case 'mongodb':
				break;
			case 'couchdb':
				var deleting = {
					id: id,
					priceids: priceids
				};

				$.ajax({
					url: this.define.serverUrl,
					type: 'POST',
					data: {
						func: 'deleteData',
						data: JSON.stringify(deleting)
					},
					success: function(data) {
						console.log(data);
					}
				})
				break;
		}	
	},
	addData: function(add, callback) {
		switch(this.define.dbms) {
			case 'mysql':

				break;
			case 'mongodb':
				break;
			case 'couchdb':
				var price = Number.parseFloat(add.price);
				var quantity = Number.parseInt(add.quantity);
				var data = {
					name: add.name,
					distributor: add.distributor,
					price: price,
					quantity: quantity,
					dateAdded: add.dateAdded,
					priceHistory: {
						price: price,
						dateUpdated: add.priceHistory[0].dateUpdated
					}
				};

				$.ajax({
					url: this.define.serverUrl,
					type: 'POST',
					data: {
						func: "addData",
						data: JSON.stringify(data)
					},
					success: function(data) {
						var result = JSON.parse(data);
						callback(result);
					}
				});
				break;
		}	
	}
}