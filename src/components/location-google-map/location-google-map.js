import ko from 'knockout';
import locationGoogleMapTemplate from 'text!./location-google-map.html';

class LocationGoogleMapViewModel {

	constructor() {

		ko.shouter.subscribe(function(bartStations) {
			window.markers.forEach(this.clearAllMarkers);
			bartStations().enableAnimationForMarker = false;
			bartStations().forEach(this.addMarkerToMap);
		}, this, "allStationList");

		ko.shouter.subscribe(function(bartStations) {
			window.markers.forEach(this.clearAllMarkers);
			bartStations().enableAnimationForMarker = true;
			bartStations().forEach(this.addMarkerToMap);
		}, this, "filteredStation");

		ko.shouter.subscribe(function(stationIndex) {
			this.addAnimationForMarker(stationIndex);
		}, this, "stationClicked");

	}

	clearAllMarkers(item, index, array) {
		window.markers[index].setMap(null);
	}

	addAnimationForMarker(stationIndex) {
		var marker = window.markers.indexOf(stationIndex);
		marker.setAnimation(window.google.maps.Animation.BOUNCE);
		infowindow.open(window.map, marker);
	}

	addMarkerToMap(item, index, stationList) {
		this.name = item.name;
		this.lat = ko.observable(item.location.lat);
		this.long = ko.observable(item.location.lng);
		var marker = new window.google.maps.Marker({
			position: new window.google.maps.LatLng(item.location.lat, item.location.lng),
			title: name,
			map: window.map,
			draggable: true
		});

		var infowindow = new google.maps.InfoWindow({
			content: name
		});


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

		window.google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(window.google.maps.Animation.BOUNCE);
				infowindow.open(window.map, marker);
			}
		}.bind(this));

		if (stationList.enableAnimationForMarker) {
			marker.setAnimation(window.google.maps.Animation.BOUNCE);
			infowindow.open(window.map, marker);
		};

		window.markers.push(marker);

	}



}

export default {
	viewModel: LocationGoogleMapViewModel,
	template: locationGoogleMapTemplate
};