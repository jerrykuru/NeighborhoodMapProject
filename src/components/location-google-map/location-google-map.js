import ko from 'knockout';
import locationGoogleMapTemplate from 'text!./location-google-map.html';

class LocationGoogleMapViewModel {

	constructor() {
		ko.shouter.subscribe(function(bartStations) {
			window.markers.forEach(this.clearAllMarkers);
			bartStations().forEach(this.point);
		}, this, "stationListToPublish");
	}

	clearAllMarkers(item, index, array) {
		window.markers[index].setMap(null);
	}

	point(item, index, array) {
		this.name = item.name;
		this.lat = ko.observable(item.location.lat);
		this.long = ko.observable(item.location.lng);

		var marker = new window.google.maps.Marker({
			position: new window.google.maps.LatLng(item.location.lat, item.location.lng),
			title: name,
			map: window.map,
			draggable: true
		});


		window.markers.push(marker);


		//if you need the poition while dragging
		window.google.maps.event.addListener(marker, 'drag', function() {
			var pos = marker.getPosition();
			this.lat(pos.lat());
			this.long(pos.lng());
		}.bind(this));

		//if you just need to update it when the user is done dragging
		window.google.maps.event.addListener(marker, 'dragend', function() {
			var pos = marker.getPosition();
			this.lat(pos.lat());
			this.long(pos.lng());
		}.bind(this));
	}

}

export default {
	viewModel: LocationGoogleMapViewModel,
	template: locationGoogleMapTemplate
};