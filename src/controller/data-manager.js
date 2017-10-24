/*
The DataManager is responsible for fetching external data (mainly API responses)
and storing them in state.

The router should own an instance of DataManager and make calls to it based on
navigation events.
*/
import L from 'leaflet';
import {
  GeocodeClient
} from './clients';

class DataManager {
  constructor(opts) {
    const store = this.store = opts.store;
    const config = this.config = opts.config;
    this.eventBus = opts.eventBus;
    this.controller = opts.controller;

    // create clients
    this.clients = {};
    const clientOpts = { config, store, dataManager: this };
    this.clients.geocode = new GeocodeClient(clientOpts);
  }

  /* GEOCODING */
  geocode(address) {
    const didGeocode = this.didGeocode.bind(this);
    return this.clients.geocode.fetch(address).then(didGeocode);
  }

  didGeocode(feature) {
    console.log('DataManager.didGeocode:', feature);
    // emit event to event bus
    this.eventBus.$emit('geocodeResult', feature);
    let coords = feature.geometry.coordinates;
    const [lng, lat] = coords;
    const latlng = L.latLng(lat, lng);
    // pan and zoom map
    this.store.commit('setMapCenter', coords);
    this.store.commit('setMapZoom', 19);
  } // end didGeocode

}

export default DataManager;
