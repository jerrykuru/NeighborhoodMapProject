import ko from 'knockout';
import locationGoogleMapTemplate from 'text!./location-google-map.html';

class LocationGoogleMapViewModel {


	constructor() {


		// Subsribe to first loading of all BART Stations, so the markers can be rendered on the page
		// Added timeout to ensure that google maps were laoded, this is tech debt. 
		ko.shouter.subscribe(function(bartStations) {
			googleMVContext = {};
			googleMVContext.addMarkerToMap = this.addMarkerToMap;
			googleMVContext.clearAllMarkers = this.clearAllMarkers;
			googleMVContext.bartStations = bartStations;
			this.processBartStations.bind(googleMVContext);
			setTimeout(this.processBartStations, 500)
		}, this, "allStationList");

		//Subsribe to the filtered list of BART Stations , so only the selected markers are visible on the page
		ko.shouter.subscribe(function(bartStations) {
			markers.forEach(this.clearAllMarkers);
			bartStations().enableAnimationForMarker = true;
			bartStations().forEach(this.addMarkerToMap);
		}, this, "filteredStation");

		// Subsribe to the click event selection, to show the animation effect on the page
		ko.shouter.subscribe(function(stationIndex) {
			this.addAnimationForMarker(stationIndex);
		}, this, "stationClicked");

	}

	//This function is on a timer to ensure that google is loaded in the browser prior to this function getting executed.
	processBartStations() {
		bartStations = googleMVContext.bartStations;
		markers.forEach(googleMVContext.clearAllMarkers);
		bartStations().enableAnimationForMarker = false;
		bartStations().forEach(googleMVContext.addMarkerToMap);
	}

	//Remove all the markers from the page/map
	clearAllMarkers(item, index, array) {
		markers[index].setMap(null);
	}

	// Add the markers to the page/map
	addAnimationForMarker(stationIndex) {
		if(localStorage.currentClickedStationIndex != undefined){
			console.log("localStorage.currentClickedStationIndex",localStorage.currentClickedStationIndex);
			Oldmarker = markers[localStorage.currentClickedStationIndex];
			Oldmarker.setAnimation(null);
			console.log(Oldmarker.infoWindow);
		//	Oldmarker.infoWindow.close();
		}
		var marker = markers[stationIndex];
		var stations = JSON.parse(localStorage.stations);
		var nameOfStation = stations[stationIndex].name;
		var infowindow = new google.maps.InfoWindow({
			content: nameOfStation
		});
		
		marker.setAnimation(google.maps.Animation.BOUNCE);
		localStorage.currentClickedStationIndex = stationIndex;
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