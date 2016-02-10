// ********** Unable to mock an open ngDialog in Karma (Tests Pending)*************//
describe("Outdoorsy Login Controller Test Suites", function (){
	var $rootScope, $scope, controller, ngDialog, openDialog; 

	beforeEach(function(){

		// instantiate module
		module('OutdoorsyApp');

		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			ngDialog = $injector.get('ngDialog');
			$scope = $rootScope.$new();
			controller = $injector.get('$controller')("OutdoorsyLoginController", {$scope: $scope, ngDialog : ngDialog});
		});
                	
		openDialog = ngDialog.open({
            className: 'ngdialog-theme-default',
            controller: controller,
            scope: $scope
        });
	});


	// open signUp Dialog
	describe("Open Sign Up Dialog Tests", function (){
		it("openSignUpDialog should close the login dialog with an action that will eventually toggle signUp Dialog", function (){
			

		});

	});
});