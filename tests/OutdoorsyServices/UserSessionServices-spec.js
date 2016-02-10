describe("UserSessionService Tests", function(){
	var userSessionService;
	var httpMock;
	var facebookMock;

	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		// inject Service
		inject(function ($httpBackend, $facebook, _UserSessionService_){
			userSessionService = _UserSessionService_;
			httpMock = $httpBackend;
			facebookMock = $facebook;
		});
	});

	// make sure no expectations were missed in your tests.
	afterEach(function() {
		httpMock.verifyNoOutstandingExpectation();
		httpMock.verifyNoOutstandingRequest();
	});


	// Tests For Service Initialization
	describe("Initialization", function(){
		// check if all methods we defined in the service are available
		it('UserSessionService should have a getDialog method', function () {
			expect(angular.isFunction(userSessionService.getDialog)).toBe(true);
		});

		it('UserSessionService should have a loginUsingEmail method', function () {
			expect(angular.isFunction(userSessionService.loginUsingEmail)).toBe(true);
		});
		
		it('UserSessionService should have a signUpUsingEmail method', function () {
			expect(angular.isFunction(userSessionService.signUpUsingEmail)).toBe(true);
		});

		it('UserSessionService should have a logoutUser method', function () {
			expect(angular.isFunction(userSessionService.logoutUser)).toBe(true);
		});

		it('UserSessionService should have a maintainUserSession method', function () {
			expect(angular.isFunction(userSessionService.maintainUserSession)).toBe(true);
		});

		it('UserSessionService should have a logInToFacebook method', function () {
			expect(angular.isFunction(userSessionService.logInToFacebook)).toBe(true);
		});

		it('UserSessionService should have a fetchUserByFacebookId method', function () {
			expect(angular.isFunction(userSessionService.fetchUserByFacebookId)).toBe(true);
		});

		it('UserSessionService should have a fetchPublicProfileFromFacebook method', function () {
			expect(angular.isFunction(userSessionService.fetchPublicProfileFromFacebook)).toBe(true);
		});

		it('UserSessionService should have a updateFacebookToken method', function () {
			expect(angular.isFunction(userSessionService.updateFacebookToken)).toBe(true);
		});
	});


	// ----------------------- GetDialog Tests ---------------------------//

	describe("UserSessionService GetDialog Tests", function(){
		// getDialog Test : returns null for unidentified user action
		it('getDialog should return null when user action is not login or sign-up', function (){
			var returnedForUnidentifiedAction = userSessionService.getDialog('invalid action');

			expect(returnedForUnidentifiedAction).toEqual(null);
		});

		// getDialog Test : returns login template and controller json object for login user action
		it('getDialog should return login template and controller when user action is login', function (){
			var expectedForLoginAction =  {templateUrl : '../OutdoorsyLogin/OutdoorsyLogin.html',
                						   controller : 'OutdoorsyLoginController'};

		    var returnedObjectForLoginAction = userSessionService.getDialog('login');

		    expect(returnedObjectForLoginAction).toEqual(expectedForLoginAction);
		});

		// getDialog Test : returns sign-up template and controller json object for sign-up user action
		it('getDialog should return sign-up template and controller when user action is sign-up', function (){
			var expectedForSignUpAction = {templateUrl : '../OutdoorsySignUp/OutdoorsySignUp.html',
                						   controller : 'OutdoorsySignUpController'};

			var returnedObjectForSignUpAction = userSessionService.getDialog('signUp');

		    expect(returnedObjectForSignUpAction).toEqual(expectedForSignUpAction);

		});
	});

	// ----------------------- LoginUsingEmail Tests ---------------------------//

	describe("UserSessionService LoginUsingEmail Tests", function(){
		var dummyUserInDB = {email:'testUser@email.com',password:'testPassword'};

		var checkCredsHelper = function (credsInput){
			if(credsInput.email === dummyUserInDB.email && credsInput.password === dummyUserInDB.password)
				return '200';

			return '401';
		}
		
		// loginUsingEmail should pass if there is an email and password match
		it('LoginUsingEmail should pass when there is a credentials match', function(){
			var credentialsToTest = {email:'testUser@email.com',password:'testPassword'};

			httpMock.expectPOST('/loginUsingEmail', credentialsToTest)
				.respond(checkCredsHelper(credentialsToTest));

			var loginUsingEmailPromise = userSessionService.loginUsingEmail(credentialsToTest);

			var loginResult;
			loginUsingEmailPromise.then(function(response){
				loginResult = response;
			});

			httpMock.flush();

			expect(loginResult.data).toEqual('200');
		});

		// loginUsingEmail should fail if there is an email and password mismatch
		it('LoginUsingEmail should fail when there is a credentials mis-match', function(){
			var credentialsToTest = {email:'wrongEmail@email.com', password:'wrongPassword'};

			httpMock.expectPOST('/loginUsingEmail', credentialsToTest)
				.respond(checkCredsHelper(credentialsToTest));

			var loginUsingEmailPromise = userSessionService.loginUsingEmail(credentialsToTest);

			var loginResult;
			loginUsingEmailPromise.then(function(response){
				loginResult = response;
			});

			httpMock.flush();

			expect(loginResult.data).toEqual('401');
		});

		// loginUsingEmail should return null without making a post call if user to login is undefined or null
		it('LoginUsingEmail should return null if user to login is undefined or null', function(){
			var loginUsingEmailPromise = userSessionService.loginUsingEmail(null);
			expect(loginUsingEmailPromise).toEqual(null);
		});
	});

	// ----------------------- SignUpUsingEmail Tests ---------------------------//

	describe("UserSessionService SignUpUsingEmail Tests", function(){

		// signUpUsingEmail should return the user object back on successful signup
		it('SignUpUsingEmail should return the User Object on successful sign-up', function(){
			var userToSignUp = {email:'testUser@email.com',password:'testPassword'};

			httpMock.expectPOST('/signUpUsingEmail', userToSignUp)
				.respond(userToSignUp);

			var signUpUsingEmailPromise = userSessionService.signUpUsingEmail(userToSignUp);

			var signUpResult;
			signUpUsingEmailPromise.then(function(response){
				signUpResult = response;
			});

			httpMock.flush();

			expect(signUpResult.data).toEqual(userToSignUp);
		});

		// signUpUsingEmail should return null without making a post call if user to signUp is undefined or null
		it('LoginUsingEmail should return null if user to login is undefined or null', function(){
			var signUpUsingEmailPromise = userSessionService.signUpUsingEmail(undefined);
			expect(signUpUsingEmailPromise).toEqual(null);
		});
	});

	// ----------------------- MaintainUserSession Tests ---------------------------//

	describe("UserSessionService MaintainUserSession Tests", function(){

		// MaintainUserSession should return a user object if there is a user in session
		it('MaintainUserSession should return a user object if there is a user in session', function(){
			var userInSession = {email:'testUser@email.com',password:'testPassword'};

			httpMock.expectGET('/getUserInSession').respond(userInSession);

			var maintainUserSessionPromise = userSessionService.maintainUserSession();

			var userInSessionRes;
			maintainUserSessionPromise.then(function(response){
				userInSessionRes = response;
			});

			httpMock.flush();

			expect(userInSessionRes.data).toEqual(userInSession);
		});

		// MaintainUserSession should return a 401 Unauthorized if there is no user in session
		it('MaintainUserSession should return a 401 Unauthorized if there is no user in session', function(){

			httpMock.expectGET('/getUserInSession').respond('401 Unauthorized');

			var maintainUserSessionPromise = userSessionService.maintainUserSession();
			
			var userInSessionRes;
			maintainUserSessionPromise.then(function(response){
				userInSessionRes = response;
			});

			httpMock.flush();

			expect(userInSessionRes.data).toEqual('401 Unauthorized');
		});		
	});

	// ----------------------- fetchUserByFacebookId Tests ---------------------------//

	describe("fetchUserByFacebookId Tests", function (){

		it("fetchUserByFacebookId should return null if userID is undefined or null", function(){

			var fetchUserByFacebookIdPromise = userSessionService.fetchUserByFacebookId(undefined);

			expect(fetchUserByFacebookIdPromise).toBe(null);
		});

		it("fetchUserByFacebookId should return success reponse if server returns a success response with user object", function (){
			var dummyUserIdInDB = "10120029384093";
			var userInDB = {firstName:'abc',lastName:'xyz',facebookId:dummyUserIdInDB};

			httpMock.expectGET('/fetchFBUser/' + dummyUserIdInDB)
				.respond(userInDB);

			var fetchUserByFacebookIdPromise = userSessionService.fetchUserByFacebookId(dummyUserIdInDB);

			var fetchUserByFacebookIdResponse;
			fetchUserByFacebookIdPromise.then(function (response){
				fetchUserByFacebookIdResponse = response;
			});

			httpMock.flush();

			expect(fetchUserByFacebookIdResponse.data).toEqual(userInDB);
		});


		it("fetchUserByFacebookId should return error reponse if server returns a error response", function (){
			var dummyUserIdInDB = "10120029384093";

			httpMock.expectGET('/fetchFBUser/' + dummyUserIdInDB)
				.respond(503, {"status": "Service Unavailable"});

			var fetchUserByFacebookIdPromise = userSessionService.fetchUserByFacebookId(dummyUserIdInDB);

			var fetchUserByFacebookIdResponse;
			fetchUserByFacebookIdPromise.then(function (response){
				// will go into error
			},
			function (err){
				fetchUserByFacebookIdResponse = err;
			});

			httpMock.flush();

			expect(fetchUserByFacebookIdResponse.data).toEqual({"status": "Service Unavailable"});
			expect(fetchUserByFacebookIdResponse.status).toEqual(503);
		});
	});


	// ----------------------- updateFacebookToken Tests ---------------------------//

	describe("updateFacebookToken Tests", function (){

		it("updateFacebookToken should return null if either userID or newAccessToken is null or undefined", function (){

			// newAccessToken undefined
			var updateFacebookTokenRes = userSessionService.updateFacebookToken("101920313", undefined);

			expect(updateFacebookTokenRes).toEqual(null);

			// userID undefined
			updateFacebookTokenRes = userSessionService.updateFacebookToken(undefined, "12038saznxcjasd2193");

			expect(updateFacebookTokenRes).toEqual(null);
		});


		it("updateFacebookToken should return success reponse if server returns a success response with updated user object", function (){
			var dummyUserIdInDB = "10120029384093";
			var userInDBWithUpdatedToken = {firstName:'abc',lastName:'xyz',facebookId:dummyUserIdInDB, facebookToken:'myNewToken_sczxcasd'};

			httpMock.expectPUT('/updateFacebookAccessToken/' + dummyUserIdInDB, {accessToken:'myNewToken_sczxcasd'})
				.respond(userInDBWithUpdatedToken);

			var updateFacebookTokenPromise = userSessionService.updateFacebookToken(dummyUserIdInDB, "myNewToken_sczxcasd");

			var updateFacebookTokenResponse;
			updateFacebookTokenPromise.then(function (response){
				updateFacebookTokenResponse = response;
			});

			httpMock.flush();

			expect(updateFacebookTokenResponse.data).toEqual(userInDBWithUpdatedToken);
		});


		it("updateFacebookToken should return error reponse if server returns a error response", function (){
			var dummyUserIdInDB = "10120029384093";

			httpMock.expectPUT('/updateFacebookAccessToken/' + dummyUserIdInDB, {accessToken:'myNewToken_sczxcasd'})
				.respond(503, {"status": "Service Unavailable"});

			var updateFacebookTokenPromise = userSessionService.updateFacebookToken(dummyUserIdInDB, "myNewToken_sczxcasd");

			var updateFacebookTokenResponse;
			updateFacebookTokenPromise.then(function (response){
				// will go into error
			},
			function (err){
				updateFacebookTokenResponse = err;
			});

			httpMock.flush();

			expect(updateFacebookTokenResponse.data).toEqual({"status": "Service Unavailable"});
			expect(updateFacebookTokenResponse.status).toEqual(503);
		});
	});
});