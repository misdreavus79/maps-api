import React from "react";
import GoogleMapsLoader from 'google-maps';
import MarkerClusterer from '../lib/markerclusterer';


GoogleMapsLoader.KEY = 'AIzaSyAB7r33BhATA6R6-UiifezDB4CM5ZMRdco';

class Map extends React.Component {
  constructor(){
    super();
  }
  componentDidMount(){
    GoogleMapsLoader.load(function(google) {
  let mapDiv = document.getElementById('map'), minZoomLevel = 5;
  let map = new google.maps.Map(mapDiv, {
    center: {lat: 37.540, lng: -96.546},
    zoom: minZoomLevel,
    mapTypeControl: false,
    streetViewControl: false,
    scrollwheel: false,
    styles: [
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [
                { color: '#fbf1e6' },
                { visibility: 'simplified' }
              ]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [
                { color: '#FFFFFF' },
                { visibility: 'on' }
              ]
            }, 
            {
              featureType: 'road',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' }
              ]
            },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text',
              stylers: [
                { visibility: 'simplified' },
                { color: '#f186ce' }
              ]
            }, 
            {
              featureType: 'administrative.province',
              elementType: 'labels.text',
              stylers: [
                { visibility: 'off' },
              ]
            },
            {
              featureType: 'administrative.country',
              elementType: 'labels.text',
              stylers: [
                { visibility: 'off' },
              ]
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [
                { visibility: 'on' },
                { color: '#f6f6f6' }
              ]
            }, 
            {
              featureType: 'poi',
              elementType: 'all',
              stylers: [
              { visibility: 'on' },
                { color: '#ffffff' }
              ]
            }
          ]
  });

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
      }
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
    fillColor: 'green',
    strokeWeight: 10,
    icon: assetsUrl + 'images/marker.png'
  });
   // Bounds for North America
   let strictBounds = new google.maps.LatLngBounds(
     new google.maps.LatLng(28.70, -127.50), 
     new google.maps.LatLng(48.85, -55.90)
   );

   // Listen for the dragend event
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
   });

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
}