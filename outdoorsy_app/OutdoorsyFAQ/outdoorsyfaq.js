app.controller('OutdoorsyFAQController', function($scope, $location){

	$("#faqTabs").tabs({ show: { effect: "fade", duration: 400 } });

	$("#homeAccordion, #signUpAccordion, #accountAccordian, #preferencesAccordian, #mapsAccordian, #eventsAccordian").accordion();	
});
