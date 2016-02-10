describe("Preferences Service Test Suite", function (){
	var preferencesService, httpMock;
	// module
	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		// inject Service
		inject(function ($httpBackend, PreferencesService){
			preferencesService = PreferencesService;
			httpMock = $httpBackend;
		});
	});


	// Initialization tests
	describe("Initialization Tests", function (){

		// check if the method togglePreferences is available the service
		it('preferencesService should have a togglePreferences method', function () {
			expect(angular.isFunction(preferencesService.togglePreferences)).toBe(true);
		});

		// check if the method updateUserPreferences is available the service
		it('preferencesService should have a updateUserPreferences method', function () {
			expect(angular.isFunction(preferencesService.updateUserPreferences)).toBe(true);
		});

		// check if the method fetchCategories is available the service
		it('preferencesService should have a fetchCategories method', function () {
			expect(angular.isFunction(preferencesService.fetchCategories)).toBe(true);
		});
	});

	// updateUserPreferences tests
	describe("Update User Preferences Test", function (){
		var userInDB = {
			_id : "1273612873612893",
			email : "admin@gmail.com",
			password : "admin",
			preferences : {
				searchRadius : null,
				modeOfTransport : [],
				subCategories : []
			}
		};

		// if user to update is null updateUserPreferences should return null
		it("updateUserPreferences should return null if user to update input is null or undefined", function (){
			var output = preferencesService.updateUserPreferences();

			expect(output).toBe(null);
		});

		// if user to update is not null, updated user should be returned
		it("updateUserPreferences should return the updated user", function (){
			userInDB.preferences.searchRadius = 5;
			userInDB.preferences.modeOfTransport = ["WALKING"];
			userInDB.preferences.subCategories = ["8001"];

			var userAfterUpdateExpected = {
				_id : "1273612873612893",
				email : "admin@gmail.com",
				password : "admin",
				preferences : {
					searchRadius : 5,
					modeOfTransport : ["WALKING"],
					subCategories : ["8001"]
				}
			}

			httpMock.expectPUT('/updatePreferences/' + userInDB._id, userInDB).respond(userInDB);

			var responsePromise = preferencesService.updateUserPreferences(userInDB);

			var response;
			responsePromise.then(function (serviceRes){
				response = serviceRes;
			});

			httpMock.flush();

			expect(response.status).toEqual(200);

			expect(response.data).toEqual(userAfterUpdateExpected);
		});


		//update preferences error scenario
		it("updateUserPreferences should return error promise if the call to server failed", function(){
			userInDB.preferences.searchRadius = 5;
			userInDB.preferences.modeOfTransport = ["WALKING"];
			userInDB.preferences.subCategories = ["8001"];

			var mockAPIJSONBadResponse	= {
				"status": "Service Unavailable"
			};

			httpMock.expectPUT('/updatePreferences/' + userInDB._id, userInDB)
				.respond(503, mockAPIJSONBadResponse);

			var errorResponse = preferencesService.updateUserPreferences(userInDB);
			
			var actualErrorResponse;

			errorResponse
				.then(function (response){
				
				},
				function (error){
					actualErrorResponse = error;
				});
			
			httpMock.flush();

			expect(actualErrorResponse.status).toEqual(503);

			expect(actualErrorResponse.data).toEqual(mockAPIJSONBadResponse);
		});
	});

	// fetch categories test
	describe("Fetch Categories Test", function (){

		var categoriesInDB = {
			categoryName : "Sports & Fitness",
			categoryId : "108",
			subCategories : [{
				subCategoryName : "Running",
				subCategoryId : "8001"
			}]
		};

		// fetch categories should return the categories in DB
		it ("fetchCategories should return the categories in DB if there are no server errors", function (){

			httpMock.expectGET('/categories').respond(categoriesInDB);

			var responsePromise = preferencesService.fetchCategories();

			var response;
			responsePromise.then(function (responseData){
				response = responseData;
			});

			httpMock.flush();

			expect(response.status).toEqual(200);

			expect(response.data).toEqual(categoriesInDB);
			
		});


		// fetch category returns error
		it("fetchCategories should return an error promise if there is a problem in fetching Categories from DB", function (){
			var mockAPIJSONBadResponse	= {
				"status": "Service Unavailable"
			};

			httpMock.expectGET('/categories')
				.respond(503, mockAPIJSONBadResponse);

			var errorResponse = preferencesService.fetchCategories();
			
			var actualErrorResponse;

			errorResponse
				.then(function (response){
				
				},
				function (error){
					actualErrorResponse = error;
				});
			
			httpMock.flush();

			expect(actualErrorResponse.status).toEqual(503);

			expect(actualErrorResponse.data).toEqual(mockAPIJSONBadResponse);
		});
	});
});