app.controller('OutdoorsyEventsController', function($scope, $rootScope, $location, $http, localStorageService, MapsService, EventsService, UserSessionService, UIServices) {

	if($rootScope.eventSelected == null || $rootScope.eventSelected == undefined){
        $rootScope.eventSelected = localStorageService.get('previousEvent');
        $rootScope.userLatitude = localStorageService.get('userLatitude');
        $rootScope.userLongitude = localStorageService.get('userLongitude');
        if ($rootScope.eventSelected == null || $rootScope.eventSelected == undefined) {
            $location.url('/maps');
        }
	}

    localStorageService.set('previousEvent',$rootScope.eventSelected);
    localStorageService.set('userLatitude',$rootScope.userLatitude);
    localStorageService.set('userLongitude',$rootScope.userLongitude);
    
    $scope.selectedEvent = $rootScope.eventSelected;
    
	// Maintain User Session
    UserSessionService.maintainUserSession().success(function (userInSession){
    	// User not logged in (Guest User)
        if(userInSession === '401 Unauthorized'){
            $rootScope.currentUser = null;
        }
        // User logged in
        else{
          	UserSessionService.fetchUserById(userInSession._id).success(function (userResponse){
                if(userResponse.accountActivated){
                    $rootScope.currentUser = userResponse;    
                }
            });
        }

        $scope.showEventOnMap();

        $scope.fetchAllReviews();
    });

    // Function to remove line breaks in description text and convert them to a html break tag
    var newLineToBreak = function (str) {   
	    var breakTag = '</br>';    
    	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
	}

    // add event description after removing line breaks
    $scope.eventDescription = $("#desc").append(newLineToBreak($scope.selectedEvent.description.text));

    // add organizer description after removing line breaks
    $scope.organizerDesc = ($scope.selectedEvent.organizer == null || undefined) || 
                           ($scope.selectedEvent.organizer.description == null || undefined)? null 
        : $("#orgDesc").append(newLineToBreak($scope.selectedEvent.organizer.description.text));


    /*------------Map view of event--------------*/

    var origin = new google.maps.LatLng($rootScope.userLatitude, $rootScope.userLongitude);
    var destination = new google.maps.LatLng($scope.selectedEvent.venue.latitude, $scope.selectedEvent.venue.longitude);
        
    var infowindow = MapsService.getInfoWindow();
    var eventMap = MapsService.getMap("eventOnMap");
    var directionsDisplay = new google.maps.DirectionsRenderer();

    $scope.showEventOnMap = function(){

    	// Plot The User location
    	MapsService.plotUserLocation($rootScope.userLatitude, $rootScope.userLongitude, infowindow, eventMap);

        // Plot The Event Location
        var destinationMarker = new google.maps.Marker({position: destination, 
                                                         map: eventMap, 
                                                         icon: '../OutdoorsyMapUI/staticfiles/mapicons/' 
                                                                + $scope.selectedEvent.subcategory_id 
                                                                + '.png' });
        // Add MouseOver Listener For The Event Markers
        google.maps.event.addListener(destinationMarker, 'mouseover', function () {
            infowindow.setContent('<strong>'+ "Here is The Event!" +'</strong>');
            infowindow.open(eventMap, this);
        });
    };

    $scope.setModeOfTransport = function(mode){
    	$("#WALKING").css("color","#000");
    	$("#DRIVING").css("color","#000");
    	$("#TRANSIT").css("color","#000");

    	$("#" + mode).css("color", "green");

    	$scope.showRoute(mode);
    };

    $scope.showRoute = function (modeOfTransport){
    	
    	var directionsService = new google.maps.DirectionsService();
		var directionsRequest = {origin: origin,
								 destination: destination,
								 travelMode: google.maps.DirectionsTravelMode[modeOfTransport],
								 unitSystem: google.maps.UnitSystem.IMPERIAL};
		
		
		directionsDisplay.setMap();
		directionsDisplay.setMap(eventMap);
		directionsDisplay.setOptions({ suppressMarkers: true } );
    	
		directionsService.route(
			directionsRequest,
			function(response, status){
				if (status == google.maps.DirectionsStatus.OK){
					directionsDisplay.setDirections(response);
				}
				else{
					$("#error").append("Unable to retrieve your route<br />");
				}
			});
	}


    //----------------User Reviews And User Rating -------------------//
    $scope.submitReview = function (userReview){

        if(userReview == null || userReview == undefined || userReview.length < 3){
            UIServices.showMessageToUser("Review content cannot be blank or empty");
            return;   
        }


        // first check if user activity exists
        var currentUserId = $rootScope.currentUser._id;
        var currentEventId = $scope.selectedEvent.id;
        var commentBy = $rootScope.currentUser.lastName + ", " + $rootScope.currentUser.firstName;

        $http.get('/getUserActivity/' + currentUserId + "/" + currentEventId)
            .success(function (activity){
                $scope.userReview = "";

                // activity found for this user and event in database
                if(activity){
                    var commentToAdd = {
                        commentedBy : commentBy,
                        comment: userReview,
                        commentDate : new Date().getTime()
                    };

                    activity.userReviews.push(commentToAdd);

                    $http.put("/updateUserActivity", activity)
                        .success(function (activitySaved){
                            $scope.fetchAllReviews();
                        });
                }
                // activity not found in database - create one now with comment
                else{
                    var activityToAdd = {
                        userId : currentUserId,
                        eventId : currentEventId,
                        userReviews : [{
                            commentedBy : commentBy,
                            comment : userReview,
                            commentDate : new Date().getTime()
                        }]
                    };

                    $http.post('/addUserActivity', activityToAdd)
                        .success(function (activityAdded){
                            $scope.fetchAllReviews();
                        });
                }

            });
    };


    // Fetch All Reviews for this event
    $scope.fetchAllReviews = function (){
        $scope.allReviews = null;

        $http.get('/fetchAllActivities/' + $scope.selectedEvent.id)
            .success(function (allReviews) {
                $scope.allReviews = allReviews;
                $scope.calculateLikesAndDislikes();
            });
    };

    // Calculate Number of Likes and dislikes for this event
    $scope.calculateLikesAndDislikes = function (){
        var likes = 0, dislikes = 0;
        
        for(var i in $scope.allReviews){
            if($scope.allReviews[i].userRating){
                if($scope.allReviews[i].userRating.isLiked){
                    if($rootScope.currentUser != undefined && 
                            $scope.allReviews[i].userId == $rootScope.currentUser._id){
                        $scope.userHasLikedThisEvent = true;
                        $scope.userHasDislikedThisEvent = false;
                    }
                    ++likes;
                }

                if($scope.allReviews[i].userRating.isDisliked){
                    if($rootScope.currentUser != undefined && 
                            $scope.allReviews[i].userId == $rootScope.currentUser._id){
                        $scope.userHasLikedThisEvent = false;
                        $scope.userHasDislikedThisEvent = true;
                    }
                    ++dislikes;
                }
            }
        };

        $scope.numberOfLikes = likes;
        $scope.numberOfDislikes = dislikes;
    };
    
    // like an event
    $scope.rateEvent = function(isLiked){
        
        if($rootScope.currentUser == null || $rootScope.currentUser == undefined){
            UIServices.showMessageToUser("Please sign-up or login to rate this event");
            return;
        }

        // remove all colors
        $("#likeBtn").css("color", "none");
        $("#unLikeBtn").css("color", "none");

        /*// add color
        $("#likeBtn").css("color", isLiked ? "green" : "none");
        $("#unLikeBtn").css("color",isLiked ? "none" : "red");*/

        var currentUserId = $rootScope.currentUser._id;
        var currentEventId = $scope.selectedEvent.id;

        $http.get('/getUserActivity/' + currentUserId + "/" + currentEventId)
            .success(function (activity){

                if(activity){
                    
                    activity.userRating = {
                        isLiked: isLiked,
                        isDisliked : !isLiked
                    };

                    $http.put("/updateUserActivity", activity)
                        .success(function (activitySaved){
                            $scope.fetchAllReviews();
                        });
                }
                else{
                    var activityToAdd = {
                        userId : currentUserId,
                        eventId : currentEventId,
                        userRating : {
                            isLiked : isLiked,
                            isDisliked: !isLiked
                        }
                    };

                    $http.post('/addUserActivity', activityToAdd)
                        .success(function (activityAdded){
                            $scope.fetchAllReviews();
                        });
                }
            });
    };


    // Delete a user comment
    $scope.removeComment = function (userActivity, indexOfComment){
        
        userActivity.userReviews.splice(indexOfComment,1);

        $http.put("/updateUserActivity", userActivity)
            .success(function (activitySaved){
                $scope.fetchAllReviews();
            });
    };
});

