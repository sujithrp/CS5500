/*
	EventBrite API Service provides getEvents and getVenue functions to fetch the event details from EventBrite API Endpoints
*/
app.service("EventsService", ['$http',function ($http) {

    EventsService = {};

    /*
    * Fetches The Events From EventBrite API based upon the query params
    * @param {var} queryParams
    * @return {JSON} events
    */
    EventsService.fetchEvents = function (queryParams){
        if(queryParams){
            var eventsURL = "https://www.eventbriteapi.com/v3/events/search/?" + $.param(queryParams);
            
            return $http.get(eventsURL);
        }

        return null;
    };

    /*
    * Fetches The SubCategories From EventBrite API based upon the query params
    * @param {var} category
    * @return {JSON} subCategories
    */
    EventsService.fetchSubCategories = function (category){
        var queryParams = {"token":"XW7DPWWVG6SQUX2ZKMNW"};
        return $http.get("https://www.eventbriteapi.com/v3/categories/" + category  + "/?"+ $.param(queryParams))
                    
    };

    return EventsService;

}]); // End of EventsService