
app.controller('OutdoorsyHomePageController', function($rootScope, $routeParams, $route, $scope, $location, MapsService, UserSessionService, UIServices){

	// adds location autocomplete to search box
	$("#locationAutoComplete").geocomplete();

	if($routeParams.userId){
        UIServices.spinnerOnPage(true);

        // fetch user for this user Id
        UserSessionService.fetchUserById($routeParams.userId)
            .success(function (userFound){
                userFound.accountActivated = true;

                // update user account - account activated
                UserSessionService.updateUserProfile(userFound)
                    .success(function (updatedUser){
                        // login the user and navigate to user page again
                        UserSessionService.loginUsingEmail(updatedUser)
                            .success(function (userLoggedIn){
                                $rootScope.currentUser = userLoggedIn;
                                var messageToUser = "Hello " + userLoggedIn.firstName + ", </br>" 
                                                      + "Congratulations! Your account has been activated. </br></br>"
                                                      + "Enjoy Outdoorsy!"

                                UIServices.showMessageToUser(messageToUser);
                                $location.url('/home');
                                UIServices.spinnerOnPage(false);
                            });
                    })
            }) 
    }


	// Maintain User Session
    UserSessionService.maintainUserSession()
        .success(function (userInSession){
            if(userInSession === '401 Unauthorized'){
                $rootScope.currentUser = null;
            }else{
                UserSessionService.fetchUserById(userInSession._id)
                    .success(function (userResponse){
                        if(userResponse.accountActivated){
                            $rootScope.currentUser = userResponse;    
                        }      
                    });
            }
        });

	// Default User Location - CCIS WVH location when browser doesnt share the location or at any error response
	$scope.defaultUserLatitude = "42.338666";
	$scope.defaultUserLongitude = "-71.092241";
	$scope.defaultPostalAddress = "440 Huntington Avenue Boston MA";

	/*Get Started Button Click*/
	$scope.goToMapsUI = function (){
		$location.url('/maps');
	}

	/* Get location from the text box */
	$scope.getGeoCodes = function (){
		var loc = $("#locationAutoComplete").val();
		$rootScope.address = MapsService.getReverseAddress(loc).then(
            function (location) {
            	//$rootScope.userPostalAddress = location;
            	$rootScope.userLatitude = location.lat;
				$rootScope.userLongitude = location.lng;
				$scope.goToMapsUI();

 	        }, // End Of Function Success - getFormattedAddress
            function (formatAddressError) {
            	//$rootScope.userPostalAddress = formatAddressError.statusText;
            	$rootScope.userLatitude = $scope.defaultUserLatitude;
	    		$rootScope.userLongitude = $scope.defaultUserLongitude;
	    		$scope.goToMapsUI();
            }
        );
	}

	/*
		Fetch User location using HTML-5 GeoLocation
	*/
	$scope.getUserLocation = function() {
		if (navigator.geolocation) {
			// start spinner 
			UIServices.spinnerOnPage(true);

			// start watching location field , stop spinner when value is populated
			$scope.$watch("userPostalAddress", function (newValue, oldValue){
				if(newValue){
					UIServices.spinnerOnPage(false);
					// reload the page to reflect changes in UI
					$route.reload();
				}

                // stop spinner after 5 seconds and ask if user accepted to share his location
                setTimeout(function (){
                    if($rootScope.userPostalAddress == null || $rootScope.userPostalAddress == undefined){
                        UIServices.spinnerOnPage(false);
                        UIServices.showMessageToUser("<b>Did you accept to share your location?</b></br> Please share your location with us to continue.");
                    }   
                }, 7000)
			});

	        navigator.geolocation.getCurrentPosition($scope.showLocation);
	    }
	    else {
	    	// Defaulted to CCIS WVH location when browser doesnt share the location
	    	$rootScope.userLatitude = $scope.defaultUserLatitude;
	    	$rootScope.userLongitude = $scope.defaultUserLongitude;
	    	$rootScope.userPostalAddress = $scope.defaultPostalAddress;
		}
	}


    // Callback function of GeoLocation
	$scope.showLocation = function(position) {

		// Hits the Google Maps Geocoding API Service to Fetch The Formatted Address For The Specified Latitude and Longitude
		MapsService.getFormattedAddress(position.coords.latitude, position.coords.longitude).then(
            function (formattedAddress) {
            	$rootScope.userPostalAddress = formattedAddress;
            	$rootScope.userLatitude = position.coords.latitude;
				$rootScope.userLongitude = position.coords.longitude;
 	        }, // End Of Function Success - getFormattedAddress
            function (formatAddressError) {
            	$rootScope.userPostalAddress = formatAddressError.statusText;
            	$rootScope.userLatitude = $scope.defaultUserLatitude;
	    		$rootScope.userLongitude = $scope.defaultUserLongitude;
            }
        ); 
	}

});

