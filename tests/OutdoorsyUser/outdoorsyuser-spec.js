// *********** Partial Tests - complete in next release ************* //
describe("OutdoorsyUserController Test Suite", function (){

	var $rootScope, $location, $scope, controller;

	beforeEach(function(){

		// instantiate module
		module('OutdoorsyApp');

		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$scope = $rootScope.$new();
			$location = $injector.get('$location');
			controller = $injector.get('$controller')("OutdoorsyUserController", {$scope: $scope, 
													 								  $location: $location});

			$location.path('/user');
		});
	});


	describe("Initialization Tests", function(){
		// initially user profile should be readonly
		it("user details on profile page should be in read only mode initially", function (){
			expect($scope.readOnlyMode).toEqual(true);
		});

		// password should also be readonly
		it("password on profile page should be in read only mode initially", function (){
			expect($scope.passwordReadOnly).toEqual(true);
		});

		// user interests should be empty
		it("userInterests should be empty initially", function (){
			expect($scope.userInterests.length).toEqual(0);
		})
	});


	// fetchAllUserInterests tests
	describe("fetchAllUserInterests Tests", function (){
		
		// fetchAllUserInterests should not set any user interests if current user or his preferences are null
		it("fetchAllUserInterests should not set any user interests if current user or his preferences are null", function (){
			// preferences is null
			$rootScope.currentUser = {
				firstName : "Admin",
				lastName : "Admin", 
				email : "admin@gmail.com",
				password : "admin",
				preferences :{}
			}

			$scope.fetchAllUserInterests();

			expect($scope.userInterests.length).toEqual(0);
		});

		// fetchAllUserInterests should not set any user interests if categories in db are null
		it("fetchAllUserInterests should not set any user interests if categories in db are null", function (){
			$rootScope.currentUser = {
				firstName : "Admin",
				lastName : "Admin", 
				email : "admin@gmail.com",
				password : "admin",
				preferences :{
					subCategories : ["8001", "8002"]
				}
			}

			$rootScope.Categories = [];

			$scope.fetchAllUserInterests();

			expect($scope.userInterests.length).toEqual(0);
		});


		// fetchAllUserInterests should set user interests if current user or his preferences are not null and categories is 
		// also not null.
		it("fetchAllUserInterests should set user interests if current user or his preferences are not null", function (){
			$rootScope.currentUser = {
				firstName : "Admin",
				lastName : "Admin", 
				email : "admin@gmail.com",
				password : "admin",
				preferences :{
					subCategories : ["8001", "8002"]
				}
			}

			$rootScope.Categories =  [{
				categoryName : "Sports & Fitness",
				categoryId : "108",
				subCategories : [{
					subCategoryName : "Running",
					subCategoryId : "8001"
				},
				{
					subCategoryName : "Cycling",
					subCategoryId : "8002"
				}]
			}];

			$scope.fetchAllUserInterests();

			expect($scope.userInterests.length).toEqual(1);

			expect($scope.userInterests[0].categoryName).toEqual("Sports & Fitness");

			expect($scope.userInterests[0].interests).toEqual(["Running","Cycling"]);
		});
	});


	// editProfile tests
	describe("editProfile Tests", function (){
		it("editProfile should make the user profile details editable by setting readOnly property to false", function (){
			// initially readonly is true
			expect($scope.readOnlyMode).toEqual(true);

			$scope.editProfile();
			
			// now the profile should be editable
			expect($scope.readOnlyMode).toEqual(false);
		});
	});

});