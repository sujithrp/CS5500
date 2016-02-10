app.controller("OutdoorsySignUpController",function($scope, ngDialog) {
	$scope.userSignUpErr = false;


	$scope.validateSignUpDetails = function(password){
        var alphanumeric = /^[0-9a-zA-Z]+$/;

        if (password.length < 5) {
            $("#pwd").css("border", "1px solid red");
            $("#errorMsgLabel").text("Password: (Password not 5 characters long)");
            return false;
        } else {
            $("#pwd").css("border", "1px");
        }

        if (password.match(alphanumeric)) {
            $("#pwd").css("border", "1px");
        } else {
            $("#pwd").css("border", "1px solid red");
            $("#errorMsgLabel").text("Password: (Password can be alpha-numeric only)");
            return false;
        }
        return true;
	}

	$scope.signUpUser = function(User){
		$scope.userSignUpErr = false;
		
		if($scope.validateSignUpDetails(User.password)){
			$scope.userSignUpErr = false;			
			
			// set account activated to false on signup..let user go to email and activate their account.
			User.accountActivated = false;

			$scope.closeThisDialog({action:'signUpUsingEmail', user: User});
		}else{
			$scope.userSignUpErr = true;
		}
	};

	$scope.openLoginDialog = function() {
		$scope.closeThisDialog({
			action:'openLoginDialog'
		});
	}

	$scope.signUpWithFacebook = function(){
		$scope.closeThisDialog({
			action:'connectWithFacebook',
			errorAction:'openSignUpDialog'
		});	
	};
});