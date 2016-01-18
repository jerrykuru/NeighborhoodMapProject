import ko from 'knockout';
import locationGoogleMapTemplate from 'text!./location-google-map.html';

class LocationGoogleMapViewModel {

	constructor() {

		ko.shouter.subscribe(function(bartStations) {
			markers.forEach(this.clearAllMarkers);
			bartStations().enableAnimationForMarker = false;
			bartStations().forEach(this.addMarkerToMap);
		}, this, "allStationList");

		ko.shouter.subscribe(function(bartStations) {
			markers.forEach(this.clearAllMarkers);
			bartStations().enableAnimationForMarker = true;
			bartStations().forEach(this.addMarkerToMap);
		}, this, "filteredStation");

		ko.shouter.subscribe(function(stationIndex) {
			this.addAnimationForMarker(stationIndex);
		}, this, "stationClicked");

	}

	clearAllMarkers(item, index, array) {
		markers[index].setMap(null);
	}

	addAnimationForMarker(stationIndex) {
		var marker = markers[stationIndex];
		var infowindow = new google.maps.InfoWindow({
			content: name
		});
		marker.setAnimation(google.maps.Animation.BOUNCE);
		infowindow.open(map, marker);
	}

	addMarkerToMap(item, index, stationList) {
		this.name = item.name;
		this.lat = ko.observable(item.location.lat);
		this.long = ko.observable(item.location.lng);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(item.location.lat, item.location.lng),
			title: name,
			map: map,
			draggable: true
		});

		var infowindow = new google.maps.InfoWindow({
			content: name
		});

		google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				infowindow.open(map, marker);
			}
		}.bind(this));

		if (stationList.enableAnimationForMarker) {
			marker.setAnimation(google.maps.Animation.BOUNCE);
			infowindow.open(map, marker);
		};

		markers.push(marker);

	}



}

export default {
	viewModel: LocationGoogleMapViewModel,
	template: locationGoogleMapTemplate
};