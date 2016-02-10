/*
	OutdoorsyMapUIController controls the MAP GUI. It makes call to the EventBrite API Service and the fetched events are plotted over Google Maps
*/
app.controller('OutdoorsyMapUIController', function($scope, $q, $http, $rootScope, $location, EventsService, UserSessionService, UIServices, MapsService){

	// Defaulted to CCIS WVH location when the $rootScope lat long is undefined
	if(($rootScope.userLatitude == undefined) || ($rootScope.userLongitude == undefined)){
		$rootScope.userLatitude = "42.338666";
		$rootScope.userLongitude = "-71.092241";
	}

	// queryParams To Pass As Input To The EventBrite Service fetchEvents()
	var locationWithin = "location.within";
	var defaultLocationRadius = "10";
	var imperialUnit = "mi";
	var locationLatitude = "location.latitude";
	var locationLongitude = "location.longitude";
	var categories = "categories";
	var subCategories = "subcategories";
	var sportsFitnessCategoryID = "108";
	var travelOutdoorCategoryID = "109";
	var defaultCategoryList = sportsFitnessCategoryID + "," + travelOutdoorCategoryID;
	var tokenLabel = "token";
	var token = "XW7DPWWVG6SQUX2ZKMNW";
	var expandLabel = "expand";
	var expand = "venue,logo,organizer,ticket_classes";
	var queryParams = { };

	// Maintain User Session
    UserSessionService.maintainUserSession().success(function (userInSession){
    	// User not logged in (Guest User)
        if(userInSession === '401 Unauthorized'){
            $rootScope.currentUser = null;
            $scope.loadEventsInMap();
        }
        // User logged in
        else{
          	UserSessionService.fetchUserById(userInSession._id).success(function (userResponse){
                if(userResponse.accountActivated){
                    $rootScope.currentUser = userResponse;    
                }
                // if user is logged in then first get all his rated events and then load events on map
                $scope.fetchAllRatedEvents();
            });
        }
    }); // End of maintainUserSession()


    // function to fetch all user preferences if user is logged in
    $scope.allRatedEvents = null;

    $scope.fetchAllRatedEvents = function (){
    	
    	if($rootScope.currentUser){
    		$http.get('/fetchAllRatedEvents/'+ $rootScope.currentUser._id)
    			.success(function (allRatedEvents){
					$scope.allRatedEvents = allRatedEvents;    
					$scope.loadEventsInMap();				
    			});
    	}
    };


    // Setup the Map and Plot User Location
    var infowindow = MapsService.getInfoWindow();
    var map = MapsService.getMap("map");
    MapsService.plotUserLocation($rootScope.userLatitude, $rootScope.userLongitude, infowindow, map);

	// start spinner and wait for events to load
	UIServices.spinnerOnPage(true);
	
	$scope.goToEventDetails = function(eventObj) {
		$rootScope.eventSelected = eventObj;
		$location.url('/events');
		$scope.$apply();
	}

	$scope.$watch('noteSelected', function(selected) {
    	$scope.newNote = selected
	 });

	// FetchEvents to show on map
	$scope.loadEventsInMap = function() {

		// Basic template of queryParams for both LoggedIn and Guest User
		queryParams[locationWithin] = defaultLocationRadius + imperialUnit;
        queryParams[locationLatitude] = $rootScope.userLatitude;
        queryParams[locationLongitude] = $rootScope.userLongitude;
        queryParams[categories] = defaultCategoryList;
        queryParams[tokenLabel] = token;
        queryParams[expandLabel] = expand;

		// LoggedIn User Holds Additional Query Params (SubCategories)
		if($rootScope.currentUser != null) {
			// SubCategories Preference Query Params
        	if($rootScope.currentUser.preferences.subCategories.length > 0){
            	queryParams[subCategories] = $rootScope.currentUser.preferences.subCategories.join();
            }
            // Search Radius Preference Query Params
            if(($rootScope.currentUser.preferences.searchRadius != undefined) && 
            	($rootScope.currentUser.preferences.searchRadius != null) &&
            	($rootScope.currentUser.preferences.searchRadius >= 2)){
            		queryParams[locationWithin] = $rootScope.currentUser.preferences.searchRadius +
            			 imperialUnit;
            }
        }

        // Hit the EventBrite API to fetch the events
		EventsService.fetchEvents(queryParams)
			.success(function (eventsResponse){
				if(eventsResponse.events.length > 0){

					angular.forEach(eventsResponse.events, function (eventObject){
						var userPosition = new google.maps.LatLng($rootScope.userLatitude, $rootScope.userLongitude);
						var eventPosition = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
						var distanceService = new google.maps.DistanceMatrixService();
						var distanceServiceInput = {
													origins: [userPosition],
									    			destinations: [eventPosition],
									    			travelMode: google.maps.TravelMode.DRIVING,
									    			unitSystem: google.maps.UnitSystem.IMPERIAL,
								    				avoidHighways: false,
								  					avoidTolls: false
						};
					
						distanceService.getDistanceMatrix(distanceServiceInput, function(response, status){
							if((response.rows.length>0) && (response.rows[0].elements.length>0)){
								var mapIconFileName = "";
								if(eventObject.subcategory_id == null){
									if((eventObject.category_id != null) && (eventObject.category_id == sportsFitnessCategoryID)){
										mapIconFileName = "8999";
									}
									else {
										mapIconFileName = "9999";
									}
								}
								else {
									mapIconFileName = eventObject.subcategory_id; 
								}

								var distanceInMiles = response.rows[0].elements[0].distance.text;
								var markerToShow = { position: new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude),
									map: map,
									animation: google.maps.Animation.DROP,
									icon: '../OutdoorsyMapUI/staticfiles/mapicons/' + mapIconFileName + '.png',
									url: eventObject.url
								};

								var marker = new google.maps.Marker(markerToShow);

								// Add MouseOver Listener For The Event Markers
				 				google.maps.event.addListener(marker, 'mouseover', function () {
				 					var toolTipImage = "<img BORDER='0' ALIGN='Left' src='../OutdoorsyMapUI/staticfiles/mapicons/unrated.png'>";

				 					
            						if($scope.allRatedEvents != null) {	
            							if($.inArray(eventObject.id, $scope.allRatedEvents.eventsLiked) !== -1){
            								toolTipImage = "<span title='You have liked this event' class='fa fa-thumbs-up fa-2x' style='color:green;float:left'></span>";
            							}
            							else if($.inArray(eventObject.id, $scope.allRatedEvents.eventsDisliked) !== -1){
            								toolTipImage = "<span title='You have dis-liked this event' class='fa fa-thumbs-down fa-2x' style='color:red;float:left'></span>";
            							}
            						}

            						var toolTipContents = toolTipImage + "&nbsp; <strong>" + eventObject.name.text + "</strong> <br> &nbsp;&nbsp;" + 
            												"Driving distance from me : <strong>" + distanceInMiles + "</strong>";
            						infowindow.setContent(toolTipContents);
									infowindow.open(map, this);
								});

								google.maps.event.addListener(marker, 'click', function() {							
									$scope.goToEventDetails(eventObject);
								});
							}; // End of if() block getDistanceMatrix response
						}); // End of getDistanceMatrix()
					}); // End of Angular ForEach EventsObject
				}// End of if() block fetchEvents events response
				else{
					// inform user with a friendly message that no events were found.
					UIServices.showMessageToUser("Sorry! We could not find any events at your location.");
				}
			}) // End of fetchEvents() success function
			.error(function (errorResponse){
				// inform user with a friendly message that no events were found.
				console.log(errorResponse);
			})
			.finally(function(){
				UIServices.spinnerOnPage(false);
			})
			.catch(function (exception){
				console.log(exception);
			});
	} // End of loadEventsInMap()
	
}); // End of OutdoorsyMapUIController