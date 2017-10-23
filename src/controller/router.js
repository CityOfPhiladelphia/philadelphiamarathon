import { parse as parseUrl } from 'url';

class Router {
  constructor(opts) {
    const config = this.config = opts.config;
    this.store = opts.store;
    this.controller = opts.controller;
    this.eventBus = opts.eventBus;
    this.dataManager = opts.dataManager;
    this.history = window.history;

    // check if the router should be silent (i.e. not update the url or listen
    // for hash changes)
    const silent = this.silent = !config.router || !config.router.enabled;

    // only listen for route changes if routing is enabled
    if (!silent) {
      window.onhashchange = this.hashChanged.bind(this);
    }
  }

  getAddressFromState() {
    // TODO add an address getter fn to config so this isn't ais-specific
    const geocodeData = this.store.state.geocode.data || {};
    const props = geocodeData.properties || {};
    return props.street_address;
  }

  routeToAddress(nextAddress) {
    console.log('Router.routeToAddress', nextAddress);

    if (nextAddress) {
      // check against current address
      const prevAddress = this.getAddressFromState();

      // if the hash address is different, geocode
      if (!prevAddress || nextAddress !== prevAddress) {
        this.dataManager.geocode(nextAddress)
                        .then(this.didGeocode.bind(this));
      }
    }
  }

  // configForBasemap(key) {
  //   return this.config.map.basemaps[key];
  // }

  didGeocode() {
    // console.log('Router.didGeocode');
    const geocodeData = this.store.state.geocode.data;
  }
}

export default Router;
