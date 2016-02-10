describe("UIServices Test Suite", function (){

	var uiServices;
	var httpMock;
	var alertSpy, confirmSpy;


	beforeEach(function(){
		// instantiate module
		module('OutdoorsyApp');

		var fixture = '<div id="spinnerDiv"></div>';

	    document.body.insertAdjacentHTML(
	      'afterbegin', 
	      fixture);

		alertSpy = spyOn($, "alert");
		confirmSpy = spyOn($, "confirm")

		// inject Service
		inject(function ($httpBackend, UIServices){
			uiServices = UIServices;
			httpMock = $httpBackend;
		});
	});


	// Initialization
	describe("Initialization Tests", function (){
		// check if the method showMessageToUser is available the service
		it('uiServices should have a showMessageToUser method', function () {
			expect(angular.isFunction(uiServices.showMessageToUser)).toBe(true);
		});

		// check if the method spinnerOnPage is available the service
		it('uiServices should have a spinnerOnPage method', function () {
			expect(angular.isFunction(uiServices.spinnerOnPage)).toBe(true);
		});

		// check if the method takeUserConfirmation is available the service
		it('uiServices should have a takeUserConfirmation method', function () {
			expect(angular.isFunction(uiServices.takeUserConfirmation)).toBe(true);
		});

		// check if the method showErrorToUser is available the service
		it('uiServices should have a showErrorToUser method', function () {
			expect(angular.isFunction(uiServices.showErrorToUser)).toBe(true);
		});
	});


	// show message to user
	describe("showMessageToUser Tests", function (){
		var expectedAlertParams = {
			title: "<img src='../OutdoorsyApp/staticfiles/messageIcon.png'>",
            theme: 'supervan',
            autoClose: 'confirm|8000',
		};

		// alert function in jquery should be called with content same as input to function
		it("alert function in jquery should be called with content same as input to function", function (){
			var message = "Sample Message"

			uiServices.showMessageToUser(message);

			expectedAlertParams.content = message;

			expect(alertSpy).toHaveBeenCalledWith(expectedAlertParams);
		});
	});


	// show confirm box to user
	describe("takeUserConfirmation Tests", function (){
		var confirmCallBack = jasmine.createSpy("confirmCallBack");
		var cancelCallBack = jasmine.createSpy("cancelCallBack");

		var expectedConfirmParams = {
            title: "<img src='../OutdoorsyApp/staticfiles/confirmation.png'>",
            theme: 'supervan',
            confirmButton: 'Confirm',
            cancelButton: 'Cancel'
        };

		// alert function in jquery should be called with content same as input to function
		it("confirm function in jquery should be called with content same as input to function as well as confirm and cancel callbacks", function (){
			var message = "Are you sure?";

			uiServices.takeUserConfirmation(message, confirmCallBack, cancelCallBack);

			expectedConfirmParams.content = message;
			expectedConfirmParams.confirm = confirmCallBack;
            expectedConfirmParams.cancel = cancelCallBack;

			expect(confirmSpy).toHaveBeenCalledWith(expectedConfirmParams);
		});
	});

	// showErrorToUser
	describe("showErrorToUser Tests", function (){
		var expectedAlertParams = {
            title: "<img src='../OutdoorsyApp/staticfiles/errorIcon.png'>",
            theme: 'supervan',
        };

		// alert function in jquery should be called with content same as input to function
		it("alert function in jquery should be called with content same as input to function", function (){
			var message = "Sample Message";

			uiServices.showErrorToUser(message);

			expectedAlertParams.content = message;

			expect(alertSpy).toHaveBeenCalledWith(expectedAlertParams);
		});
	});

	//spinnerOnPage
	describe("spinnerOnPage", function (){

		// if input is true, spinner is shown on page
		it("UIServices should show a spinner on page if input to spinnerOnPage is true", function (){
			// hide spinner initially
			$("#spinnerDiv").hide();

			expect($("#spinnerDiv").css("display")).toBe('none');

			uiServices.spinnerOnPage(true);

			
			expect($("#spinnerDiv").css("display")).toBe('block');
		});

		// if input is false, spinner should be hidden on page
		it("UIServices should hide the spinner on page if input to spinnerOnPage is false", function (){
			// show spinner initially
			$("#spinnerDiv").show();

			expect($("#spinnerDiv").css("display")).toBe('block');
			
			uiServices.spinnerOnPage(false);
			
			expect($("#spinnerDiv").css("display")).toBe('none');
		});
	});
});