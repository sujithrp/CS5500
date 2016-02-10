// ****************** Unable to write tests due to google maps component:undefined, could not find workaround ************//
describe("Outdoorsy Events Test Suite", function (){
	var $rootScope, $location, $scope, controller, localStorageService;

	beforeEach(function(){

		// instantiate module
		module('OutdoorsyApp');

		inject(function($injector){
			$rootScope = $injector.get('$rootScope');
			$rootScope.eventSelected = {
	            "name": {
	                "text": "MIT Sloan Sports Analytics Conference 2016", 
	                "html": "MIT Sloan Sports Analytics Conference 2016"
	            }, 
	            "description": {
	                "text": "Partial refunds will be granted for all requests submitted prior to January 30th. For more information on the conference, visit our\u00a0FAQ\u00a0page or\u00a0contact us. \n\u00a0 \nIf you are a media outlet looking to cover this year\u2019s conference, please contact\u00a0Media@sloansportsconference.com\u00a0for approval and a special rate. \n  \nNote: There will be no walk-up sales during the Conference.\u00a0 \n\u00a0 \nTERMS AND CONDITIONS: \nBy purchasing, accepting, holding, or using a ticket to the MIT Sloan Sports Analytics Conference (the \u201cConference\u201d), you certify that you have read, understood and accepted, and agreed to be bound by and to comply with, the terms and conditions (the \u201cTerms and Conditions\u201d) set forth below: \n\nYou hereby release and forever discharge and hold harmless 42 Analytics Educational, Inc. (\u201c42 Analytics\u201d), its employees, owners, directors, agents, and affiliated entities (the \u201cReleased Parties\u201d) from any and all liability, claims, and demands which you or your heirs, assigns, next of kin or legal representatives have which arise from your participation in the Conference, whether caused wholly or in part by the negligence, fault, or other misconduct (other than intentional or grossly negligent conduct) of any of the Released Parties.\nYou consent to being photographed, videotaped, and/or recorded (by audio, visual and/or other means) by 42 Analytics and irrevocably consent to and authorize 42 Analytics, its successors, assigns, licensees, and media partners to include your likeness, mannerisms, and voice in its publications and marketing materials, for worldwide exploitation, in perpetuity in any and all media, without any credit or payment to you.\u00a0 All photographs and sound recordings shall become the sole property of 42 Analytics.\u00a0 You hereby release 42 Analytics, its successors, assigns, licensees, media partners and designees from any and all liability on account of such usage.\nYou will not bring into, use, wear or display within the Conference any sponsorship, promotional, or marketing materials, except as expressly authorized by 42 Analytics.\nYou shall not capture, log, record, transmit, play, issue, show or otherwise communicate any material in relation to the Conference, nor may you bring into the Conference any equipment or technology which is capable of recording such material without the express written consent of 42 Analytics.\nMobile telephones and other mobile devices are permitted at the Conference provided that (a) they are used for personal and private use only, and (b) no material that is captured by a mobile telephone or other mobile device may be published or otherwise made available to any third parties, including, without limitation, via social networking sites.\nAll copyrights in and to all audio, visual, and video recordings of the MIT Sloan Sports Analytics Conference are the sole and exclusive property of 42 Analytics.\nTickets cannot be transferred or sold. Any unlicensed person reselling tickets by any method is subject to loss of ticket privileges. Tickets resold in violation of these privileges are void without notice or refund. \nStudents under 16 years of age are not allowed to attend the conference unaccompanied and will not be admitted without a ticketed guardian over 21 years of age.\nPartial refunds of 50% will be issued up to and including November 30th, 2015, and 25% up to and including January 31st, 2016. Refunds will only be offered for general admission tickets.\n42 Analytics reserves the right to deny entry or remove from the Conference facilities any person who in its sole and absolute discretion is behaving or threatening to behave in a manner which we reasonably consider to be disruptive of the event.\n42 Analytics reserves the right to make changes to any of these Terms and Conditions.\n\nYou will comply with all rules and regulations of the Conference and the facilities in which the Conference is held. ", 
	                "html": "<P STYLE=\"text-align: left;\">Partial refunds will be granted for all requests submitted prior to January 30th. For more information on the conference, visit our\u00a0<SPAN STYLE=\"text-decoration: underline;\"><STRONG><A HREF=\"http://www.sloansportsconference.com/?page_id=12351\" TARGET=\"_blank\" REL=\"nofollow\">FAQ<\/A><\/STRONG><\/SPAN>\u00a0page or\u00a0<SPAN STYLE=\"text-decoration: underline;\"><STRONG><A HREF=\"http://www.sloansportsconference.com/?p=2453\" TARGET=\"_blank\" REL=\"nofollow\">contact us<\/A><\/STRONG><\/SPAN>.<\/P>\r\n<P STYLE=\"text-align: left;\">\u00a0<\/P>\r\n<P STYLE=\"text-align: left;\">If you are a media outlet looking to cover this year\u2019s conference, please contact\u00a0<SPAN STYLE=\"text-decoration: underline;\"><STRONG><A HREF=\"http://www.sloansportsconference.com/Media@sloansportsconference.com\" TARGET=\"_blank\" REL=\"nofollow\">Media@sloansportsconference.com<\/A><\/STRONG><\/SPAN>\u00a0for approval and a special rate.<\/P>\r\n<P STYLE=\"text-align: left;\"><STRONG><BR><\/STRONG><\/P>\r\n<P STYLE=\"text-align: left;\"><STRONG>Note: There will be no walk-up sales during the Conference.\u00a0<\/STRONG><\/P>\r\n<P STYLE=\"text-align: left;\">\u00a0<\/P>\r\n<P STYLE=\"text-align: left;\"><STRONG>TERMS AND CONDITIONS:<\/STRONG><\/P>\r\n<P STYLE=\"margin-left: 19.6pt; line-height: 115%;\"><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">By purchasing, accepting, holding, or using a ticket to the MIT Sloan Sports Analytics Conference (the \u201cConference\u201d), you certify that you have read, understood and accepted, and agreed to be bound by and to comply with, the terms and conditions (the \u201cTerms and Conditions\u201d) set forth below:<\/SPAN><\/P>\r\n<OL>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">You hereby release and forever discharge and hold harmless 42 Analytics Educational, Inc. (\u201c42 Analytics\u201d), its employees, owners, directors, agents, and affiliated entities (the \u201cReleased Parties\u201d) from any and all liability, claims, and demands which you or your heirs, assigns, next of kin or legal representatives have which arise from your participation in the Conference, whether caused wholly or in part by the negligence, fault, or other misconduct (other than intentional or grossly negligent conduct) of any of the Released Parties.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">You consent to being photographed, videotaped, and/or recorded (by audio, visual and/or other means) by 42 Analytics and irrevocably consent to and authorize 42 Analytics, its successors, assigns, licensees, and media partners to include your likeness, mannerisms, and voice in its publications and marketing materials, for worldwide exploitation, in perpetuity in any and all media, without any credit or payment to you.\u00a0 All photographs and sound recordings shall become the sole property of 42 Analytics.\u00a0 You hereby release 42 Analytics, its successors, assigns, licensees, media partners and designees from any and all liability on account of such usage.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">You will not bring into, use, wear or display within the Conference any sponsorship, promotional, or marketing materials, except as expressly authorized by 42 Analytics.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">You shall not capture, log, record, transmit, play, issue, show or otherwise communicate any material in relation to the Conference, nor may you bring into the Conference any equipment or technology which is capable of recording such material without the express written consent of 42 Analytics.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">Mobile telephones and other mobile devices are permitted at the Conference provided that (a) they are used for personal and private use only, and (b) no material that is captured by a mobile telephone or other mobile device may be published or otherwise made available to any third parties, including, without limitation, via social networking sites.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">All copyrights in and to all audio, visual, and video recordings of the MIT Sloan Sports Analytics Conference are the sole and exclusive property of 42 Analytics.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">Tickets cannot be transferred or sold. Any unlicensed person reselling tickets by any method is subject to loss of ticket privileges. Tickets resold in violation of these privileges are void without notice or refund. <\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">Students under 16 years of age are not allowed to attend the conference unaccompanied and will not be admitted without a ticketed guardian over 21 years of age.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">Partial refunds of 50% will be issued up to and including November 30th, 2015, and 25% up to and including January 31st, 2016. Refunds will only be offered for general admission tickets.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">42 Analytics reserves the right to deny entry or remove from the Conference facilities any person who in its sole and absolute discretion is behaving or threatening to behave in a manner which we reasonably consider to be disruptive of the event.<\/SPAN><\/LI>\r\n<LI><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">42 Analytics reserves the right to make changes to any of these Terms and Conditions.<\/SPAN><\/LI>\r\n<\/OL>\r\n<P STYLE=\"margin-left: 19.6pt; line-height: 115%;\"><SPAN STYLE=\"font-size: 11.0pt; line-height: 115%; font-family: 'Calibri',sans-serif;\">You will comply with all rules and regulations of the Conference and the facilities in which the Conference is held.<\/SPAN><\/P>"
	            }, 
	            "id": "18179459252", 
	            "url": "http://www.eventbrite.com/e/mit-sloan-sports-analytics-conference-2016-registration-18179459252?aff=ebapi", 
	            "start": {
	                "timezone": "America/New_York", 
	                "local": "2016-03-11T08:00:00", 
	                "utc": "2016-03-11T13:00:00Z"
	            }, 
	            "end": {
	                "timezone": "America/New_York", 
	                "local": "2016-03-12T17:30:00", 
	                "utc": "2016-03-12T22:30:00Z"
	            }, 
	            "currency": "USD",
	            "resource_uri": "https://www.eventbriteapi.com/v3/events/18179459252/", 
	            "logo": {
	                "id": "16210787", 
	                "url": "https://img.evbuc.com/https%3A%2F%2Fimg.evbuc.com%2Fhttp%253A%252F%252Fcdn.evbuc.com%252Fimages%252F16210787%252F116366047029%252F1%252Foriginal.jpg%3Frect%3D40%252C0%252C600%252C300%26s%3Df8e11563f25d161e29bfa7f8ff560eff?h=200&w=450&s=7eb4e7bd32d86ab5679857d96b892510", 
	                "aspect_ratio": "2", 
	                "edge_color": "#000000", 
	                "edge_color_set": true
	            }, 
	            "organizer": {
	                "description": null, 
	                "logo": null, 
	                "resource_uri": "https://www.eventbriteapi.com/v3/organizers/333671464/", 
	                "id": "333671464", 
	                "name": "MIT Sloan Sports Analytics Conference", 
	                "url": "http://www.eventbrite.com/o/mit-sloan-sports-analytics-conference-333671464", 
	                "num_past_events": 1, 
	                "num_future_events": 1
	            }, 
	            "venue": {
	                "address": {
	                    "address_1": "415 Summer Street", 
	                    "city": "Boston", 
	                    "region": "MA", 
	                    "postal_code": "02210-1719", 
	                    "country": "US", 
	                    "latitude": 42.3461949, 
	                    "longitude": -71.04563680000001
	                }
	            }, 
	            "ticket_classes": [
	                {
	                    "resource_uri": "https://www.eventbriteapi.com/v3/events/18179459252/ticket_classes/38329659/", 
	                    "id": "38329659", 
	                    "name": "General Admission", 
	                    "description": "Note: Refund policy has changed from last year. Partial refunds of 50% will be issued up to and including November 30th, 2015, and 25% up to and including January 31st, 2016. Refunds will only be offered for general admission tickets.", 
	                    "cost": {
	                        "currency": "USD", 
	                        "display": "$575.00", 
	                        "value": 57500
	                    }, 
	                    "fee": {
	                        "currency": "USD", 
	                        "display": "$26.63", 
	                        "value": 2663
	                    }, 
	                    "tax": {
	                        "currency": "USD", 
	                        "display": "$0.00", 
	                        "value": 0
	                    }, 
	                    "donation": false, 
	                    "free": false, 
	                    "minimum_quantity": 1, 
	                    "maximum_quantity": 10, 
	                    "maximum_quantity_per_order": 10, 
	                    "on_sale_status": "AVAILABLE", 
	                    "include_fee": false, 
	                    "hide_description": true, 
	                    "variants": [], 
	                    "has_pdf_ticket": null, 
	                    "event_id": "18179459252"
	                }
	            ]
	        };
			$scope = $rootScope.$new();
			$location = $injector.get('$location');
			localStorageService = $injector.get('localStorageService');
			controller = $injector.get('$controller')("OutdoorsyEventsController", {$scope: $scope, 
													 								$location: $location, 
													 								$rootScope : $rootScope,
													 							    localStorageService : localStorageService});
		});
	});
});