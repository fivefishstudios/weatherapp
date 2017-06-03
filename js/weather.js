
// use Google Maps API to get Lat/Long via HTML5 geolocation
var map, infoWindow, myLat, myLng;

function getWeater(myLat, myLng){
  $.ajax({
        method: "GET",
        url: "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather",
        // API key is required, assign to appid
        data: { lat: myLat, lon: myLng, appid: '0ba5350ff17a90b6f0b3bb63cf06f3a9' }
      })
      .done(function( msg ) {
        // after successful call, we can now display values back to html page
        var weather = msg;

        // user's named location
        $('#city').text(weather.name);

        // convert Kelvin to Fahrenheit, display as temperature
        var tempF = parseFloat(weather.main.temp) * (9/5) - 459.67;
        $('#temp').html('Temperature: ' + tempF.toFixed(2) + ' &#8457;');

        // humidity in percent
        $('#humidity').text(weather.main.humidity + '% Humidity' );

        // wind, convert m/sec to MPH
        $('#windspeed').text('Wind: ' + (parseFloat(weather.wind.speed) * 2.2369).toFixed(2) + ' MPH at ' + parseFloat(weather.wind.deg).toFixed(1) + ' degrees');

        // textual description of weather at user's location
        $('#desc').text('Forecast is ' + weather.weather[0].main + ', ' + weather.weather[0].description);

        // icon
        var subIcon = weather.weather[0].icon;
        var iconImage = parseInt(weather.weather[0].id) + parseInt(subIcon);
        // determine if day or night....
        iconImage = 'owf-' + iconImage + "-" + subIcon[subIcon.length - 1];
        $('#weathericon').html('<i class="owf owf-5x  ' + iconImage + '"></i>');
      }); // end of ajax call 
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12
    // for now, don't allow user to pan the map. 
    // draggable: false, 
    // zoomControl: false, 
    // scrollwheel: false, 
    // disableDoubleClickZoom: true
  });
  

  // if user drags the map and changed location, display weather report on new location
  map.addListener('dragend', function(){
      // alert(map.getCenter());
      pos = map.getCenter();
      // alert('new pos ' + pos);
      
      // new location after dragging
      myLat = pos.lat;
      myLng = pos.lng;
    
      getWeater(myLat, myLng);
  })
  
  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // this is the user's location
      myLat = pos.lat;
      myLng = pos.lng;

      // display user's location as center of map
      map.setCenter(pos);

      // now that we know user's location, get the weather info by calling weather api
      // use https://crossorigin.me/some-http-url to allow http access from https origin
      // alternative: https://cors-anywhere.herokuapp.com/      
      getWeater(myLat, myLng);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

