
NeighborhoodMapProject  is a simple project that leverage knockoutjs library , google map API and Four Square Api with bootstrap to list BRAT Station on google map. The project leverages knockoutjs component to component interaction and local storage. Communication between components are using pub sub model .

 ## The project structures

  /Src 
   / app 
   / components 
  / bower modules

## Config 
Under the app folder, the require.config.js , register all the dependency to be loaded 
## Components 
In the app folder, all the knockouts components are registered , there are three components 

 *  **location-google-map** - This component manages all google map related functions 

 * **location-list**  - This component loads up the BART station list using FourSquar API’s.  The API response is persisted using local storage. The component renders the BART Station on the page. On clicking on a BART station, the Google Map Marker associated is highlighted with animation. 

* **location-search** - The component will filter the BART location display in the list view as well as on the google maps.  

## Install 

   Bower package manager will install all the dependency for the project using the command 
   **bower update** in the project folder

## Run
  Run the Command  **gulp serve:dist** , which will launch the app at port http://localhost:8080 

## Licience  
   Free
