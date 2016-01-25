import ko from 'knockout';
import locationSearchTemplate from 'text!./location-search.html';
import {
	stationPlaceholder
}
from 'app/constants.js'

class LocationSearchViewModel {
	constructor() {
		this.searchStation = ko.observable(stationPlaceholder);
		this.searchStation.subscribe(function(newValue) {
			if (newValue.length === 0) {
				var bartStations = JSON.parse(localStorage.stations);
				ko.shouter.notifySubscribers(bartStations, "allStationListRefresh");
			} else if (newValue === "BART") {
				var bartStations = JSON.parse(localStorage.stations);
				ko.shouter.notifySubscribers(bartStations, "allStationListRefresh");
			} else {
				console.log("newValue",newValue);
				ko.shouter.notifySubscribers(newValue, "filteredStationInSearch");
			}
		}, this);

	}

	clearPlaceholder() {
		this.searchStation('');
	}


}

export default {
	viewModel: LocationSearchViewModel,
	template: locationSearchTemplate
};