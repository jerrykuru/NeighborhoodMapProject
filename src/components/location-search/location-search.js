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
			} else {
				ko.shouter.notifySubscribers(newValue, "filteredStationInSearch");
			}
		});

	}

}

export default {
	viewModel: LocationSearchViewModel,
	template: locationSearchTemplate
};