var app = angular.module('dbsoria', ['ngAnimate'])
.factory('fruitFactory', function() {
	var dbHandler = new DBHandler();
	dbHandler.setUpDatabase('couchdb');

	var fruitFactory = {};

	fruitFactory.getData = function(callback) {
		return dbHandler.getData(callback);
	};

	fruitFactory.updateData = function(id, data) {
		dbHandler.updateData(id, data);
	};

	fruitFactory.deleteData = function(id, priceids) {
		dbHandler.deleteData(id, priceids);
	};

	fruitFactory.addData = function(data, callback) {
		dbHandler.addData(data, callback);
	}

	return fruitFactory;
})
.controller('bodyCtrl', function($scope, $animate, fruitFactory) {
	$scope.fruitstand = {
		openFruitstand: false,
		selectedFruit: {
			selected: false,
			id: "",
			index: -1
		},
		editing: {
			name: "",
			distributor: "",
			price: "",
			quantity: ""
		},
		addNewFruit: false
	};

	fruitFactory.getData(function(result) {
		$scope.fruitstand.fruits = result;
	});

	$scope.fruitstand.openningFruitstand = function() {
		$scope.fruitstand.openPacket = false;
		$scope.fruitstand.openFruitstand = true;
	};

	$scope.selectFruit = function(id) {
		if($scope.fruitstand.addNewFruit) {
			$scope.fruitstand.addNewFruit = false;
			$scope.fruitstand.viewOther = "";
		}
		$scope.fruitstand.selectedFruit.id = id;
		$scope.fruitstand.selectedFruit.index = $scope.findFruitIndex(id);
		$scope.fruitstand.selectedFruit.selected = true;
		$scope.fruitstand.viewOther = "viewInfo";
	}

	$scope.deselectFruit = function() {
		$scope.fruitstand.selectedFruit.selected = false;
		$scope.fruitstand.viewOther = "";

		$scope.fruitstand.showNameEdit = false;
		$scope.fruitstand.showDistributorEdit = false;
		$scope.fruitstand.showPriceEdit = false;
		$scope.fruitstand.showQuantityEdit = false;
	}

	$scope.submitChanges = function() {
		var submitted = $scope.fruitstand.editing;
		var changes = {};
		var changeCount = 0;

		submitted.id = $scope.fruitstand.selectedFruit.id;
		submitted.dateAdded = $scope.fruitstand.fruits[$scope.fruitstand.selectedFruit.index].dateAdded;

		for(var key in submitted) {
			if(submitted[key] == "" || submitted[key] == $scope.fruitstand.fruits[$scope.fruitstand.selectedFruit.index][key]) {
				submitted[key] = $scope.fruitstand.fruits[$scope.fruitstand.selectedFruit.index][key];
			}
			else changeCount++;
		}

		submitted.priceChanged = false;
		submitted.price = ((submitted.price).indexOf('.') == -1)? submitted.price + ".00" : submitted.price;
		if(submitted.price != $scope.fruitstand.fruits[$scope.fruitstand.selectedFruit.index].price) {
			submitted.priceChanged = true;
			var date = new Date;
			var m = date.getMonth()+1;
			var d = date.getDate();
			var y = date.getFullYear();

			if(m < 10) m = "0" + m;
			if(d < 10) d = "0" + d;

			var curr = m + "-" + d + "-" + y;
			submitted.dateUpdated = curr;
			submitted.priceChanged = true;
		}

		if(changeCount != 0) {
			fruitFactory.updateData($scope.fruitstand.selectedFruit.id, $.extend(true, {}, submitted));
			var index = $scope.fruitstand.selectedFruit.index;
			for (var key in submitted) {
				if(key == 'price' && submitted.priceChanged) {
					$scope.fruitstand.fruits[index].price = submitted.price;
					($scope.fruitstand.fruits[index].priceHistory).push({ price: submitted.price, dateUpdated: submitted.dateUpdated });
				}
				else if (!(key == 'id' || key == 'dateAdded' || key == 'priceChanged' || key == 'dateUpdated')){
					$scope.fruitstand.fruits[index][key] = submitted[key];
				}
			}
		}

		$scope.fruitstand.showNameEdit = false;
		$scope.fruitstand.showDistributorEdit = false;
		$scope.fruitstand.showPriceEdit = false;
		$scope.fruitstand.showQuantityEdit = false;
		$scope.fruitstand.editing = {
			name: "",
			distributor: "",
			price: "",
			quantity: ""
		};
	}

	$scope.findFruitIndex = function(id) {
		for(var i in $scope.fruitstand.fruits) {
			if($scope.fruitstand.fruits[i].id == id) return i;
		}
		return -1;
	}

	$scope.deleteFruit = function() {
		$scope.fruitstand.selectedFruit.selected = false;
		$scope.fruitstand.viewOther = "";

		var index = $scope.fruitstand.selectedFruit.index;
		var removed = $scope.fruitstand.fruits.splice(index, 1);
		var priceids = [];
		for(var i in removed[0].priceHistory) priceids.push(removed[0].priceHistory[i].id);

		fruitFactory.deleteData($scope.fruitstand.selectedFruit.id, priceids);
	}

	$scope.addNew = function() {
		if($scope.fruitstand.selectedFruit.selected) {
			$scope.fruitstand.selectedFruit.selected = false;
			$scope.fruitstand.viewOther = "";
		}
		$scope.fruitstand.addNewFruit = true;
		$scope.fruitstand.viewOther = "viewAdd";
	}

	$scope.cancelAdd = function() {
		$scope.fruitstand.adding = {};
		$scope.fruitstand.addNewFruit = false;
		$scope.fruitstand.viewOther = "";
	}

	$scope.submitAdding = function() {
		$scope.fruitstand.addNewFruit = false;
		$scope.fruitstand.viewOther = "";
		var date = new Date;
		var m = date.getMonth()+1;
		var d = date.getDate();
		var y = date.getFullYear();

		if(m < 10) m = "0" + m;
		if(d < 10) d = "0" + d;

		var curr = m + "-" + d + "-" + y;
		var price = $scope.fruitstand.adding.price;
		$scope.fruitstand.adding.price = ((price).indexOf('.') == -1)? price + ".00" : price;
		$scope.fruitstand.adding.dateAdded = curr;
		$scope.fruitstand.adding.priceHistory = [{
			price: $scope.fruitstand.adding.price,
			dateUpdated: curr
		}];
		fruitFactory.addData($scope.fruitstand.adding, function(newIds) {
			$scope.fruitstand.adding.id = newIds.fruitid;
			$scope.fruitstand.adding.priceHistory[0].id = newIds.priceid
			var newFruit = $.extend(true, {}, $scope.fruitstand.adding);
			console.log(newFruit);
			$scope.fruitstand.fruits.push(newFruit);
			$scope.fruitstand.adding = {};
			$scope.$apply();
		});
	}

	$scope.exitApp = function() {
		
	}
})
.animation('.viewIntro', function() {
	return {
		enter: function(element, done) { done(); },
		leave: function(element, done) { done(); },
		move: function(element, done) { done(); },
		beforeAddClass: function(element, className, done) { 
			if(className == 'open') {
				var openButton = $(element.find('#openButton'));
				var flap = $(openButton.find('#flap'));

				openButton.on('webkitTransitionEnd', function() {
					done();
				});

				flap.one("webkitTransitionEnd", function() {
					openButton.css('background', '#00e676');
					$(this).animate({width: '100px'});
					done();
				});
			}
			else {
				done();
			}
		},
		addClass: function(element, className, done) { 
			if(className == 'open') {
				var introBg = $(element.find("#introBg"));
				var text1 = $(element.find('#text1'));
				var text2 = $(element.find('#text2'));
				var openButton = $(element.find('#openButton'));
				var text3 = $($(this).find("#text3"));

				done();
			}
			else {
				done();
			}
		},
		beforeRemoveClass: function(element, className, done) { done(); },
		removeClass: function(element, className, done) { done(); },
		allowCancel: function(element, className, done) { done(); }
	}
});