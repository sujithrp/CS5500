app.controller("OutdoorsyLoginController",function($scope, ngDialog) {
	

	$scope.openSignUpDialog = function(){
		$scope.closeThisDialog({
			action:'openSignUpDialog'
		});
	};

	$scope.loginUsingEmail = function(User){
		if(User){
			$scope.closeThisDialog({action:'loginUsingEmail', user: User});
		}
	};

	$scope.loginWithFacebook = function(){
		$scope.closeThisDialog({
			action:'connectWithFacebook',
			errorAction: 'openLoginDialog'
		});
	};
});