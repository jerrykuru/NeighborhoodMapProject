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
			console.log("newValue", newValue);
			console.log("newValue.length", newValue.length);
			ko.shouter.notifySubscribers(newValue, "filteredStationInSearch");
		});

	}

}

export default {
	viewModel: LocationSearchViewModel,
	template: locationSearchTemplate
};