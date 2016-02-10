var app = angular.module("OutdoorsyApp", ["ngRoute" , "uiGmapgoogle-maps" ,"ngDialog", "ngFacebook", "LocalStorageModule"]);

//var app = angular.module("OutdoorsyApp", ["ngRoute" ,"ngDialog"]);

// All Page Routing Mechanisms
app.config(['$routeProvider', function($routeProvider){
	$routeProvider.
		when('/home', {
			templateUrl: '../OutdoorsyHome/OutdoorsyHomePage.html',
			controller:'OutdoorsyHomePageController'
		})
		.when('/maps', {
			templateUrl: '../OutdoorsyMapUI/OutdoorsyMapUI.html',
			controller:'OutdoorsyMapUIController'
		}).when('/events', {
            templateUrl: '../OutdoorsyEvents/OutdoorsyEvents.html',
            controller:'OutdoorsyEventsController'
        }).when('/user', {
            templateUrl: '../OutdoorsyUser/OutdoorsyUser.html',
            controller:'OutdoorsyUserController'
        }).when('/user', {
            templateUrl: '../OutdoorsyUser/OutdoorsyUser.html',
            controller:'OutdoorsyUserController'
        }).when('/aboutus', {
            templateUrl: '../OutdoorsyAboutUs/OutdoorsyAboutUs.html'
        }).when('/home/:userId', {
            templateUrl: '../OutdoorsyHome/OutdoorsyHomePage.html',
            controller:'OutdoorsyHomePageController'
        }).when('/faq', {
            templateUrl: '../OutdoorsyFAQ/OutdoorsyFAQ.html',
            controller:'OutdoorsyFAQController'
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);

// Facebook Authentication Configuration
app.config(function ($facebookProvider){
    $facebookProvider.setAppId('1049607851725542');
    $facebookProvider.setVersion("v2.5");
    $facebookProvider.setPermissions("email,public_profile");
});

// Load Facebook SDK
app.run(function( $rootScope, PreferencesService) {
    // hide spinner div initially
    $("#spinnerDiv").hide();

    $("input[name='searchPrefInp']").TouchSpin({
                min: 2,
                max: 50,
                step: 1,
                decimals: 0,
                boostat: 5,
                maxboostedstep: 10,
                prefix:'Search Within',
                postfix:'miles'
            });

    // Load the facebook SDK asynchronously
    (function(){
        // If we've already installed the SDK, we're done
        if (document.getElementById('facebook-jssdk')) {return;}

        // Get the first script element, which we'll use to find the parent node
        var firstScriptElement = document.getElementsByTagName('script')[0];

        // Create a new script element and set its id
        var facebookJS = document.createElement('script'); 
        facebookJS.id = 'facebook-jssdk';

        // Set the new script's source to the source of the Facebook JS SDK
        facebookJS.src = '//connect.facebook.net/en_US/all.js';

        // Insert the Facebook JS SDK into the DOM
        firstScriptElement.parentNode.insertBefore(facebookJS, firstScriptElement);
    }());
});

// Outdoorsy Main App Controller
app.controller('OutdoorsyAppController', function($scope, 
                                                  $rootScope, 
                                                  $location,
                                                  $route, 
                                                  $http,
                                                  ngDialog, 
                                                  UserSessionService,
                                                  UIServices, 
                                                  EventsService,
                                                  PreferencesService){

    // fetch categories from database
    if(!$rootScope.Categories){
        PreferencesService.fetchCategories()
            .success(function (allCategories){
                $rootScope.Categories = allCategories;
            });
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

    // Open Dialog Based On User Action
    $scope.openDialog = function(userAction){

        var dialogToUse = UserSessionService.getDialog(userAction);

        if(dialogToUse){
            var openDialog = ngDialog.open({
                template: dialogToUse.templateUrl,
                className: 'ngdialog-theme-default',
                controller: dialogToUse.controller,
                scope: $scope
            });

            openDialog.closePromise.then(function(data){
                if (data != undefined && data.value.hasOwnProperty('action')) {
                    if(data.value.action == 'openSignUpDialog'){
                        $scope.openDialog('signUp');
                    }
                    else if(data.value.action == 'openLoginDialog'){
                        $scope.openDialog('login');
                    }
                    else if(data.value.action == 'loginUsingEmail'){
                        UserSessionService.loginUsingEmail(data.value.user)
                            .success(function (loggedInUser){
                                if(loggedInUser.accountActivated){
                                    $rootScope.currentUser = loggedInUser;
                                    $route.reload();
                                }
                                else{
                                    UIServices.showErrorToUser("<b>Your Account has not been activated yet.</b></br></br>"
                                         + "Please activate your account to complete the login process. </br>");
                                }
                            })
                            .error(function (error){
                                UIServices.showErrorToUser("No account found for these login credentials. Please try again.");
                            });
                    }
                    else if(data.value.action == 'signUpUsingEmail'){
                        UserSessionService.signUpUsingEmail(data.value.user)
                            .success(function (signedUpUser_notActivated){

                                var messageToUser = "Hello " + signedUpUser_notActivated.firstName 
                                                          + ", </br>" 
                                                          + "<b>We have sent an account activation link to your email. </br>"
                                                          + "Please activate your account to complete login process</b>"
                                UIServices.showMessageToUser(messageToUser);
                            });
                    }
                    else if(data.value.action == 'connectWithFacebook'){
                        UIServices.spinnerOnPage(true);
                        $scope.facebookConnect();
                    }
                }
            });
        }
    };


    // facebook Connect
    $scope.facebookConnect = function (){
        var facbookConnectErrMsg = "Something went wrong! We were not able to connect with Facebook";
        var facebookPermissionDeniedMsg = "Oops! We were not able to get your information from Facebook";
        // login to facebook
        UserSessionService.logInToFacebook()
            .then( function (fbResponse){

                if(fbResponse.authResponse){
                    var userID = fbResponse.authResponse.userID;
                    var accessToken = fbResponse.authResponse.accessToken;

                    // check first if we have this user in our database
                    UserSessionService.fetchUserByFacebookId(userID)
                        .success(function (userInDB){

                            // if found, update facebookToken and complete login
                            if(userInDB){

                                UserSessionService.updateFacebookToken(userInDB.facebookId, accessToken)
                                    .success(function (userAfterUpdate){
                                        UserSessionService.loginUsingEmail(userAfterUpdate)
                                            .success(function (loggedInUser){
                                                $rootScope.currentUser = loggedInUser;
                                                $route.reload();
                                            });
                                    });

                                UIServices.spinnerOnPage(false);
                            }
                            // user is loggin in for the first time with facebook
                            else{
                                // if not, fetch public information from facebook
                                UserSessionService.fetchPublicProfileFromFacebook(userID, accessToken)
                                    .then(function (userPublicInfo){

                                        var newUser = {firstName: userPublicInfo.first_name,
                                                       lastName: userPublicInfo.last_name,
                                                       email: userPublicInfo.email,
                                                       password: 'fbConnect',
                                                       facebookId: userID,
                                                       facebookToken: accessToken,
                                                       accountActivated : true,
                                                       profilePic : userPublicInfo.picture.data.url};

                                        // signup the new user and login
                                        UserSessionService.signUpUsingEmail(newUser)
                                            .success(function (signedUpUser){
                                                UserSessionService.loginUsingEmail(signedUpUser)
                                                    .success(function (loggedInUser){
                                                        $rootScope.currentUser = loggedInUser;
                                                        UIServices.spinnerOnPage(false);
                                                        $route.reload();
                                                    });
                                            });
                                    },
                                    function (err){
                                        UIServices.spinnerOnPage(false);
                                        UIServices.showMessageToUser(facbookConnectErrMsg);
                                        console.log(err);
                                    });
                            }
                        })
                        .error(function (err){
                            console.log(err);
                            UIServices.spinnerOnPage(false);
                            UIServices.showMessageToUser(facbookConnectErrMsg);
                        });
                }else{
                    // user chooses cancel are unauthorizes information share - show message accordingly
                    UIServices.spinnerOnPage(false);
                    UIServices.showMessageToUser(facebookPermissionDeniedMsg);
                }
            }, function (err){
                console.log(err);
                UIServices.spinnerOnPage(false);
                // show message to user that there was an error with facebook login
                UIServices.showMessageToUser(facbookConnectErrMsg);
            });
    };

    // Capture Logout Request From User
    $scope.logoutUser = function(){
        var userToLogOut = $rootScope.currentUser;
        if(userToLogOut){
            UserSessionService.logoutUser(userToLogOut)
                .success(function (logoutResponse){
                    if(logoutResponse == '200 OK'){
                        $rootScope.currentUser = null;
                        $location.url("/home");
                    }
            });
        }
    };

    // button click to open preferences
    $scope.openPreferences = function (){
        $scope.selectedPrefs = $rootScope.currentUser.preferences.subCategories;

        $('html, body').animate({
            scrollTop: $("#allViews").offset().top - 100
        }, 1000);

        PreferencesService.togglePreferences(true);
    };

    // open the about us page
    $scope.aboutUs = function (){
        $location.url("/aboutus");
    };

    // open the FAQ page
    $scope.openFAQ = function (){
        $location.url("/faq");
    };


    // button click on Preferences to save user selection
    $scope.savePrefs = function (){

        $rootScope.prefsSaved = "true";

        UIServices.spinnerOnPage(true);

        PreferencesService.updateUserPreferences($rootScope.currentUser)
            .success(function (userUpdated){
                $rootScope.currentUser = userUpdated;
                UIServices.spinnerOnPage(false);
                // When the preferences are updated, the pages should reflect its content based upon the selection
                $route.reload();
            });

        PreferencesService.togglePreferences(false);
    };

    $scope.openUserProfile = function() {
        $location.url('/user');
    }


    // Saving user selection/de-selection in instance
    $scope.toggleSubCategorySelection = function (subcategoryId){
        var indexOfPreference = $rootScope.currentUser.preferences.subCategories.indexOf(subcategoryId);

        if(indexOfPreference > -1){
            $rootScope.currentUser.preferences.subCategories.splice(indexOfPreference, 1);
        }
        else{
            $rootScope.currentUser.preferences.subCategories.push(subcategoryId);
        }
    };

    $scope.toggleModeOfTransport = function (mode){
        var indexOfMode = $rootScope.currentUser.preferences.modeOfTransport.indexOf(mode);

        if(indexOfMode > -1){
            $rootScope.currentUser.preferences.modeOfTransport.splice(indexOfMode, 1);
        }
        else{
            $rootScope.currentUser.preferences.modeOfTransport.push(mode);
        }
    };



    $scope.confirmResetAllPreferences = function (){
        UIServices.takeUserConfirmation("Are you sure you want to reset all your preferences?", 
                                         $scope.resetAllPreferences, 
                                         UIServices.resetUI);
    };

    $scope.resetAllPreferences = function (){
        UIServices.spinnerOnPage(true);
        PreferencesService.togglePreferences(false);

        $rootScope.currentUser.preferences = {
            searchRadius : 2,
            modeOfTransport : [],
            subCategories : []
        };

        PreferencesService.updateUserPreferences($rootScope.currentUser)
            .success(function (userUpdated){
                $rootScope.currentUser = userUpdated;
                UIServices.spinnerOnPage(false);
                
                $route.reload();
            });

    };
});