
app.factory("PreferencesService", ['$http','$q', 'EventsService', function ($http, $q, EventsService){
	var PreferencesService = {};
	var prefDeferred = $q.defer();

    // function to show preferences
    PreferencesService.togglePreferences = function (toShow){
    	if(toShow){
            $("body").css("overflow","visible");
        	$('#userPreferences').bPopup({easing: 'easeOutBack', 
                speed: 850, 
                transition: 'slideIn', 
                follow:[true, false], 
                position : ["auto", 20],
                height: 200,
                scrollBar : true});
        }else{
        	$('#userPreferences').bPopup().close();
        }
    };

    PreferencesService.updateUserPreferences = function (userToUpdate){
        if(userToUpdate){
            return $http.put('/updatePreferences/' + userToUpdate._id, userToUpdate)    
        }

    	return null;
    };

    PreferencesService.fetchCategories = function (){
        return $http.get('/categories');
    };

    return PreferencesService;
}]);