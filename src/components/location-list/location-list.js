import ko from 'knockout';
import locationListTemplate from 'text!./location-list.html';

class LocationListViewModel {

	constructor() {
		this.bartStations = ko.observableArray();
		this.loadBartStation(this.bartStations, this.publishStation);
		this.filterList();
		this.publishStation(this.bartStations);
	}

	//Publish the list of station for the component "location-google-map " to subscribe 
	publishStation(bartStations) {
		ko.shouter.notifySubscribers(bartStations, "allStationList");
	}

	//Publish the filtered list of station for the component "location-google-map " to subscribe 
	publishFiltredStation(bartStations) {
		ko.shouter.notifySubscribers(bartStations, "filteredStation");
	}

	//This function subscribes to all the events from the location-search component 
	// On click of the filter button, the input value from the search input is published, this function
	// iterate over the BART collection and remove all the stations that does not match the input value from search. 
	// Once the list is filtered , the list is published to the component "location-google-map " to render the filtered markers
	// one the page
	filterList() {
		ko.shouter.subscribe(function(newValue) {
			this.bartStations.remove(function(item) {
				var stationName = item.name;
				var include = stationName.startsWith(newValue);
				return !include;
			});
			this.publishFiltredStation(this.bartStations);
		}, this, "filteredStationInSearch");
	}

	// JQUERY Promise to handle aync loading of data 
	loadBartStation(bartStations, publishStation) {
		$.when(this.loadBratStationData()).then(
			function(status) {
				bartStations.push.apply(bartStations, status);
				//store the resultset to local storage
				localStorage.stations = JSON.stringify(bartStations());
				publishStation(bartStations);
			},
			function(status) {
				console.log(" you fail this time");
			},
			function(status) {
				console.log("Not Sure=");
			}
		);
	}


	//Call the FourSquare API, list of BART Stations
	loadBratStationData() {
		var url = 'http://api.foursquare.com/v2/venues/search?client_id=I42W0CXRXTBJXQWBWOEPPKOL2B4ALPZ13ZFDEBHQPYWPYYBL&client_secret=5XHY3JAHXN4041DYGLZBBWNG0KZA20YVCJRQONOQZXGOOIVQ&v=20160115&ll=37.78,-122.41&query=BART Station';

		var dfd = jQuery.Deferred();
		// $.getJSON(url, function(data) {
		// 	var stations = data.response.venues;
		// 	dfd.resolve(stations);
		// }).fail(function(e) {
		// 	dfd.reject(e);
		// });

		$.ajax({
			type: "POST",
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				var stations = data.response.venues;
				dfd.resolve(stations);
			}
		});
		return dfd.promise();
	}

	//this function is called on click event of a BART Station. The input to the function is the station details, the
	// full list of BART Station is extracted from localstorage and iterated to find the index
	// Once the index is found for the clicked event, the index is published for the location-google-map component to consume. 
	selectedStation(stationDetails) {
		var stations = JSON.parse(localStorage.stations);
		localStorage.selectedStationId = stationDetails.id;
		for (var index = 0; index < stations.length; index++) {
			if (localStorage.selectedStationId === stations[index].id) {
				ko.shouter.notifySubscribers(index, "stationClicked");
				break;
			}
		}

	}



}

export default {
	viewModel: LocationListViewModel,
	template: locationListTemplate
};