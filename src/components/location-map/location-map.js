import ko from 'knockout';
import locationMapTemplate from 'text!./location-map.html';
import google from 'google-map-api';

class LocationMapViewModel {
	constructor() {
		
		var myLatLng = {
			lat: -25.363,
			lng: 131.044
		};

		// Create a map object and specify the DOM element for display.
		var map = new window.google.maps.Map(document.getElementById('map_canvas'), {
			center: myLatLng,
			scrollwheel: false,
			zoom: 4
		});

		// Create a marker and set its position.
		var marker = new window.google.maps.Marker({
			map: map,
			position: myLatLng,
			title: 'Hello World!'
		});

		console.log(map);
	}

}

export default {
	viewModel: LocationMapViewModel,
	template: locationMapTemplate
};