app.factory("UIServices", function (){

	UIServices = {};

	// function to show message to user
    UIServices.showMessageToUser = function (message){
        $.alert({
            title: "<img src='../OutdoorsyApp/staticfiles/messageIcon.png'>",
            theme: 'supervan',
            content: message,
            autoClose: 'confirm|8000',
        });

    };

    // function to hide and show spinner
    UIServices.spinnerOnPage = function(showSpinner){
    	if(showSpinner){
    		$("#spinnerDiv").show();
    	}else{
    		$("#spinnerDiv").hide();
    	}
    };

    UIServices.takeUserConfirmation = function (message, confirmCallBack, cancelCallBack){
        return $.confirm({
            title: "<img src='../OutdoorsyApp/staticfiles/confirmation.png'>",
            theme: 'supervan',
            confirmButton: 'Confirm',
            cancelButton: 'Cancel',
            content: message,
            confirm : confirmCallBack,
            cancel : cancelCallBack
        });
    };

    // function to show error message to user
    UIServices.showErrorToUser = function (message){
        $.alert({
            title: "<img src='../OutdoorsyApp/staticfiles/errorIcon.png'>",
            theme: 'supervan',
            content: message,
        });
    };

    UIServices.resetUI = function (){
        UIServices.spinnerOnPage(false);
    };

    return UIServices;
});