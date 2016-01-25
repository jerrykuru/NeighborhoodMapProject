import ko from 'knockout';
import locationListTemplate from 'text!./location-list.html';

class LocationListViewModel {

	constructor() {
		this.bartStations = ko.observableArray();
		this.shouldShowMessage = ko.observable(false);
		this.loadBartStation(this.bartStations, this.publishStation, this.shouldShowMessage);
		this.filterList();
		this.publishStation(this.bartStations, this.shouldShowMessage);
		//Refresh the list of BART Stations if the user make the search input box empty
		ko.shouter.subscribe(function(stations) {
			this.bartStations.removeAll();
			var stationsobservableArray = this.bartStations;
			stationsobservableArray().push.apply(stationsobservableArray(), stations);
			this.bartStations = stationsobservableArray;
			// Had to do this to trigger the observal of Array
			this.bartStations.push(stations[0]);
			ko.shouter.notifySubscribers(this.bartStations(), "allStationList");
		}, this, "allStationListRefresh");

		//hide the list view when a user clicks on a location
		ko.shouter.subscribe(function() {
			$('button[data-toggle]').click();
		}, this, "hideListView");

	}

	//Publish the list of station for the component "location-google-map " to subscribe 
	publishStation(bartStations, shouldShowMessage) {
		console.log("bartStations.length", bartStations.length);
		if (bartStations.length === 0) {
			shouldShowMessage(true);
		} else {
			shouldShowMessage(false);
		}
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
			this.bartStations.removeAll();
			var stations = JSON.parse(localStorage.stations);
			this.bartStations().push.apply(this.bartStations(), stations);
			//Iterating over the stations , convert the search string to lowercase , 
			//convert the station in the collection to lower case. Any hit will be included in the list view. 
			this.bartStations.remove(function(item) {
				var stationName = item.name;
				var newValueLowerCase = newValue.toLocaleLowerCase();
				var lowerCaseCompare = stationName.toLocaleLowerCase().indexOf(newValueLowerCase);
				var finalResult = (lowerCaseCompare > -1);
				return !finalResult;
			});
			this.publishFiltredStation(this.bartStations);


		}, this, "filteredStationInSearch");
	}

	// JQUERY Promise to handle aync loading of data 
	loadBartStation(bartStations, publishStation, shouldShowMessage) {
		$.when(this.loadBratStationData()).then(
			function(status) {
				bartStations.push.apply(bartStations, status);
				//store the resultset to local storage
				localStorage.stations = JSON.stringify(bartStations());
				publishStation(bartStations(), shouldShowMessage);
			},
			function(status) {
				console.log(" you fail this time");
				publishStation(bartStations());
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

		$.ajax({
			type: "POST",
			url: url,
			dataType: 'jsonp',
			success: function(data) {
				var stations = data.response.venues;
				dfd.resolve(stations);
			},
			error: function(request, status, error) {
				var stations = [];
				dfd.reject(stations);
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