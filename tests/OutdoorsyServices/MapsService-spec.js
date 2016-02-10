describe("MapsService Test Suite", function(){
	var mapsService;
	var httpMock;

	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		// inject Service
		inject(function ($httpBackend, MapsService){
			mapsService = MapsService;
			httpMock = $httpBackend;
		});
	});

	// make sure no expectations were missed in your tests.
	afterEach(function() {
		httpMock.verifyNoOutstandingExpectation();
		httpMock.verifyNoOutstandingRequest();
	});


	// Tests For The Response JSON Data From The MapsService
	describe("MapsService Test Suite for methods", function(){
	
		// check if all methods we defined in the service are available
		it('MapsService should have a getFormattedAddress method', function () {
			expect(angular.isFunction(mapsService.getFormattedAddress)).toBe(true);
		});

		it('MapsService should have a getReverseAddress method', function () {
			expect(angular.isFunction(mapsService.getReverseAddress)).toBe(true);
		});

		it('MapsService should have a getInfoWindow method', function () {
			expect(angular.isFunction(mapsService.getInfoWindow)).toBe(true);
		});

		it('MapsService should have a getMap method', function () {
			expect(angular.isFunction(mapsService.getMap)).toBe(true);
		});

		it('MapsService should have a plotUserLocation method', function () {
			expect(angular.isFunction(mapsService.plotUserLocation)).toBe(true);
		});


		// getFormattedAddress test should return the correspoding formatted_address for the input latitude and longitude
		it('MapsService getFormattedAddress method should return the correspoding formatted_address for the inputted latitude and longitude', function(){
			var expectedFormattedAddress = "440 Huntington Ave, Boston, MA 02115, USA";
			var mockAPIJSONResponse	= {
				"results":[
					{
						"formatted_address": "440 Huntington Ave, Boston, MA 02115, USA",
						"place_id": "ChIJX3Ie-yF644kRxY-Kmq900mc"
					}
				],
				"status": "OK"
			};

			var userLatitude = "42.338666";
			var userLongitude = "-71.092241";
			var geocodeAPIBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
			var geocodeAPIURL = geocodeAPIBaseURL + userLatitude + "," + userLongitude;
			httpMock.expectGET(geocodeAPIURL)
				.respond(mockAPIJSONResponse);

			var formattedAddress = mapsService.getFormattedAddress(userLatitude, userLongitude);
			var actualFormattedAddress;
			formattedAddress.then(function(response){
				actualFormattedAddress = response;
			});

			httpMock.flush();

			expect(actualFormattedAddress).toEqual(expectedFormattedAddress);
		}); // End of getFormattedAddress test should return the correspoding formatted_address for the input latitude and longitude

		
		// getReverseAddress test should return the correspoding formatted_address for the input latitude and longitude
		it('MapsService getReverseAddress method should return the correspoding latitude and longitude for input', function(){
			var exectedLocation = 	{
											"lat": 42.3600825,
											"lng": -71.0588801
									};
			var mockAPIJSONResponse	= {
									   "results" : [
									      {
									         "address_components" : [
									            {
									               "long_name" : "Boston",
									               "short_name" : "Boston",
									               "types" : [ "locality", "political" ]
									            },
									            {
									               "long_name" : "Suffolk County",
									               "short_name" : "Suffolk County",
									               "types" : [ "administrative_area_level_2", "political" ]
									            },
									            {
									               "long_name" : "Massachusetts",
									               "short_name" : "MA",
									               "types" : [ "administrative_area_level_1", "political" ]
									            },
									            {
									               "long_name" : "United States",
									               "short_name" : "US",
									               "types" : [ "country", "political" ]
									            }
									         ],
									         "formatted_address" : "Boston, MA, USA",
									         "geometry" : {
									            "bounds" : {
									               "northeast" : {
									                  "lat" : 42.3988669,
									                  "lng" : -70.9232011
									               },
									               "southwest" : {
									                  "lat" : 42.22788,
									                  "lng" : -71.191113
									               }
									            },
									            "location" : {
									               "lat" : 42.3600825,
									               "lng" : -71.0588801
									            },
									            "location_type" : "APPROXIMATE",
									            "viewport" : {
									               "northeast" : {
									                  "lat" : 42.3988669,
									                  "lng" : -70.9232011
									               },
									               "southwest" : {
									                  "lat" : 42.22788,
									                  "lng" : -71.191113
									               }
									            }
									         },
									         "place_id" : "ChIJGzE9DS1l44kRoOhiASS_fHg",
									         "types" : [ "locality", "political" ]
									      }
									   ],
									   "status" : "OK"
									};

			var place = "Boston,MA"
			var geocodeAPIBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
			var geocodeAPIURL = geocodeAPIBaseURL + place;
			httpMock.expectGET(geocodeAPIURL)
				.respond(mockAPIJSONResponse);

			var formattedAddress = mapsService.getReverseAddress(place);
			var actualFormattedAddress;
			formattedAddress.then(function(response){
				actualFormattedAddress = response;
			});

			httpMock.flush();

			expect(actualFormattedAddress).toEqual(exectedLocation);
		}); // End of getReverseAddress test should return the correspoding formatted_address for the input latitude and longitude


		// MapsService method should handle the error responses gracefully
		it('MapsService getFormattedAddress method should handle the error responses gracefully', function(){
			
			var mockAPIJSONBadResponse	= {
				"status": "Service Unavailable"
			};
			var expectedJSONBadResponse = mockAPIJSONBadResponse;
			var userLatitude = "42.338666";
			var userLongitude = "-71.092241";
			var geocodeAPIBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
			var geocodeAPIURL = geocodeAPIBaseURL + userLatitude + "," + userLongitude;
			httpMock.expectGET(geocodeAPIURL)
				.respond(503, mockAPIJSONBadResponse);

			var errorResponse = mapsService.getFormattedAddress(userLatitude, userLongitude);
			var actualErrorResponse;
			errorResponse.then(function(response){
				//Control not received here as its negative test case
			}, function (error) {
				actualErrorResponse = error.data;
            });

			httpMock.flush();

			expect(actualErrorResponse).toEqual(expectedJSONBadResponse);

		}); // End of getFormattedAddress method should handle the error responses gracefully

	});
}); // End of MapsService Test Suite