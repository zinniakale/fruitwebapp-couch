function DBHandler() {
	this.define = {};
}

DBHandler.prototype = {
	setUpDatabase: function(dbms, credentials) {
		switch(dbms) {
			case 'mysql':
				this.define.dbms = 'mysql';
				break;
			case 'mongodb':
				this.define.dbms = 'mongodb';
				break;
			case 'couchdb':
				this.define.dbms = 'couchdb';
				break;
		}
	},

	getData: function() {
		var fruits = [
			{
				id: 0,
				name: "Apple",
				distributor: "Distributor A",
				quantity: 5,
				price: "10.00",
				dateAdded : "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 1,
				name: "Banana",
				distributor: "Distributor B",
				quantity: 5,
				price: "20.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 2,
				name: "Mango",
				distributor: "Distributor C",
				quantity: 5,
				price: "30.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 3,
				name: "Watermelon",
				distributor: "Distributor D",
				quantity: 5,
				price: "40.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 4,
				name: "Pomelo",
				distributor: "Distributor E",
				quantity: 5,
				price: "50.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 5,
				name: "Apple",
				distributor: "Distributor F",
				quantity: 5,
				price: "10.00",
				dateAdded : "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 6,
				name: "Banana",
				distributor: "Distributor G",
				quantity: 5,
				price: "20.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 7,
				name: "Mango",
				distributor: "Distributor H",
				quantity: 5,
				price: "30.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 8,
				name: "Watermelon",
				distributor: "Distributor I",
				quantity: 5,
				price: "40.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			},
			{
				id: 9,
				name: "Pomelo",
				distributor: "Distributor J",
				quantity: 5,
				price: "50.00",
				dateAdded: "04-28-2015",
				priceHistory: [
					{
						amount: "10.00",
						dateUpdated: "04-26-2015"
					},
					{
						amount: "20.00",
						dateUpdated: "04-27-2015"
					},
					{
						amount: "30.00",
						dateUpdated: "04-27-2015"
					}
				]
			}
		];

		return fruits;
	},
	updateData: function(id, data) {
		console.log("Received update data");
		console.log(id);
		console.log(data);
	},
	deleteData: function(id) {

	},
	addData: function(data, callback) {
		console.log(data);
		callback(100);
	}
}