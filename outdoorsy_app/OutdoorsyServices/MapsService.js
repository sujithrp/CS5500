/*
	Google Maps Geocoding API Service provides the postal code address for the provided latitude and longitude
*/
app.service("MapsService", function ($http, $q, UIServices) {


    /*
    * Fetches The Address text From Search box
    * @return {json object} location
    */
    this.getReverseAddress = function (location) {
        //Always have the deferred object local to the function and not global to avoid values being overwritten (Happens when the function is called multiple times)
        var formattedAddressDeferred = $q.defer();
        var geocodeAPIBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        if(location == "") {
            // Default location WVH CCIS
            location = "Default location set to \'440 Huntington Ave, Boston, MA 02115\'";
            UIServices.showMessageToUser(location);
        }
        var geocodeAPIURL = geocodeAPIBaseURL + location;
        return $http.get(geocodeAPIURL).
            then(function (response) {
                if(response.data.results.length>0){
                    formattedAddressDeferred.resolve(response.data.results[0].geometry.location);
                }
                // Default Location WVH CCIS
                else{
                    formattedAddressDeferred.resolve({"lat" : "42.338666", "lng" : "-71.092241"});
                }
                return formattedAddressDeferred.promise;
            }, function (error) {
                formattedAddressDeferred.reject(error);
                return formattedAddressDeferred.promise;
            }
        );
    }; // End of getReverseAddress(location)


	/*
    * Fetches The Formatted Address From Google Maps Geocoding API Based Upon Povided Latitude and Longitude
    * @param {Number} userLatitude
    * @param {Number} userLongitude
    * @return {String} formatted_address
    */
    this.getFormattedAddress = function (userLatitude, userLongitude) {
    //Always have the deferred object local to the function and not global to avoid values being overwritten (Happens when the function is called multiple times)
    var formattedAddressDeferred = $q.defer();
	var geocodeAPIBaseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	var geocodeAPIURL = geocodeAPIBaseURL + userLatitude + "," + userLongitude;
        return $http.get(geocodeAPIURL)
            .then(function (response) {
                if(response.data.results.length>0){
                    formattedAddressDeferred.resolve(response.data.results[0].formatted_address);
                }
                else{           
                    formattedAddressDeferred.resolve(response.data);
                }
                return formattedAddressDeferred.promise;
            }, function (error) {
                formattedAddressDeferred.reject(error);
                return formattedAddressDeferred.promise;
            });
    }; // End of getFormattedAddress(userLatitude, userLongitude)



    /*
    * Fetches The InfoWindow For The Map Markers
    * @return {google.maps.InfoWindow} infoWindow
    */
    this.getInfoWindow = function(){
        var infoWindow = new google.maps.InfoWindow();
        return infoWindow;
    } // End of getInfoWindow()


    /*
    * Fetches The Formatted Address From Google Maps Geocoding API Based Upon Povided Latitude and Longitude
    * @param {String} mapDivID
    * @return {google map object} map
    */
    this.getMap = function(mapDivID) {
        var map = new google.maps.Map(document.getElementById(mapDivID), {
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        return map;
    } // End of getMap(mapDivID)


    /*
    * Plots the User Location Over Google Maps and Then Adds MouseOver Listener
    * @param {Number} userLatitude
    * @param {Number} userLongitude
    * @param {google.maps.InfoWindow} infowindow
    * @param {google map object} map
    */
    this.plotUserLocation = function(userLatitude, userLongitude, infowindow, map){
        // Plot The Current User Location
        var userLatLng = new google.maps.LatLng(userLatitude, userLongitude);
        // Custom Image For Easy Identification To User In The Google Maps
        var userLocationImage = new google.maps.MarkerImage(
            '../OutdoorsyMapUI/staticfiles/mapicons/UserPosition.png',
            null, // size
            null, // origin
            new google.maps.Point(8, 8), // anchor (move to center of marker)
            new google.maps.Size(17, 17) // scaled size (required for Retina display icon)
        );

        // User Marker Creation
        var userMarker = new google.maps.Marker({
            flat: true,
            icon: userLocationImage,
            map: map,
            animation: google.maps.Animation.DROP,
            optimized: false,
            position: userLatLng,
            visible: true
        });   

        // Add MouseOver Listener For The User Markers
        google.maps.event.addListener(userMarker, 'mouseover', function () {
            var toolTipImage = "<img BORDER='0' ALIGN='Left' src='../OutdoorsyMapUI/staticfiles/mapicons/UserPositionToolTip.png'>";
            infowindow.setContent(toolTipImage + '&nbsp; <strong> I might be here </strong>');
            infowindow.open(map, this);
        });

        // Set The Map Center To User Location
        map.setCenter(userLatLng);     
    } // End of plotUserLocation(userLatitude, userLongitude, infowindow, map)


}); // End of MapsService
