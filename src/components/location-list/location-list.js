import ko from 'knockout';
import locationListTemplate from 'text!./location-list.html';

class LocationListViewModel {

	constructor() {
		this.bartStations = ko.observableArray();
		this.calcArea(this.bartStations,this.publishStation);
		this.filterList();
		this.publishStation(this.bartStations);
	}

	publishStation(bartStations) {
		console.log("going",bartStations().length);
		ko.shouter.notifySubscribers(bartStations, "stationListToPublish");
	}

	filterList() {
		ko.shouter.subscribe(function(newValue) {
			this.bartStations.remove(function(item) {
				var stationName = item.name;
				var include = stationName.startsWith(newValue);
				return !include;
			});
			this.publishStation();
		}, this, "stationLocationSearchMessageToPublish");
	}

	calcArea(bartStations,publishStation) {
		$.when(this.loadBratStationData()).then(
			function(status) {
				bartStations.push.apply(bartStations, status);
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


	loadBratStationData() {
		var url = 'http://api.foursquare.com/v2/venues/search?client_id=I42W0CXRXTBJXQWBWOEPPKOL2B4ALPZ13ZFDEBHQPYWPYYBL&client_secret=5XHY3JAHXN4041DYGLZBBWNG0KZA20YVCJRQONOQZXGOOIVQ&v=20160115&ll=37.78,-122.41&query=BART Station';

		var dfd = jQuery.Deferred();
		$.getJSON(url, function(data) {
			var stations = data.response.venues;
			dfd.resolve(stations);
		}).fail(function(e) {
			dfd.reject(e);
		});
		return dfd.promise();
	}

	


}

export default {
	viewModel: LocationListViewModel,
	template: locationListTemplate
};