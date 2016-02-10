describe("OutdoorsySignUpController Tests", function(){
	var $rootScope, $scope, controller, ngDialogMock;

	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			ngDialogMock = $injector.get('ngDialog');
			controller = $injector.get('$controller')("OutdoorsySignUpController", {$scope: $scope, ngDialog : ngDialogMock});
		});
	});

	// -------------------- Scope Initialization Tests -------------------------//
	describe("Initialization", function(){

		it("userSignUpErr should be false when scope of controller is initialized", function(){
			expect($scope.userSignUpErr).toBe(false);
		});
	});

	//--------------------- Validate Sign Up Details Tests ----------------------//

	describe("validateSignUpDetails Tests", function(){
		// validate password which is less than 5 characters long
		it("validateSignUpDetails should return false when password is less than 5 characters long", function(){
			var passwordToTest = "abc";

			var actualResult = $scope.validateSignUpDetails(passwordToTest);

			expect(actualResult).not.toBe(true);
		});

		// validate password which contains special characters
		it("validateSignUpDetails should return false when password contains special characters", function(){
			var passwordToTest = "abcdef#$%";

			var actualResult = $scope.validateSignUpDetails(passwordToTest);

			expect(actualResult).not.toBe(true);
		});

		// validate password which satisfies all necessary password requirements
		it("validateSignUpDetails should return false when password satisfies all passoword requirements", function(){
			var passwordToTest = "abcDEFG919";

			var actualResult = $scope.validateSignUpDetails(passwordToTest);

			expect(actualResult).toBe(true);
		});
	});

	//--------------------- SignUpUser Tests ---------------------------//

	describe("signUpUser Tests", function(){
		
		it("signUpUser should set userSignUpErr to true if validation fails", function(){
			var dummyUserWithIncorrectPwd = {email: 'testuser@email.com', password: 'abc#$%'};

			$scope.signUpUser(dummyUserWithIncorrectPwd);

			expect($scope.userSignUpErr).toBe(true);
		});
	});
});