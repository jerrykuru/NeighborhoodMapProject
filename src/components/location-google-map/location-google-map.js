import ko from 'knockout';
import locationGoogleMapTemplate from 'text!./location-google-map.html';

class LocationGoogleMapViewModel {


	constructor() {
		this.shouldShowMessage = ko.observable(false);
		if (window.google === undefined) {
			this.shouldShowMessage = ko.observable(true);
		}
		// Subsribe to first loading of all BART Stations, so the markers can be rendered on the page
		// Added timeout to ensure that google maps were laoded, this is tech debt. 
		ko.shouter.subscribe(function(bartStations) {
			googleMVContext = {};
			googleMVContext.clearAllMarkers = this.clearAllMarkers;
			googleMVContext.bartStations = bartStations;
			googleMVContext.addMarkerToMap = this.addMarkerToMap;
			this.processBartStations.bind(googleMVContext);
			googleMVContext.shouldShowMessage = this.shouldShowMessage;
			setTimeout(this.processBartStations, 100)
		}, this, "allStationList");

		//Subsribe to the filtered list of BART Stations , so only the selected markers are visible on the page
		ko.shouter.subscribe(function(bartStations) {
			markers.forEach(this.clearAllMarkers);
			bartStations.forEach(this.addMarkerToMap);
		}, this, "filteredStation");

		// Subsribe to the click event selection, to show the animation effect on the page
		ko.shouter.subscribe(function(stationIndex) {
			this.addAnimationForMarker(stationIndex);
			ko.shouter.notifySubscribers({}, "hideListView");
		}, this, "stationClicked");

	}

	//This function is on a timer to ensure that google is loaded in the browser prior to this function getting executed.
	processBartStations() {
		bartStations = googleMVContext.bartStations;
		markers.forEach(googleMVContext.clearAllMarkers);
		if (window.google === undefined) {
			return;
		} else {
			googleMVContext.shouldShowMessage(false);
		}
		bartStations.forEach(googleMVContext.addMarkerToMap);
	}

	//Remove all the markers from the page/map
	clearAllMarkers(item, index, array) {
		markers[index].setMap(null);
	}

	// Add the markers to the page/map
	addAnimationForMarker(stationIndex) {
		if (localStorage.currentClickedStationIndex != undefined) {
			Oldmarker = markers[localStorage.currentClickedStationIndex];
			Oldmarker.setAnimation(null);
		}
		if (openedInfoWindow != null) {
			openedInfoWindow.close();
		}
		var marker = markers[stationIndex];
		var stations = JSON.parse(localStorage.stations);
		var item = stations[stationIndex];
        var infowindow = new google.maps.InfoWindow();
		infowindow.setContent('<div><strong>' + item.name + '</strong><br>Address' + item.location.formattedAddress + 
			'<br>PhoneNumber : '+ item.contact.formattedPhone + '</div>');
		 

		marker.setAnimation(google.maps.Animation.BOUNCE);
		window.setTimeout(function() {
			marker.setAnimation(null);
		}, 3000);
		localStorage.currentClickedStationIndex = stationIndex;
		infowindow.open(map, marker);
		openedInfoWindow = infowindow;
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

		var infowindow = new google.maps.InfoWindow();
		infowindow.setContent('<div><strong>' + item.name + '</strong><br>Address' + item.location.formattedAddress +
		 '<br>PhoneNumber : '+ item.contact.formattedPhone + '</div>');
		
		google.maps.event.addListener(marker, 'click', function() {
			if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
				if (openedInfoWindow != null) {
					openedInfoWindow.close();
				}
			} else {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				infowindow.open(map, marker);
				window.setTimeout(function() {
					marker.setAnimation(null);
				}, 1000);
				openedInfoWindow = infowindow;
			}
		}.bind(this));

		if (item.enableAnimationForMarker != undefined) {
			if (item.enableAnimationForMarker) {
				marker.setAnimation(google.maps.Animation.BOUNCE);
				infowindow.open(map, marker);
				window.setTimeout(function() {
					marker.setAnimation(null);
				}, 1000);
			};
		};

		markers.push(marker);

	}

}

export default {
	viewModel: LocationGoogleMapViewModel,
	template: locationGoogleMapTemplate
};