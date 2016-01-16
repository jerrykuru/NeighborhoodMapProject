import ko from 'knockout';
import locationMapTemplate from 'text!./location-map.html';
import google from 'google-map-api';

class LocationMapViewModel {
	constructor() {
		// console.log("locationMapTemplate", locationMapTemplate);
		// console.log("map_canvas", $('#map_canvas')[0]);
		// console.log("googe", window.google);
		// console.log("document", document);
		// console.log("window.google.maps", window.google.maps);
		 var map = window.google.maps.Map(document.getElementById('map_canvas'), {
			zoom: 5,
			center: new window.google.maps.LatLng(55, 11),
			mapTypeId: window.google.maps.MapTypeId.ROADMAP
		});
		 console.log("map", map);
	}



}

export default {
	viewModel: LocationMapViewModel,
	template: locationMapTemplate
};