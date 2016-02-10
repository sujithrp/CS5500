describe("EventsService Test Suite", function(){
	var eventsService;
	var httpMock;


	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		// inject Service
		inject(function ($httpBackend, EventsService){
			eventsService = EventsService;
			httpMock = $httpBackend;
		});
	});

	// make sure no expectations were missed in your tests.
	afterEach(function() {
		httpMock.verifyNoOutstandingExpectation();
		httpMock.verifyNoOutstandingRequest();
	});


	// Initialization Tests
	describe("EventsService Initialization Tests", function(){

		// check if the method fetchEvents is available the service
		it('eventsService should have a fetchEvents method', function () {
			expect(angular.isFunction(eventsService.fetchEvents)).toBe(true);
		});
	});


	// EventServices FetchEvents Tests 
	describe("EventsService fetchEvents Tests", function(){
		var eventsSearchURL = "https://www.eventbriteapi.com/v3/events/search/?";
		var fakeQueryParams = {"location.within":"7mi",
							   "location.latitude": "42.338666",
			                   "location.longitude": "-71.092241",
			                   "categories":"108",
			                   "subcategories":"8003,8009",
			                   "token":"XW7DPWWVG6SQUX2ZKMNW"};

		it("fetchEvents should return null if input queryParams is null or undefined", function(){
			
			var serviceResponse = eventsService.fetchEvents(null);

			expect(serviceResponse).toBe(null);
		});

		// api returns success
		it("fetchEvents should return a success promise containing a list of events, if api returns success", function(){
			
			
			var fakeSuccessResponse = {
			    "pagination": {
			        "object_count": 4, 
			        "page_number": 1, 
			        "page_size": 50, 
			        "page_count": 1
			    }, 
			    "events": [
			        {
			            "name": {
			                "text": "Fireside Chat with Ted King", 
			                "html": "Fireside Chat with Ted King"
			            }, 
			            "description": {
			                "text": "\n \n\nToss on your smoking jacket and tweed as we first party then sit down for a conversation with Ted King, retiring pro-cyclist who tackled the sport's biggest events\u00a0including the Tour de France, Giro d\u2019Italia, the hallowed Spring Classics, and the UCI World Championships.\u00a0After 10-years as a racing professional, Ted decided that the 2015 season would be his last, so join us as he hangs up his helmet and waxes poetic with some of the insider's stories from his time on the saddle.\u00a0Ted will be hosted by the indomitable\u00a0Richard Fries, who we're sure will chat about\u00a0monuments such as Paris-Roubaix and the Tour of Flanders...\u00a0and Ted's fondness for maple syrup.\u00a0You're invited to join the conversation, at Landry's Bicycles in Boston on\u00a0Tuesday, November 24.\u00a0 \n  \nPlus, there will be food and beer and warm apple cider -- since this is New England in late fall. \n  \n6pm doors open,\u00a06:30 event starts \nTuesday, November 24 \nLandry's Bicycles \n890 Commonwealth Avenue \nBoston, MA 02215 \n  \nThis event is FREE and open to the public, with limited number of chairs so be sure to RSVP on the Eventbrite page. But bring your open wallets, since we will be taking donations to support MassBike, your only commonwealth-wide bicycle advocacy organization, and the Kremples Center, a charity near to Ted's heart that is working\u00a0to improve the lives of people living with brain injury from trauma, tumor, or stroke. \nFor more information about MassBike, visit: www.MassBike.org \nFor more information about the Krempels Center, visit: www.KingChallenge.org ", 
			                "html": "<DIV>\n<DIV><BR><\/DIV>\n<\/DIV>\n<P>Toss on your smoking jacket and tweed as we first party then sit down for a conversation with Ted King, retiring pro-cyclist who tackled the sport's biggest events<SPAN>\u00a0including the Tour de France, Giro d\u2019Italia, the hallowed Spring Classics, and the UCI World Championships.<\/SPAN>\u00a0<SPAN>After 10-years as a racing professional, Ted decided that the 2015 season would be his last, so join us as he hangs up his helmet and waxes poetic with some of the insider's stories from his time on the saddle.\u00a0<SPAN>Ted will be hosted by the <SPAN>indomitable\u00a0<\/SPAN>Richard Fries, who we're sure will chat about\u00a0<\/SPAN><SPAN>monuments such as Paris-Roubaix and the Tour of Flanders...<\/SPAN><SPAN>\u00a0and Ted's fondness for maple syrup.\u00a0<\/SPAN><\/SPAN>You're invited to join the conversation, at Landry's Bicycles in Boston on\u00a0Tuesday, November 24.\u00a0<\/P>\n<P><BR><\/P>\n<P>Plus, there will be food and beer and warm apple cider -- since this is New England in late fall.<\/P>\n<P><BR><\/P>\n<P>6pm doors open,\u00a06:30 event starts<\/P>\n<P>Tuesday, November 24<\/P>\n<P>Landry's Bicycles<\/P>\n<P>890 Commonwealth Avenue<\/P>\n<P>Boston, MA 02215<\/P>\n<P><BR><\/P>\n<P>This event is FREE and open to the public, with limited number of chairs so be sure to RSVP on the Eventbrite page. But bring your open wallets, since we will be taking donations to support MassBike, your only commonwealth-wide bicycle advocacy organization, and the Kremples Center, a charity near to Ted's heart that is working<SPAN>\u00a0to improve the lives of people living with brain injury from trauma, tumor, or stroke.<\/SPAN><\/P>\n<P><SPAN>For more information about MassBike, visit: www.MassBike.org<\/SPAN><\/P>\n<P><SPAN>For more information about the Krempels Center, visit: www.KingChallenge.org<\/SPAN><\/P>"
			            }, 
			            "id": "19326378719", 
			            "url": "http://www.eventbrite.com/e/fireside-chat-with-ted-king-tickets-19326378719?aff=ebapi", 
			            "vanity_url": "http://tedkingfiresidechat.eventbrite.com", 
			            "start": {
			                "timezone": "America/New_York", 
			                "local": "2015-11-24T18:00:00", 
			                "utc": "2015-11-24T23:00:00Z"
			            }, 
			            "end": {
			                "timezone": "America/New_York", 
			                "local": "2015-11-24T20:30:00", 
			                "utc": "2015-11-25T01:30:00Z"
			            }, 
			            "created": "2015-10-30T01:09:10Z", 
			            "changed": "2015-10-30T14:38:42Z", 
			            "capacity": 1000, 
			            "status": "live", 
			            "currency": "USD", 
			            "listed": true, 
			            "shareable": true, 
			            "online_event": false, 
			            "tx_time_limit": 480, 
			            "hide_start_date": false, 
			            "locale": "en_US", 
			            "logo_id": "16465510", 
			            "organizer_id": "8585113045", 
			            "venue_id": "11903680", 
			            "category_id": "108", 
			            "subcategory_id": "8003", 
			            "format_id": "19", 
			            "resource_uri": "https://www.eventbriteapi.com/v3/events/19326378719/", 
			            "logo": {
			                "id": "16465510", 
			                "url": "https://img.evbuc.com/https%3A%2F%2Fimg.evbuc.com%2Fhttp%253A%252F%252Fcdn.evbuc.com%252Fimages%252F16465510%252F91735882365%252F1%252Foriginal.jpg%3Frect%3D0%252C0%252C672%252C336%26s%3D620df8e2b71c940697f5061102773264?h=200&w=450&s=f65d2ad26044fa25f5be0f8b0096068f", 
			                "aspect_ratio": "2", 
			                "edge_color": "#713c32", 
			                "edge_color_set": true
			            }
			        }
			    ]    	
			};

			httpMock.expectGET(eventsSearchURL + jQuery.param(fakeQueryParams)).respond(fakeSuccessResponse);

			var apiResponsePromise = eventsService.fetchEvents(fakeQueryParams);

			var apiResponse;
			apiResponsePromise.then(function(response){
				apiResponse = response;
			});

			httpMock.flush();

			expect(apiResponse.status).toEqual(200);

			expect(apiResponse.data).toEqual(fakeSuccessResponse);
		});


		// api returns failure
		it("fetchEvents should return a failure promise, if api endpoint fails", function(){
			var mockAPIJSONBadResponse	= {
				"status": "Service Unavailable"
			};

			httpMock.expectGET(eventsSearchURL + jQuery.param(fakeQueryParams))
				.respond(503, mockAPIJSONBadResponse);

			var errorResponse = eventsService.fetchEvents(fakeQueryParams);
			
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