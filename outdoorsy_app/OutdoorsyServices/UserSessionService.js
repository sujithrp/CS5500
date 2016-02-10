app.factory("UserSessionService", ['$http','$facebook', function ($http, $facebook){

	var UserSessionService = {};

	// Get Login/SignUp Dialog
	UserSessionService.getDialog = function (userAction){
		var dialogToUse;
        if(userAction == 'login')
            return {templateUrl : '../OutdoorsyLogin/OutdoorsyLogin.html',
                	controller : 'OutdoorsyLoginController'};
        else if(userAction == 'signUp')
            return {templateUrl : '../OutdoorsySignUp/OutdoorsySignUp.html',
                	controller : 'OutdoorsySignUpController'};

        return null;
	};

	// Login Using Email
	UserSessionService.loginUsingEmail = function (User){
		if(User){
    		return $http.post('/loginUsingEmail', User);
		}

    	return null;
	};

	// Sign-Up Using Email
	UserSessionService.signUpUsingEmail = function (User){
		if(User)
			return $http.post('/signUpUsingEmail', User);

		return null;
	};

	// Log-Out
	UserSessionService.logoutUser = function (User){
		if(User)
			return $http.post('/logoutUser', User);

		return null;
	};

	// Fetch User By User Id
	UserSessionService.fetchUserById = function (userId){
		return $http.get('/fetchUser/' + userId);
	}

	// Check If User Is In Session
	UserSessionService.maintainUserSession = function (){
		return $http.get('/getUserInSession');
	};

	// Facebook Connect
	UserSessionService.logInToFacebook = function (){
		return $facebook.login();
	};

	// fetch user by fb id
	UserSessionService.fetchUserByFacebookId = function (userID){
		if(userID)
			return $http.get('/fetchFBUser/' + userID);

		return null;
	};

	// Facebook Fetch Profile Info
	UserSessionService.fetchPublicProfileFromFacebook = function (userID, accessToken){

		return $facebook.api('/' + userID
              					 + '?fields=id,first_name,last_name,email,picture.type(large)&access_token='
              					 + accessToken);
	};

	// update new facebook token in DB
	UserSessionService.updateFacebookToken = function(facebookId, newAccessToken){
		if(facebookId != undefined && newAccessToken != undefined)
			return $http.put('/updateFacebookAccessToken/' + facebookId, {accessToken: newAccessToken});

		return null;
	};

	// update user profile 
	UserSessionService.updateUserProfile = function(userToUpdate) {
		if(userToUpdate){
            return $http.put('/updateUserProfile/' + userToUpdate._id, userToUpdate)    
        }

    	return null;
	};

	// delete user profile
	UserSessionService.deleteProfile = function (userToDelete){
		if(userToDelete){
			return $http.delete('/deleteUser/' + userToDelete._id);
		}
	};

	return UserSessionService;
}]);