describe("OutdoorsyHomePageController Tests", function(){

	var $rootScope, $location, $scope, controller, mapsService;

	beforeEach(function(){

		// instantiate module
		module('OutdoorsyApp');

		module(function($provide){
			// Fake StoreService Implementation returning a promise
			$provide.value('MapsService', {
				getFormattedAddress: function() {
					return { 
						then: function(callback) {return callback('My Fake Address Returned Here');}
					};
				}
			});
		});

		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$location = $injector.get('$location');
			mapsService = $injector.get('MapsService');
			controller = $injector.get('$controller')("OutdoorsyHomePageController", {$scope: $scope, 
													 								  $location: $location, 
													 								  MapsService: mapsService});

			$location.path('/home');
		});
	});


	describe("Initialization", function(){
		it("Default latitude should be set to \'42.338666\' when controller is initialized", function(){
			expect($scope.defaultUserLatitude).toEqual('42.338666');
		});

		it("Default longitude should be set to \'-71.092241\' when controller is initialized", function(){
			expect($scope.defaultUserLongitude).toEqual('-71.092241');
		});

		it("Default postal address should be set to \'440 Huntington Avenue Boston MA\' when controller is initialized", function(){
			expect($scope.defaultPostalAddress).toEqual('440 Huntington Avenue Boston MA');
		});
	});

	//-------------------------------goToMapsUI Tests-----------------------------//
	describe("goToMapsUI Tests", function(){
		it("goToMapsUI method should route from home to maps view", function(){
			//check if location is initially set to /home
			expect($location.path()).toEqual('/home');

			$scope.goToMapsUI();

			//check if location is changed to /maps
			expect($location.path()).toEqual('/maps');
		});
	});

	//-------------------------------getUserLocation Tests-----------------------------//
	describe("getUserLocation Tests", function(){

		it("User Postal Address and User Location Co-ordinates in rootScope should be undefined initially", function(){
			// initially expect user coordinates and postal address to be undefined in rootScope
			expect($rootScope.userLatitude).not.toBeDefined();
			expect($rootScope.userLongitude).not.toBeDefined();
			expect($rootScope.userPostalAddress).not.toBeDefined();
		});


		it("getUserLocation should set Postal Address and User coordinates if user allows to share his location",function(){

			// spy on navigator.geolocation and call fake 
			spyOn(navigator.geolocation,"getCurrentPosition").and.callFake(function() {
				var position = { coords: { latitude: 42.338666, longitude: -71.092241 } };
				arguments[0](position);
			});

			// since we have mapsService Stubbed out, directly call through
			spyOn(mapsService, 'getFormattedAddress').and.callThrough();

			// call getUserLocation function
			$scope.getUserLocation();

			//check user latitude and longitude are same as that returned from our spy navigator
			expect($rootScope.userLatitude).toEqual(42.338666);
			expect($rootScope.userLongitude).toEqual(-71.092241);

			//check if formatted user postal address is same as that returned by our fake mapsService
			expect($rootScope.userPostalAddress).toEqual('My Fake Address Returned Here');
		});
	});
});