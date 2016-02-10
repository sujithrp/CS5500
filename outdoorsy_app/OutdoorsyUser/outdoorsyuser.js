app.controller('OutdoorsyUserController', function($scope, $routeParams, $facebook, $location, $rootScope, $route, UIServices, UserSessionService, PreferencesService) {

    $scope.readOnlyMode = true;
    $scope.passwordReadOnly = true;
    $scope.userInterests = [];


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
                $scope.fetchAllUserInterests();
            });
        }
    });

    $scope.fetchAllUserInterests = function (){
        
    	if($rootScope.currentUser.preferences.subCategories != null
    			&& $rootScope.currentUser.preferences.subCategories != undefined
    			&& $rootScope.currentUser.preferences.subCategories.length > 0
                && $rootScope.Categories.length > 0){


            for(var i in $rootScope.Categories){

                        
                var interest = {
                    categoryName : $rootScope.Categories[i].categoryName,
                    interests : []
                };


                for(var j in $rootScope.Categories[i].subCategories){

                    if($.inArray($rootScope.Categories[i].subCategories[j].subCategoryId, $rootScope.currentUser.preferences.subCategories) !== -1){
                        interest.interests.push($rootScope.Categories[i].subCategories[j].subCategoryName);
                    }
                }

                if(interest.interests.length > 0){
                    $scope.userInterests.push(interest);
                }
            }
    	}
    };


    // function to edit profile
    $scope.editProfile = function(){
    	$scope.readOnlyMode = false;
    };

    // save edited profile details
    $scope.saveProfile = function(currentUser){
    	UIServices.spinnerOnPage(true);

    	UserSessionService.updateUserProfile(currentUser)
    		.success(function (userSaved){
    			$rootScope.currentUser = userSaved;
    			$scope.readOnlyMode = true;
    			UIServices.spinnerOnPage(false);
    		});
    };

    // confirm with user before proceeding
    $scope.deleteProfile = function (){
    	UIServices.spinnerOnPage(true);

		var confirmBox = UIServices.takeUserConfirmation("Are you sure you want to permanently remove your Outdoorsy profile?", 
														 $scope.removeUser,
														 UIServices.resetUI);
    };

    // function to remove user from facebook if connected
    $scope.removeUser = function (){

    	if($rootScope.currentUser.facebookId){
    		$facebook.api('/me/permissions', 'DELETE')
    			.then(function (response){
    				console.log(response);
    				if(response.success){
    					$scope.removeUserAndAllActivitiesFromDB();
    				}
    			}, 
				function (error){
					UIServices.spinnerOnPage(false);
					console.log(error);
				});
    	}else{
    		$scope.removeUserAndAllActivitiesFromDB();
    	}
    };

    // delete user and all his activities from db
    $scope.removeUserAndAllActivitiesFromDB = function (){

    	UserSessionService.logoutUser($rootScope.currentUser)
			.success(function (logoutResponse){
				if(logoutResponse == '200 OK'){
					UserSessionService.deleteProfile($rootScope.currentUser)
						.success(function (deleteResponse){
							if(deleteResponse == '200 OK'){
								UIServices.spinnerOnPage(false);
								$rootScope.currentUser = null;
								$location.url('/home');
							}
						})
						.error(function (err){
							console.log(err);
							$rootScope.currentUser = null;
							UIServices.spinnerOnPage(false);
						});			
				}
			});
    };


    // function to validate password
    $scope.validatePasswordDetails = function(password){
        var alphanumeric = /^[0-9a-zA-Z]+$/;

        if (password.length < 5) {
            $("#pwdInp").css("border", "1px solid red");
            return "(Password not 5 characters long)";
        } else {
            $("#pwdInp").css("border", "1px");
        }

        if (password.match(alphanumeric)) {
            $("#pwdInp").css("border", "1px");
        } else {
            $("#pwdInp").css("border", "1px solid red");
            return "(Password can only be alpha-numeric)";
        }

        return true;
    }


    // change password for user
    $scope.changePwdBtnText = "Change Password";
    $scope.passwordEditMode = false;
    $scope.passwordError = null;

    $scope.changePassword = function (userChosenPassword){
        // Change Password is clicked
        if($scope.changePwdBtnText === "Change Password"){
            $scope.changePwdBtnText = "Save Password";
            $scope.passwordEditMode = true;

            $("#changePasswordButton").removeClass("btn btn-info");
            $("#changePasswordButton").addClass("btn btn-success");
        }
        
        // Save Password is clicked
        else{

            // validate password
            var validationResult = $scope.validatePasswordDetails(userChosenPassword);

            if(validationResult == true){
                $scope.changePwdBtnText = "Change Password";
                $scope.passwordEditMode = false;
                $scope.passwordError = null;

                $("#changePasswordButton").removeClass("btn btn-success");
                $("#changePasswordButton").addClass("btn btn-info");


                // function to update user profile with password
                UserSessionService.updateUserProfile($rootScope.currentUser)
                    .success(function (userUpdated){
                        $rootScope.currentUser = userUpdated;
                        UIServices.showMessageToUser("<b>Congratulations!</b></br>Your password was updated successfully.");
                    }) 

            }
            // password validations failed
            else{
                $scope.passwordError = validationResult;
            }
            
        }
    };

});