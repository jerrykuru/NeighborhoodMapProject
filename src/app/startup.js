import 'jquery';
import 'bootstrap';
import ko from 'knockout';
import 'knockout-projections'
import * as router from './router';


// Components can be packaged as AMD modules, such as the following:
ko.components.register('location-search', { require: 'components/location-search/location-search' });
ko.components.register('location-list', { require: 'components/location-list/location-list' });
ko.components.register('location-google-map', { require: 'components/location-google-map/location-google-map' });
ko.shouter = new ko.subscribable();

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('app-menu', {
    template: { require: 'text!components/app-menu/app-menu.html' }
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]

// Start the application
ko.applyBindings({ route: router.currentRoute });
