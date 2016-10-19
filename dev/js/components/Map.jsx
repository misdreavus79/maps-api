import React from "react";
import ReactDOM from "react-dom";
import GoogleMapsLoader from 'google-maps';
import $ from 'jquery';
import options from './Options';

GoogleMapsLoader.KEY = 'AIzaSyAB7r33BhATA6R6-UiifezDB4CM5ZMRdco';

class Map extends React.Component {
	constructor(){
		super();
	}

	componentDidMount(){
		GoogleMapsLoader.load((google) => {
			console.log(google.maps.Geocoder);
			let mapDiv = ReactDOM.findDOMNode(this.refs.map),
				minZoomLevel = 5,
				map = new google.maps.Map(mapDiv, options);

				map.data.loadGeoJson('http://localhost:3000/fit-for-the-cure/assets/events-4.json'); //change this to addGeoJson once you're ready

			let infowindow = new google.maps.InfoWindow();

			// When the user clicks, open an infowindow
			map.data.addListener('click', function(event) {
				let eventInfo = {
					date: event.feature.getProperty("date"),
					start_time: event.feature.getProperty("start_time"),
					end_time: event.feature.getProperty("end_time"),
					store_name: event.feature.getProperty("store_name"),
					address1: event.feature.getProperty("address1"),
					address2: event.feature.getProperty("address2"),
					city: event.feature.getProperty("city"),
					state: event.feature.getProperty("state"),
					zip: event.feature.getProperty("zip"),
				};
				
				infowindow.setContent(`<div class="location">
									   	<span class="title">${eventInfo.city}, ${eventInfo.state}</span>
									   	<section>
											<p class="address">${eventInfo.store_name}</p>
											<p class="address">${eventInfo.address1}</p>
											<p class="address">${eventInfo.address2}</p>
											<p class="address">${eventInfo.city}, ${eventInfo.state} ${eventInfo.zip}</p>
											<a href="http://www1.macys.com/shop/store/search?location=${eventInfo.zip}" class="storeLocator" target="_blank"><img src="http://misd.info/cards/shapes/circle-red.png"></a>
										</section>
									</div>`
				);
				infowindow.setPosition(event.feature.getGeometry().get());
				infowindow.setOptions({pixelOffset: new google.maps.Size(0,-30)});
				infowindow.open(map);
			});
			map.data.setStyle({
				icon: assetsUrl + '/images/marker.png'
			});

			// Bounds for North America --probably not necessary (definitely not necessary)
			let strictBounds = new google.maps.LatLngBounds(
				new google.maps.LatLng(28.70, -127.50), 
				new google.maps.LatLng(48.85, -55.90)
			);

			// Listen for the dragend event - part two of bounding code
			google.maps.event.addListener(map, 'dragend', function() {
				if (strictBounds.contains(map.getCenter())) return;

				// We're out of bounds - Move the map back within the bounds

				let c = map.getCenter(),
					x = c.lng(),
					y = c.lat(),
					maxX = strictBounds.getNorthEast().lng(),
					maxY = strictBounds.getNorthEast().lat(),
					minX = strictBounds.getSouthWest().lng(),
					minY = strictBounds.getSouthWest().lat();

					if (x < minX) x = minX;
					if (x > maxX) x = maxX;
					if (y < minY) y = minY;
					if (y > maxY) y = maxY;

				map.setCenter(new google.maps.LatLng(y, x));
			}); //-> End bounding code

			// Limit the zoom level
			google.maps.event.addListener(map, 'zoom_changed', function() {
				if (map.getZoom() < minZoomLevel) map.setZoom(minZoomLevel);
			});

			google.maps.event.addListener(infowindow, 'domready', function() {

				// Reference to the DIV which receives the contents of the infowindow using jQuery
				let iwOuter = $('.gm-style-iw');

				/* The DIV we want to change is above the .gm-style-iw DIV.
				* So, we use jQuery and create a iwBackground variable,
				* and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
				*/
				let iwBackground = iwOuter.prev().remove();
				iwOuter.next().html('<img src="http://localhost:3000/fit-for-the-cure/assets/images/close.png">');

			});
		});
		
	}

	render(){
		return (
			<div ref="map" id="map"></div>
		)
	}
}
function codeAddress() {
    var address = document.getElementById('address').value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
    if (customerMarker) customerMarker.setMap(null);
        customerMarker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
        });
    closest = findClosestN(results[0].geometry.location,10);
        // get driving distance
        closest = closest.splice(0,3);
        calculateDistances(results[0].geometry.location, closest,3);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

function findClosestN(pt,numberOfResults) {
   var closest = [];
   document.getElementById('info').innerHTML += "processing "+gmarkers.length+"<br>";
   for (var i=0; i<gmarkers.length;i++) {
     gmarkers[i].distance = google.maps.geometry.spherical.computeDistanceBetween(pt,gmarkers[i].getPosition());
     document.getElementById('info').innerHTML += "process "+i+":"+gmarkers[i].getPosition().toUrlValue(6)+":"+gmarkers[i].distance.toFixed(2)+"<br>";
     gmarkers[i].setMap(null);
     closest.push(gmarkers[i]);
   }
   closest.sort(sortByDist);
   return closest;
}

function sortByDist(a,b) {
   return (a.distance- b.distance)
}

function calculateDistances(pt,closest,numberOfResults) {
  var service = new google.maps.DistanceMatrixService();
  var request =    {
      origins: [pt],
      destinations: [],
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    };
  for (var i=0; i<closest.length; i++) request.destinations.push(closest[i].getPosition());
  service.getDistanceMatrix(request, function (response, status) {
    if (status != google.maps.DistanceMatrixStatus.OK) {
      alert('Error was: ' + status);
    } else {
      var origins = response.originAddresses;
      var destinations = response.destinationAddresses;
      var outputDiv = document.getElementById('side_bar');
      outputDiv.innerHTML = '';

      var results = response.rows[0].elements;
      for (var i = 0; i < numberOfResults; i++) {
        closest[i].setMap(map);
        outputDiv.innerHTML += "<a href='javascript:google.maps.event.trigger(closest["+i+"],\"click\");'>"+closest[i].title + '</a><br>' + closest[i].address+"<br>"
            + results[i].distance.text + ' appoximately '
            + results[i].duration.text + '<br><hr>';
      }
    }
  });
}
export default Map;