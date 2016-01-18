import ko from 'knockout';
import locationMapTemplate from 'text!./location-map.html';
import google from 'google-map-api';

class LocationMapViewModel {
	constructor() {
      	this.markerList();
	}

	point(item, index, array) {
		map = new window.google.maps.Map(document.getElementById('map_canvas'), {
			zoom: 10,
			center: new window.google.maps.LatLng(37.78, -122.41),
			mapTypeId: window.google.maps.MapTypeId.ROADMAP
		});

		var marker = new window.google.maps.Marker({
			position: new window.google.maps.LatLng(item.location.lat, item.location.lng),
			title: item.name,
			map: map,
			draggable: true
		});

	}


	markerList() {
		ko.shouter.subscribe(function(bartStations) {
			if (bartStations != undefined) {
				bartStations().forEach(this.point);
			}
		}, this, "stationListToPublish");
	}
}



export default {
	viewModel: LocationMapViewModel,
	template: locationMapTemplate
};