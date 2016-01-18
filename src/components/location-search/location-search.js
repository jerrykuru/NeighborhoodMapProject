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
	//This function is called from UI when the filter button is clicked.  
	// the input value is published to the component "location-list" for further processing.
	doSomething() {
		ko.shouter.notifySubscribers(this.searchStation(), "filteredStationInSearch");
	}
}

export default {
	viewModel: LocationSearchViewModel,
	template: locationSearchTemplate
};