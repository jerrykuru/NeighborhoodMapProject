import ko from 'knockout';
import locationSearchTemplate from 'text!./location-search.html';

class LocationSearchViewModel {
	constructor() {
		this.searchStation = ko.observable(" Station Location ");
		// this.searchStation.subscribe(function(newValue) {
		// 	console.log("newValue",newValue);
		// 	ko.shouter.notifySubscribers(newValue, "stationLocationSearchMessageToPublish");
		// });
	}
	doSomething() {
		ko.shouter.notifySubscribers(this.searchStation(), "filteredStationInSearch");
	}
}

export default {
	viewModel: LocationSearchViewModel,
	template: locationSearchTemplate
};