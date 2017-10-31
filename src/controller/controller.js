/*
The Controller handles events from the UI that have some effect on routing or
data fetching. It is a "thin" class that mostly proxies events to the router and
data manager, and facilitates communication between them.
*/

import Router from './router';
// import DataManager from './data-manager';

class Controller {
  constructor(opts) {
    console.log('controller constructor this', this);
    const store = this.store = opts.store;
    const config = this.config = opts.config;
    const eventBus = this.eventBus = opts.eventBus;
    this.history = window.history;

    // the router and data manager need a ref to the controller
    opts.controller = this;

    // create data manager
    // const dataManager = this.dataManager = new DataManager(opts);

    // create router
    // opts.dataManager = dataManager;
    this.router = new Router(opts);
  }

  /*
  EVENT HANDLERS
  */

  appDidLoad() {
    // route once on load
    console.log('controller appDidLoad is running, this', this);
    this.router.hashChanged();
  }

  handleHalfButtonClick(e) {
    console.log('controller handleHalfButtonClick is running, e:', e, 'this:', this);
    this.router.routeToRoute('half');
  }
  handleFullButtonClick(e) {
    console.log('controller handleFullButtonClick is running, e:', e, 'this:', this);
    this.router.routeToRoute('full');
  }

  // handleSearchFormSubmit(e) {
  //   console.log('handle search form submit', e, this);
  //   const input = e.target[0].value;
  //
  //   // this.store.commit('setClickCoords', null);
  //   this.store.commit('setGeocodeStatus', null);
  //
  //   // tell router
  //   this.router.routeToAddress(input);
  // }

  // handleMapClick(e) {
  //   console.log('handle map click', e, this);
  //
  //   // TODO figure out why form submits via enter key are generating a map
  //   // click event and remove this
  //   if (e.originalEvent.keyCode === 13) {
  //     return;
  //   }
  //   // this.store.commit('setLastSearchMethod', 'reverseGeocode');
  //   // this.store.commit('setClickCoords', null);
  //
  //   // get parcels that intersect map click xy
  //   const latLng = e.latlng;
  //   // this.store.commit('setClickCoords', latLng);
  // }
}

export default Controller;
